import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { ShopContext } from '../context/ShopContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1: email, 2: otp
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { sendOtp, verifyOtp } = useContext(AuthContext)
  const { setToken } = useContext(ShopContext)
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(true)
    setError('')
    const res = await sendOtp(email)
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
    const res = await verifyOtp(email, otp)
    if (res.success) {
      setToken(res.token)
      navigate('/')
    } else {
      setError(res.error || 'Invalid OTP')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white py-12 px-4 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecc153] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#082e21] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        <div>
          <h2 className="text-center text-4xl font-serif text-[#082e21] mb-2">Login</h2>
          <div className="w-12 h-1 bg-[#ecc153] mx-auto rounded-full mb-8"></div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl border border-white/50">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}
          {step === 1 ? (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ecc153]/50 focus:border-[#ecc153] bg-gray-50 focus:bg-white transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full mt-6 bg-[#082e21] text-[#ecc153] hover:bg-[#0b3d2c] py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ecc153]/50 focus:border-[#ecc153] bg-gray-50 focus:bg-white transition-all duration-300 text-center tracking-[0.5em] text-lg font-bold"
                  placeholder="000000"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3.5 px-4 rounded-xl hover:bg-gray-200 font-semibold transition"
                >
                  Change Email
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="flex-1 bg-[#082e21] text-[#ecc153] hover:bg-[#0b3d2c] py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider hover:shadow-lg transition-all duration-300 disabled:opacity-50"
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
