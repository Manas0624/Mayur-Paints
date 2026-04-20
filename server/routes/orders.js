import express from 'express'
import Order from '../models/Order.js'
import Paint from '../models/Paint.js'
import Hardware from '../models/Hardware.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// GET /api/orders - List orders (admin: all, user: own only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {}

    // Regular users can only see their own orders
    if (req.user.role !== 'admin') {
      query.user = req.user._id
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      count: orders.length,
      data: orders
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    })
  }
})

// GET /api/orders/:id - Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      })
    }

    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    })
  }
})

// POST /api/orders - Create order (authenticated users)
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('📦 Order creation request')
    console.log('User:', req.user._id)
    console.log('Body:', JSON.stringify(req.body, null, 2))
    
    const { items, shippingAddress, paymentMethod } = req.body

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      })
    }

    // Validate address
    const address = shippingAddress || {}
    if (!(address.street || address.addressLine1) || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      })
    }

    // Normalize address
    const normalizedAddress = {
      street: address.street || address.addressLine1 || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      phone: address.phone || '',
      fullName: address.fullName || address.name || ''
    }

    // Process items
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      console.log('Processing item:', item)
      
      const productId = item.productId || item.id
      const itemType = (item.type || 'paint').toLowerCase()
      const quantity = item.qty || 1

      console.log(`Looking for ${itemType} with ID: ${productId}`)

      let product
      if (itemType === 'paint') {
        product = await Paint.findById(productId)
      } else {
        product = await Hardware.findById(productId)
      }

      if (!product) {
        console.log(`❌ Product not found: ${productId}`)
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || productId}`
        })
      }

      console.log(`✅ Found: ${product.name}`)

      // Check stock
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        })
      }

      // Deduct stock
      product.stock -= quantity
      await product.save()

      // Add to order
      orderItems.push({
        product: product._id,
        productType: itemType === 'paint' ? 'Paint' : 'Hardware',
        name: product.name,
        price: product.price,
        quantity
      })

      totalAmount += product.price * quantity
    }

    // Create order
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    const order = await Order.create({
      orderId,
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: normalizedAddress,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending'
    })

    console.log('✅ Order created:', order._id)

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    })
  } catch (error) {
    console.error('❌ Order creation error:', error.message)
    console.error('Stack:', error.stack)
    
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    })
  }
})

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      })
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    })
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    })
  }
})

export default router
