import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";

const Footer = () => {
  const [data, setData] = useState({
    logo: "",
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
    categories: [],
    footerLinks: [],
    newsletterText: "",
    bottomText: "", // ✅ ADD THIS
  });

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      // ✅ FIXED API
      const res = await axios.get("http://localhost:5000/api/footer/settings");
      if (res.data) setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* Floating WhatsApp */}
      {data.whatsapp && (
        <a
          href={`https://wa.me/${data.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className={`fixed right-6 z-50 bg-green-500 p-3 rounded-full shadow-2xl hover:scale-110 transition-all ${data.whatsapp ? "bottom-20 md:bottom-6" : "bottom-6"}`}
        >
          <FaWhatsapp className="text-white w-7 h-7" />
        </a>
      )}

      {/* Mobile Sticky Bar */}
      {data.whatsapp && (
        <div className="fixed bottom-0 left-0 w-full bg-[#082e21] text-[#ecc153] py-3 flex justify-center items-center z-40 md:hidden">
          <span className="mr-3 font-semibold">Chat on WhatsApp</span>
          <a
            href={`https://wa.me/${data.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#ecc153] text-[#082e21] px-4 py-1 rounded-full font-semibold"
          >
            WhatsApp
          </a>
        </div>
      )}

      <footer className="w-full bg-[#082e21]/95 backdrop-blur border-t border-[#ecc153]/40 mt-20 text-white">

        <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#ecc153] to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 py-16">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

            {/* Contact */}
            <div>
              {data.logo && (
                <img src={data.logo} alt="logo" className="w-36 mb-3" />
              )}

              <h3 className="font-semibold text-[#ecc153] mb-4">CONTACT US</h3>

              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                {data.address}
                <br /><br />
                {data.phone && <>Phone: {data.phone}<br /></>}
                {data.email && <>Email: {data.email}</>}
              </p>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-[#ecc153] mb-4">CATEGORIES</h3>
              <ul className="text-sm text-gray-200 space-y-2">
                {data.categories?.map((item, i) => (
                  <li key={i} className="hover:text-white hover:translate-x-1 transition-all cursor-pointer">
                    <Link to={`/collection?category=${encodeURIComponent(item)}`} className="block w-full h-full">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-[#ecc153] mb-4">FURTHER INFO</h3>
              <ul className="text-sm text-gray-200 space-y-2">
                {data.footerLinks?.map((link, i) => (
                  <li key={i}>
                    <Link to={link.url} className="hover:underline">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer */}
            <div>
              <h3 className="font-semibold text-[#ecc153] mb-4">CUSTOMER SERVICE</h3>
              <ul className="text-sm text-gray-200 space-y-2">
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
                <li><Link to="/return-policy">Return Policy</Link></li>
                <li><Link to="/shipping-policy">Shipping Policy</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold text-[#ecc153] mb-4">
                INBOX TO SAREE STYLE
              </h3>

              <p className="text-sm text-gray-200 mb-4">
                {data.newsletterText}
              </p>

              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none text-black"
              />

              <button className="w-full py-2 bg-[#ecc153] text-[#082e21] font-semibold rounded hover:opacity-90 transition">
                SUBSCRIBE
              </button>
            </div>

          </div>

          {/* 🔥 BOTTOM BAR */}
          <div className="border-t border-[#ecc153]/40 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-300">
            
            {/* LEFT */}
            <p>
              © {new Date().getFullYear()} {data.address?.split("\n")[0] || "Your Company"}.
              All rights reserved.
            </p>

            {/* RIGHT */}
            <p className="mt-2 md:mt-0">
              {data.bottomText || data.categories?.join(" • ")}
            </p>

          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;