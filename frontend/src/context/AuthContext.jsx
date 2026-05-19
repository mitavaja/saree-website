import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get(`http://localhost:5000/api/user/profile`, {
            headers: { token }
          });
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const sendOtp = async (email) => {
    try {
      const res = await axios.post("http://localhost:5000/api/user/sendOtp", { email });
      return res.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "OTP sending failed" };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const res = await axios.post("http://localhost:5000/api/user/verifyOtp", { email, otp });
      if (res.data.success) {
        const userInfo = res.data.user;
        const token = res.data.token;
        localStorage.setItem("userId", userInfo._id);
        localStorage.setItem("token", token);
        
        setUser(userInfo);
      }
      return res.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "OTP verification failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
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

