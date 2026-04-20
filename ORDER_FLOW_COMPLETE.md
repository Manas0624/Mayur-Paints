# Complete Order Flow Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────┤
│  PaintsShop/HardwareShop → Add to Cart → Redux Store       │
│                                ↓                             │
│                          Cart Page                           │
│                    (3-Step Checkout)                         │
│                                ↓                             │
│  Step 1: Review Items → Step 2: Address → Step 3: Payment  │
│                                ↓                             │
│                    API Call: POST /api/orders               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                        │
├─────────────────────────────────────────────────────────────┤
│  1. Authenticate user (JWT token)                           │
│  2. Validate request body                                   │
│  3. For each item:                                          │
│     - Look up product (Paint or Hardware)                   │
│     - Validate stock                                        │
│     - Deduct stock                                          │
│  4. Create Order document                                   │
│  5. Return order with ID                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB)                        │
├─────────────────────────────────────────────────────────────┤
│  Collections:                                               │
│  - paints (Paint products)                                  │
│  - hardwares (Hardware products)                            │
│  - orders (Order documents)                                 │
│  - users (User accounts)                                    │
└─────────────────────────────────────────────────────────────┘
```

## Step-by-Step Order Creation Flow

### Step 1: Frontend - Add to Cart
**File**: `src/pages/PaintsShop.jsx` or `src/pages/HardwareShop.jsx`

```javascript
function handleAddToCart(product) {
  // Add type field to product
  onAddToCart({ ...product, type: 'paint' })  // or 'hardware'
  
  // Dispatch to Redux
  dispatch(addItem({
    id: product._id,
    name: product.name,
    price: product.price,
    type: 'paint',  // IMPORTANT: lowercase
    qty: 1,
    imageUrl: product.image,
    brand: product.brand
  }))
}
```

**Redux State** (`src/redux/cartSlice.js`):
```javascript
{
  items: [
    {
      id: "507f1f77bcf86cd799439011",
      name: "Asian Paints Royale",
      price: 499,
      type: "paint",
      qty: 1,
      imageUrl: "...",
      brand: "Asian Paints"
    }
  ],
  totalCount: 1
}
```

### Step 2: Frontend - Checkout Process
**File**: `src/pages/Cart.jsx`

**Step 1 - Review Items**:
- Display cart items
- Allow quantity changes
- Show order summary

**Step 2 - Select Address**:
- Load user's saved addresses
- Allow adding new address
- Select one address

**Step 3 - Select Payment Method**:
- Choose between "Online Payment" (QR Code) or "COD"
- Click "Place Order"

### Step 3: Frontend - API Call
**File**: `src/App.jsx` (handleCheckout function)

```javascript
const handleCheckout = async (shippingAddress, paymentMethod) => {
  const orderItems = cartItems.map(item => ({
    productId: item.id,           // MongoDB ObjectId
    type: item.type,              // 'paint' or 'hardware' (lowercase)
    name: item.name,
    qty: item.qty,
    price: item.price
  }))
  
  const order = await ordersAPI.create({
    items: orderItems,
    shippingAddress: {
      street: "...",
      city: "...",
      state: "...",
      pincode: "...",
      phone: "..."
    },
    paymentMethod: "QR Code" or "COD"
  })
  
  return order
}
```

**API Call** (`src/api.js`):
```javascript
export const ordersAPI = {
  create: async (orderData) => {
    const res = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
    return unwrap(res)
  }
}
```

### Step 4: Backend - Order Creation
**File**: `server/routes/orders.js`

```javascript
router.post('/', authenticateToken, async (req, res) => {
  // 1. Extract data
  const { items, shippingAddress, paymentMethod } = req.body
  
  // 2. Validate items array
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item' })
  }
  
  // 3. Validate address
  if (!shippingAddress.street || !shippingAddress.city || ...) {
    return res.status(400).json({ message: 'Complete shipping address is required' })
  }
  
  // 4. Process each item
  const orderItems = []
  let totalAmount = 0
  
  for (const item of items) {
    // 4a. Look up product
    const productId = item.productId || item.id
    const itemType = (item.type || 'paint').toLowerCase()  // Normalize to lowercase
    
    let product
    if (itemType === 'paint') {
      product = await Paint.findById(productId)
    } else if (itemType === 'hardware') {
      product = await Hardware.findById(productId)
    }
    
    if (!product) {
      return res.status(404).json({ message: `Product not found: ${productId}` })
    }
    
    // 4b. Validate stock
    const quantity = item.qty || 1
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock for ${product.name}` 
      })
    }
    
    // 4c. Deduct stock
    product.stock -= quantity
    await product.save()
    
    // 4d. Add to order items (with capitalized productType)
    orderItems.push({
      product: product._id,
      productType: itemType === 'paint' ? 'Paint' : 'Hardware',  // CAPITALIZED
      name: product.name,
      price: product.price,
      quantity: quantity
    })
    
    totalAmount += product.price * quantity
  }
  
  // 5. Create order
  const order = await Order.create({
    orderId: `ORD-${Date.now()}-${random}`,
    user: req.user._id,
    items: orderItems,
    totalAmount: totalAmount,
    shippingAddress: normalizedAddress,
    paymentMethod: paymentMethod || 'cod',
    status: 'pending',
    paymentStatus: 'pending'
  })
  
  // 6. Return response
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  })
}
```

### Step 5: Backend - Order Schema
**File**: `server/models/Order.js`

```javascript
const orderSchema = new mongoose.Schema({
  orderId: String,              // ORD-1234567890-ABC123
  user: ObjectId,               // Reference to User
  items: [{
    product: ObjectId,          // Reference to Paint or Hardware
    productType: String,        // 'Paint' or 'Hardware' (CAPITALIZED)
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  paymentMethod: String,        // 'QR Code', 'COD', etc.
  paymentStatus: String,        // 'pending', 'paid', 'failed'
  status: String,               // 'pending', 'confirmed', 'shipped', etc.
  createdAt: Date,
  updatedAt: Date
})
```

### Step 6: Frontend - Handle Response
**File**: `src/pages/Cart.jsx`

```javascript
const handlePlaceOrder = async () => {
  try {
    const order = await onCheckout(formattedAddress, paymentMethod)
    
    if (order && order._id) {
      if (paymentMethod === 'online') {
        // Redirect to payment page with QR code
        navigate('/payment', {
          state: {
            orderId: order._id,
            amount: total,
            shippingAddress: selectedAddress
          }
        })
      } else {
        // COD - show success
        setOrderComplete(true)
        triggerConfetti()
        toast.success('Order placed successfully!')
      }
    }
  } catch (error) {
    toast.error(error.message || 'Failed to place order')
  }
}
```

## Data Transformations

### Frontend → Backend
```javascript
// Frontend sends (lowercase type):
{
  items: [
    {
      productId: "507f...",
      type: "paint",        // lowercase
      qty: 1,
      price: 499
    }
  ]
}

// Backend receives and processes:
// - Normalizes type to lowercase: 'paint'
// - Looks up product in Paint collection
// - Converts to capitalized for Order schema: 'Paint'
```

### Backend → Database
```javascript
// Order saved to MongoDB:
{
  _id: ObjectId,
  orderId: "ORD-1234567890-ABC123",
  user: ObjectId,
  items: [
    {
      product: ObjectId,
      productType: "Paint",     // CAPITALIZED in schema
      name: "Asian Paints Royale",
      price: 499,
      quantity: 1
    }
  ],
  totalAmount: 499,
  shippingAddress: {...},
  paymentMethod: "QR Code",
  paymentStatus: "pending",
  status: "pending",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

## Error Handling

### Validation Errors (400)
- Empty items array
- Missing address fields
- Invalid product type

### Not Found Errors (404)
- Product doesn't exist in database
- Order not found (for GET requests)

### Server Errors (500)
- Database connection issues
- Unexpected errors during processing

## Key Points

1. **Type Field Normalization**
   - Frontend sends: lowercase ('paint', 'hardware')
   - Backend stores: capitalized ('Paint', 'Hardware')

2. **Product Lookup**
   - Uses MongoDB ObjectId from frontend
   - Queries correct collection based on type
   - Validates product exists before processing

3. **Stock Management**
   - Checks stock before deducting
   - Deducts immediately when order created
   - Prevents overselling

4. **Order Generation**
   - Unique orderId: ORD-{timestamp}-{random}
   - Auto-generated on save via pre-save hook
   - Unique constraint prevents duplicates

5. **Address Normalization**
   - Accepts both 'street' and 'addressLine1'
   - Normalizes to single format for storage
   - Validates all required fields

## Testing Checklist

- [ ] Products exist in database
- [ ] Products have correct type field
- [ ] Stock is > 0 for test products
- [ ] User is authenticated (token valid)
- [ ] Address is complete
- [ ] Payment method is selected
- [ ] Order created successfully
- [ ] Stock is deducted
- [ ] Order appears in user dashboard
- [ ] Order number is generated
