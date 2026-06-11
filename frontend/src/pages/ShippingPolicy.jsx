import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";

const ShippingPolicy = () => {
  const [content, setContent] = useState("");

  const API = "http://localhost:5000/api";

  useEffect(() => {
    axios
      .get(`${API}/policy/shipping`)
      .then(res => setContent(res.data.content || ""))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* MAIN CONTENT */}
      <div className="flex-grow max-w-4xl mx-auto px-4 py-8 sm:p-6 lg:p-10">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Shipping Policy
        </h1>

        {content ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-center text-gray-500">
            No Shipping Policy Available
          </p>
        )}
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default ShippingPolicy;