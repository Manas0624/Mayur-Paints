# Payment QR Code Setup Guide

## What Changed?

✅ **Simplified Payment Flow:**
- Removed dynamic QR code generation
- Using your static QR code image instead
- Single-step process: Show QR → Upload screenshot → Place order
- No more multi-step wizard

## Setup Instructions

### 1. Add Your QR Code Image

Save your QR code image as: `public/payment-qr.jpg`

**Steps:**
1. Save the QR code image from your phone/screenshot
2. Rename it to: `payment-qr.jpg`
3. Place it in the `public` folder of your project

**File location:**
```
FS/
├── public/
│   └── payment-qr.jpg  ← Your QR code here
├── src/
├── server/
└── ...
```

### 2. Payment Flow

**User Side:**
1. User adds items to cart
2. Clicks "Proceed to Checkout"
3. Fills shipping address (if not already filled)
4. Redirected to Payment page
5. Sees your static QR code with amount to pay
6. Scans QR code with any UPI app
7. Pays ₹[amount]
8. Takes screenshot of payment confirmation
9. Uploads screenshot
10. Clicks "Place Order"
11. Order is placed with status "Pending Verification"

**Admin Side:**
1. Admin goes to `/admin/payments`
2. Sees all pending payments with screenshots
3. Verifies payment screenshot
4. Clicks "Accept" → Order confirmed, user notified
5. Or clicks "Reject" with reason → Order cancelled, user notified

### 3. UPI Details Shown

The payment page displays:
- **Name:** Manas Hitendra Shinde
- **UPI ID:** manashshinde@okaxis
- **Bank:** Union Bank of India 9064
- **Amount:** ₹[order total]

### 4. Backend Changes

**New API Endpoint:**
```
POST /api/payments/submit-payment
```

**Request:**
- `orderId`: Order ID
- `amount`: Payment amount
- `shippingAddress`: JSON string of address
- `screenshot`: Image file (multipart/form-data)

**Response:**
```json
{
  "success": true,
  "message": "Payment submitted successfully. Pending admin verification.",
  "data": {
    "paymentNumber": "PAY-20260417-XXXX",
    "status": "submitted",
    "amount": 5000,
    ...
  }
}
```

### 5. Order Status Flow

**Before Payment:**
- Order Status: `pending`
- Payment Status: `pending`

**After Screenshot Upload:**
- Order Status: `pending`
- Payment Status: `pending`
- Payment Record Status: `submitted`

**After Admin Accepts:**
- Order Status: `confirmed`
- Payment Status: `paid`
- Payment Record Status: `verified`

**After Admin Rejects:**
- Order Status: `cancelled`
- Payment Status: `failed`
- Payment Record Status: `rejected`

### 6. Testing Locally

1. **Start Backend:**
   ```bash
   cd server
   npm start
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Test Flow:**
   - Register/Login as user
   - Add products to cart
   - Fill address
   - Go to payment page
   - Upload any test image as screenshot
   - Place order
   - Login as admin (admin@mayurpaints.com / admin123)
   - Go to `/admin/payments`
   - Verify the payment

### 7. Production Deployment

**Frontend (Vercel/Netlify):**
- Make sure `public/payment-qr.jpg` is committed to git
- Deploy normally - the image will be included

**Backend (Render):**
- Already configured with multer for file uploads
- Screenshots saved to `uploads/payment-screenshots/`
- Make sure `uploads/` folder is in `.gitignore`

### 8. Environment Variables

Update `.env` (already done):
```env
UPI_ID=manashshinde@okaxis
```

Update Render environment variables:
```
UPI_ID=manashshinde@okaxis
```

## File Changes Summary

### Modified Files:
1. ✅ `src/pages/Payment.jsx` - Simplified to single-page flow with static QR
2. ✅ `server/routes/payments.js` - New `/submit-payment` endpoint
3. ✅ `server/.env` - Updated UPI_ID

### Files to Add:
1. ⏳ `public/payment-qr.jpg` - Your QR code image (you need to add this)

## Important Notes

- ⚠️ The QR code image must be named exactly `payment-qr.jpg`
- ⚠️ Place it in the `public` folder (not `src`)
- ⚠️ Commit the image to git so it deploys with your app
- ✅ Payment screenshots are stored in `uploads/payment-screenshots/`
- ✅ Admin can view screenshots in the payment verification dashboard
- ✅ Users can track payment status in their orders page

## Next Steps

1. **Add QR Code Image:**
   - Save your QR code as `public/payment-qr.jpg`

2. **Test Locally:**
   - Run backend and frontend
   - Test the complete payment flow

3. **Commit Changes:**
   ```bash
   git add .
   git commit -m "Simplified payment flow with static QR code"
   git push
   ```

4. **Deploy:**
   - Push to GitHub
   - Render will auto-deploy backend
   - Deploy frontend to Vercel/Netlify

## Troubleshooting

### QR Code Not Showing
- Check file name: Must be `payment-qr.jpg` (case-sensitive)
- Check location: Must be in `public/` folder
- Check file format: JPG/JPEG/PNG supported
- Clear browser cache and refresh

### Screenshot Upload Fails
- Check file size: Max 5MB
- Check file type: Only images (JPG, PNG, GIF)
- Check backend logs for errors

### Payment Not Appearing in Admin Dashboard
- Check order was created successfully
- Check payment status is "submitted"
- Refresh admin payments page
- Check browser console for errors
