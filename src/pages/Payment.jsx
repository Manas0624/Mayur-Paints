import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'
import api from '../api'

export default function Payment({ cartCount, userRole }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user: currentUser } = useSelector(s => s.auth)
  
  const [loading, setLoading] = useState(false)
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
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

  function handleScreenshotChange(e) {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      
      setScreenshot(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setScreenshotPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handlePlaceOrder() {
    if (!screenshot) {
      toast.error('Please upload payment screenshot')
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('screenshot', screenshot)
      formData.append('orderId', orderId)
      formData.append('amount', amount)
      formData.append('shippingAddress', JSON.stringify(shippingAddress))

      const response = await api.post('/payments/submit-payment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        toast.success('Order placed successfully! Pending admin verification.')
        navigate('/orders', { 
          state: { 
            message: 'Your order has been placed and is pending payment verification.',
            orderId: response.data.data.order._id
          } 
        })
      } else {
        toast.error(response.data.message || 'Failed to place order')
      }
    } catch (error) {
      console.error('Place order error:', error)
      toast.error(error.response?.data?.message || 'Failed to place order')
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
              Scan QR code, pay, and upload screenshot
            </p>
          </div>

          {/* Payment Amount */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Amount</p>
            <p className="text-4xl font-black text-primary">₹{amount?.toLocaleString()}</p>
          </div>

          {/* QR Code Section */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-bold text-center mb-6">Scan QR Code to Pay</h2>
            
            <div className="flex flex-col items-center">
              {/* Static QR Code Image */}
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                <img 
                  src="/payment-qr.jpg" 
                  alt="Payment QR Code"
                  className="w-72 h-auto rounded-lg"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f1f5f9" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%2364748b"%3EPlace QR image at%3C/text%3E%3Ctext x="50%25" y="60%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%2364748b"%3Epublic/payment-qr.jpg%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
              
              <div className="text-center mb-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Scan with any UPI app to pay
                </p>
                <div className="flex items-center justify-center gap-2 text-slate-500">
                  <span className="material-symbols-outlined">account_balance</span>
                  <span className="text-sm">Manas Hitendra Shinde</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">UPI: manashshinde@okaxis</p>
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
                <span>Take a screenshot of payment confirmation</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">6.</span>
                <span>Upload screenshot below and place order</span>
              </li>
            </ol>
          </div>

          {/* Upload Screenshot Section */}
          <div className="mb-8">
            <label className="block font-bold mb-4 text-lg">Upload Payment Screenshot *</label>
            
            {!screenshotPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary transition-all bg-slate-50 dark:bg-slate-800">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="material-symbols-outlined text-5xl text-slate-400 mb-3">cloud_upload</span>
                  <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG or GIF (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={screenshotPreview}
                  alt="Screenshot preview"
                  className="w-full h-auto rounded-xl border-2 border-slate-200 dark:border-slate-700"
                />
                <button
                  onClick={() => {
                    setScreenshot(null)
                    setScreenshotPreview(null)
                  }}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  ✓ Screenshot uploaded
                </div>
              </div>
            )}
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
              disabled={!screenshot || submitting}
              className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                Your order will be confirmed after admin verifies your payment screenshot. 
                You'll receive a notification once verified.
              </span>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
