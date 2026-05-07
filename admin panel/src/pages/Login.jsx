import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImg from "../assets/login.jpg";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [storedEmail, setStoredEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return toast.error("Enter email");

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/admin/send-otp", { email: trimmedEmail });

      setStoredEmail(trimmedEmail);
      setStep(2);

      toast.success("OTP sent successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const trimmedOtp = otp.trim();
    if (!trimmedOtp) return toast.error("Enter OTP");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/admin/verify-otp", {
        email: storedEmail,
        otp: trimmedOtp,
      });

      localStorage.setItem("adminToken", res.data.token);

      toast.success("Logged in successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Toast Message Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Left image */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImg})` }}
      ></div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md transition-all duration-500">
          <h2 className="text-3xl font-bold text-[#082e21] mb-6 text-center">
            Welcome Back
          </h2>

          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#082e21]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#082e21] text-[#ecc153] py-3 rounded-lg hover:bg-[#0a3c26] transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <label className="block text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#082e21]"
              />

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setStoredEmail("");
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Change Email
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#082e21] text-[#ecc153] py-3 rounded-lg hover:bg-[#0a3c26] transition"
              >
                {loading ? "Verifying..." : "Login"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;