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
    console.log('📦 Order creation request received')
    console.log('User:', req.user._id)
    console.log('Request body:', JSON.stringify(req.body, null, 2))
    
    const { items, shippingAddress, paymentMethod } = req.body

    // Validation
    if (!items || items.length === 0) {
      console.log('❌ No items in order')
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      })
    }

    console.log('✅ Items found:', items.length)

    // Handle both address formats
    const address = shippingAddress || {}
    const hasValidAddress = (address.street || address.addressLine1) && 
                           address.city && 
                           address.state && 
                           address.pincode

    if (!hasValidAddress) {
      console.log('❌ Invalid address:', address)
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required (street/addressLine1, city, state, pincode)'
      })
    }

    console.log('✅ Address valid')

    // Normalize address format
    const normalizedAddress = {
      street: address.street || address.addressLine1 || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      phone: address.phone || '',
      fullName: address.fullName || address.name || ''
    }

    // Calculate total and verify stock
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      console.log('Processing item:', JSON.stringify(item))
      
      let product
      let productType

      // Determine product type and fetch product
      const itemType = item.type || item.productType || 'paint'
      console.log('Item type:', itemType)
      
      if (itemType.toLowerCase() === 'paint') {
        console.log('Looking for paint with ID:', item.productId || item.id)
        product = await Paint.findById(item.productId || item.id)
        productType = 'Paint'
      } else if (itemType.toLowerCase() === 'hardware') {
        console.log('Looking for hardware with ID:', item.productId || item.id)
        product = await Hardware.findById(item.productId || item.id)
        productType = 'Hardware'
      } else {
        console.log('Unknown product type:', itemType)
        return res.status(400).json({
          success: false,
          message: `Unknown product type: ${itemType}`
        })
      }

      if (!product) {
        console.log('❌ Product not found with ID:', item.productId || item.id)
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || item.productId || item.id}`
        })
      }

      console.log('✅ Product found:', product.name)

      // Check stock
      const quantity = item.qty || item.quantity || 1
      if (product.stock < quantity) {
        console.log('❌ Insufficient stock for', product.name, '- Available:', product.stock, 'Requested:', quantity)
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${quantity}`
        })
      }

      console.log('✅ Stock available, deducting', quantity)

      // Deduct stock
      product.stock -= quantity
      await product.save()

      // Add to order items
      orderItems.push({
        product: product._id,
        productType,
        name: product.name,
        price: product.price,
        quantity
      })

      totalAmount += product.price * quantity
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    console.log('📝 Creating order with:')
    console.log('  - Order ID:', orderId)
    console.log('  - Items:', orderItems.length)
    console.log('  - Total:', totalAmount)
    console.log('  - Payment Method:', paymentMethod)

    // Create order
    const order = await Order.create({
      orderId,
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: normalizedAddress,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending'
    })

    console.log('✅ Order created successfully:', order._id)

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    })
  } catch (error) {
    console.error('Create order error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    })
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
