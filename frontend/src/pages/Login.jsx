import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1: phone, 2: otp
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { sendOtp, verifyOtp } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }
    setLoading(true)
    setError('')
    const res = await sendOtp(phone)
    if (res.success) {
      setStep(2)
    } else {
      setError(res.error || 'Failed to send OTP')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }
    setLoading(true)
    setError('')
    const res = await verifyOtp(phone, otp)
    if (res.success) {
      navigate('/')
    } else {
      setError(res.error || 'Invalid OTP')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Sign in</h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {step === 1 ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter 10-digit phone"
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full mt-6 bg-green-900 text-white py-2 px-4 rounded-md hover:bg-green-800 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Change Phone
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="flex-1 bg-green-900 text-white py-2 px-4 rounded-md hover:bg-green-800 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Login'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
