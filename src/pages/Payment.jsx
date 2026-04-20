import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'
import { paymentsAPI } from '../api'

export default function Payment({ cartCount, userRole }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user: currentUser } = useSelector(s => s.auth)
  
  const [loading, setLoading] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const orderId = location.state?.orderId
  const amount = location.state?.amount
  const shippingAddress = location.state?.shippingAddress

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to continue')
      navigate('/login')
      return
    }

    if (!orderId || !amount) {
      toast.error('Invalid payment request')
      navigate('/cart')
      return
    }

    // Check if address is provided
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone) {
      toast.error('Please provide shipping address')
      navigate('/cart', { state: { requiresAddress: true } })
      return
    }
  }, [])

  async function handlePlaceOrder() {
    if (!isPaid) {
      toast.error('Please confirm that you have paid')
      return
    }

    setSubmitting(true)
    try {
      // Create a dummy file for the payment submission
      // Since user confirmed payment via checkbox, we don't need a screenshot
      const dummyFile = new File(['payment-confirmed'], 'payment-confirmed.txt', { type: 'text/plain' })
      
      const response = await paymentsAPI.submitPayment(
        orderId,
        amount,
        shippingAddress,
        dummyFile
      )

      if (response.success) {
        toast.success('🎉 Order placed successfully!')
        navigate('/dashboard', { 
          state: { 
            message: 'Your order has been placed successfully!',
            orderId: response.data.order._id
          } 
        })
      } else {
        toast.error(response.message || 'Failed to place order')
      }
    } catch (error) {
      console.error('Place order error:', error)
      toast.error(error.message || 'Failed to place order')
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar cartCount={cartCount} userRole={userRole} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">
              Complete Your Payment
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Scan QR code and pay using any UPI app
            </p>
          </div>

          {/* Payment Amount */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Amount to Pay</p>
            <p className="text-4xl font-black text-primary">₹{amount?.toLocaleString()}</p>
          </div>

          {/* QR Code Section */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-bold text-center mb-6">Scan QR Code to Pay</h2>
            
            <div className="flex flex-col items-center">
              {/* QR Code Image */}
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border-4 border-slate-200">
                <img 
                  src="/payment-qr.jpg" 
                  alt="Payment QR Code"
                  className="w-80 h-auto rounded-lg"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="320"%3E%3Crect fill="%23f1f5f9" width="320" height="320"/%3E%3Ctext x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2364748b"%3EPlace QR image at%3C/text%3E%3Ctext x="50%25" y="55%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2364748b"%3Epublic/payment-qr.jpg%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
              
              <div className="text-center mb-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 font-semibold">
                  Scan with any UPI app to pay
                </p>
                <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 mb-2">
                  <span className="material-symbols-outlined">account_balance</span>
                  <span className="text-sm font-bold">Manas Hitendra Shinde</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">UPI: manashshinde@okaxis</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              Payment Instructions
            </h3>
            <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>Scan the QR code above</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>Enter amount: ₹{amount?.toLocaleString()}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">4.</span>
                <span>Complete the payment</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">5.</span>
                <span>Check the box below to confirm payment</span>
              </li>
            </ol>
          </div>

          {/* Payment Confirmation Checkbox */}
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="w-6 h-6 mt-1 rounded border-2 border-green-500 accent-green-500 cursor-pointer"
              />
              <div>
                <p className="font-bold text-green-900 dark:text-green-100">
                  ✓ I have completed the payment
                </p>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                  By checking this box, you confirm that you have successfully paid ₹{amount?.toLocaleString()} via UPI to the above account.
                </p>
              </div>
            </label>
          </div>

          {/* Shipping Address Summary */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-8">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">local_shipping</span>
              Delivery Address
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p className="font-bold text-slate-900 dark:text-slate-100">{shippingAddress?.fullName}</p>
              <p>{shippingAddress?.phone}</p>
              <p>{shippingAddress?.addressLine1}</p>
              {shippingAddress?.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>{shippingAddress?.city}, {shippingAddress?.state} - {shippingAddress?.pincode}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/cart')}
              className="flex-1 border-2 border-slate-200 dark:border-slate-700 py-4 rounded-xl font-bold hover:border-primary transition-all"
            >
              Back to Cart
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={!isPaid || submitting}
              className={`flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                isPaid && !submitting
                  ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-50'
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Place Order</span>
                </>
              )}
            </button>
          </div>

          {/* Warning */}
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
              <span className="material-symbols-outlined text-lg">warning</span>
              <span>
                Make sure you have completed the UPI payment before checking the box. 
                Your order will be confirmed immediately after you place it.
              </span>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
