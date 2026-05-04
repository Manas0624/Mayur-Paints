import express from 'express'
import Order from '../models/Order.js'
import Paint from '../models/Paint.js'
import Hardware from '../models/Hardware.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// GET /api/orders - List orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {}
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

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
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

// POST /api/orders - Create order - SIMPLIFIED
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('📦 Creating order for user:', req.user._id)
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2))
    
    const { items, shippingAddress, paymentMethod } = req.body

    // Basic validation
    if (!items || items.length === 0) {
      console.log('❌ No items in order')
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      })
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      console.log('❌ Invalid address')
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      })
    }

    // Process items - SIMPLIFIED
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const productId = item.productId || item.id
      const itemType = (item.type || 'paint').toLowerCase()
      const quantity = item.qty || item.quantity || 1
      const price = item.price || 0
      const name = item.name || 'Unknown Product'

      console.log(`📦 Processing: ${name} (${itemType}) x${quantity}`)

      // Add to order items - NO DATABASE LOOKUP
      orderItems.push({
        product: productId,
        productType: itemType === 'paint' ? 'Paint' : 'Hardware',
        name: name,
        price: price,
        quantity: quantity
      })

      totalAmount += price * quantity
    }

    // Create order
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    console.log('📦 Creating order with', orderItems.length, 'items, total:', totalAmount)

    const order = await Order.create({
      orderId,
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: {
        street: shippingAddress.street || shippingAddress.addressLine1,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        phone: shippingAddress.phone
      },
      paymentMethod: paymentMethod || 'cod',
      status: 'pending',
      paymentStatus: 'pending'
    })

    console.log('✅ Order created successfully:', order._id)

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    })
  } catch (error) {
    console.error('❌ Order creation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    })
  }
})

// PUT /api/orders/:id/status - Update order status
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
