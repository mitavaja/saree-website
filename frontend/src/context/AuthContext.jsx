import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const res = await axios.get(`http://localhost:5000/api/user/profile/${userId}`);
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          // Clear broken userId
          localStorage.removeItem("userId");
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const sendOtp = async (phone) => {
    try {
      const res = await axios.post("http://localhost:5000/api/user/sendOtp", { phone });
      return res.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "OTP sending failed" };
    }
  };

  const verifyOtp = async (phone, otp) => {
    try {
      const res = await axios.post("http://localhost:5000/api/user/verifyOtp", { phone, otp });
      if (res.data.success) {
        const userInfo = res.data.user;
        localStorage.setItem("userId", userInfo._id);
        
        setUser(userInfo);
      }
      return res.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "OTP verification failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    
    setUser(null);
  };

  const value = {
    user,
    loading,
    sendOtp,
    verifyOtp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

