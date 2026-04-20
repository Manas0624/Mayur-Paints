# Quick Order Placement Test Guide

## What Was Fixed
Enhanced error handling in the order creation endpoint to properly catch and report product lookup errors.

## How to Test

### Test 1: Local Testing (Recommended First)
```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
npm run dev

# Browser: http://localhost:5173
```

1. Login with test account
2. Go to `/paints` or `/hardware`
3. Add a product to cart
4. Go to `/cart`
5. Click "Proceed to Address"
6. Select or add an address
7. Click "Proceed to Payment"
8. Select payment method
9. Click "Place Order"
10. Check browser console for logs
11. Should see success message and order confirmation

### Test 2: Production Testing
1. Go to https://mayur-paints.onrender.com (or your frontend URL)
2. Login
3. Add product to cart
4. Proceed through checkout
5. Check browser DevTools → Network tab
6. Look for POST `/api/orders` request
7. Check response status (should be 201 for success)

### Test 3: Check Render Logs
1. Go to https://dashboard.render.com
2. Select your backend service
3. Click "Logs"
4. Place an order from frontend
5. Look for logs like:
   - "📦 Order creation request"
   - "Processing item:"
   - "✅ Found: [Product Name]"
   - "✅ Order created:"

## Expected Behavior

### Success Flow
```
Frontend sends order data
↓
Backend receives and logs request
↓
Backend looks up each product
↓
Backend validates stock
↓
Backend deducts stock
↓
Backend creates order
↓
Backend returns 201 with order data
↓
Frontend shows success message
↓
User redirected to payment or dashboard
```

### Error Scenarios

**Scenario 1: Product Not Found**
- Error: "Product not found: [productId]"
- Cause: Product ID doesn't exist in database
- Fix: Run seed script to populate products

**Scenario 2: Insufficient Stock**
- Error: "Insufficient stock for [productName]. Available: X, Requested: Y"
- Cause: Not enough stock
- Fix: Run seed script or manually update stock

**Scenario 3: Invalid Address**
- Error: "Complete shipping address is required"
- Cause: Missing address fields
- Fix: Fill all address fields in step 2

**Scenario 4: Invalid Product Type**
- Error: "Invalid product type: [type]"
- Cause: Product type is not 'paint' or 'hardware'
- Fix: Check PaintsShop/HardwareShop are adding type correctly

## Debugging Commands

### Check if products exist
```bash
# In MongoDB Atlas or mongosh:
db.paints.countDocuments()
db.hardwares.countDocuments()

# Should return > 0
```

### Check product structure
```bash
db.paints.findOne()
# Should have: _id, name, price, stock, category, etc.
```

### Check orders collection
```bash
db.orders.find().pretty()
# Should show created orders
```

## Success Indicators
✅ Order created successfully
✅ Order appears in user dashboard
✅ Stock is deducted from products
✅ Order number is generated (ORD-XXXXXXXXX)
✅ Payment status is "pending"
✅ Order status is "pending"

## If Still Not Working

1. **Check Render logs in real-time**
   - Open Render dashboard
   - Click "Logs"
   - Place order and watch logs appear

2. **Verify MongoDB connection**
   - Check MONGO_URI in server/.env
   - Test connection: `mongosh "mongodb+srv://..."`

3. **Check authentication**
   - Verify token is being sent
   - Check DevTools → Network → Headers
   - Should have: `Authorization: Bearer [token]`

4. **Verify CORS**
   - Check if frontend domain is in allowedOrigins
   - server/index.js line ~50

5. **Check product IDs**
   - Get a product ID from database
   - Manually test API with that ID
   - Use Postman or curl

## Manual API Test with Curl

```bash
# Get a valid token first (login)
# Then test order creation:

curl -X POST https://mayur-acy3.onrender.com/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "VALID_PAINT_ID",
        "type": "paint",
        "name": "Test Paint",
        "qty": 1,
        "price": 500
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Nashik",
      "state": "Maharashtra",
      "pincode": "42003",
      "phone": "+91 9876543210"
    },
    "paymentMethod": "QR Code"
  }'
```

## Next Steps
1. Test locally first
2. If working locally, test on production
3. If production fails, check Render logs
4. Share logs if you need help debugging
