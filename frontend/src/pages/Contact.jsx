import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/contact/create",
        form
      );

      toast.success(res.data.message);

      // RESET FORM
      setForm({
        name: "",
        email: "",
        message: ""
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden bg-gray-50/30">
      
      {/* Premium Header Banner */}
      <div className="w-full h-64 md:h-80 bg-gradient-to-r from-[#082e21] via-[#0b3d2c] to-[#082e21] relative overflow-hidden flex items-center justify-center shadow-lg">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ecc153] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#ecc153] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 text-center px-4 mt-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-wide drop-shadow-xl"
          >
            Contact <span className="text-[#ecc153]">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-2 max-w-2xl mx-auto text-white/80 font-medium md:text-lg"
          >
            We'd love to hear from you. Reach out for queries, custom orders, or styling assistance.
          </motion.p>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT INFO */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-full flex flex-col justify-center"
          >
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">Get in Touch</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-[#082e21] mb-12">
              We're Here to Help
            </h3>

            <div className="grid gap-8">
              {/* Info Card */}
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-2xl group-hover:bg-[#082e21] group-hover:text-[#ecc153] transition-colors duration-300 flex-shrink-0">
                  📍
                </div>
                <div>
                  <h4 className="text-xl font-serif text-[#082e21] mb-2">Our Boutique</h4>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Laxman Nagar Saree Market,<br />Ring Road, Surat
                  </p>
                </div>
              </div>

              {/* Info Card */}
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-2xl group-hover:bg-[#082e21] group-hover:text-[#ecc153] transition-colors duration-300 flex-shrink-0">
                  📞
                </div>
                <div>
                  <h4 className="text-xl font-serif text-[#082e21] mb-2">Phone Number</h4>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              {/* Info Card */}
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-2xl group-hover:bg-[#082e21] group-hover:text-[#ecc153] transition-colors duration-300 flex-shrink-0">
                  📧
                </div>
                <div>
                  <h4 className="text-xl font-serif text-[#082e21] mb-2">Email Address</h4>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    support@sareeluxury.com
                  </p>
                </div>
              </div>

              {/* Info Card */}
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-2xl group-hover:bg-[#082e21] group-hover:text-[#ecc153] transition-colors duration-300 flex-shrink-0">
                  🕒
                </div>
                <div>
                  <h4 className="text-xl font-serif text-[#082e21] mb-2">Working Hours</h4>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Mon - Sat : 10:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-gray-100 relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#ecc153] to-transparent opacity-20 rounded-tr-[3rem] pointer-events-none"></div>
            
            <h2 className="text-3xl font-serif text-[#082e21] mb-8">
              Send us a Message
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ecc153] focus:bg-white transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ecc153] focus:bg-white transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  rows="5"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#ecc153] focus:bg-white transition-all duration-300 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#082e21] text-[#ecc153] py-4 rounded-full font-bold tracking-widest uppercase hover:bg-[#0b3d2c] hover:shadow-[0_0_20px_rgba(8,46,33,0.3)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="py-24 px-4 sm:px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">Location</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-[#082e21]">
              Visit Our Store
            </h3>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-gray-50"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.5905730378654!2d72.84761112471921!3d21.208417531584757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04efdd3fb93d9%3A0x7427f2b33ccc2cfe!2sLaxman%20Nagar%2C%20Varachha%2C%20Surat%2C%20Gujarat%20395006!5e0!3m2!1sen!2sin!4v1772686401114!5m2!1sen!2sin"
              className="w-full h-[500px] border-0"
              allowFullScreen
              loading="lazy"
              title="Surat Location"
            ></iframe>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;