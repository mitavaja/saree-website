import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";

const ReturnPolicy = () => {
  const [content, setContent] = useState("");

  const API = "http://localhost:5000/api";

  useEffect(() => {
    axios
      .get(`${API}/policy/return`)
      .then(res => setContent(res.data.content || ""))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* MAIN CONTENT */}
      <div className="flex-grow max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Return Policy
        </h1>

        {content ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-center text-gray-500">
            No Return Policy Available
          </p>
        )}
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default ReturnPolicy;