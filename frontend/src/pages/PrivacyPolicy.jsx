import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  const [content, setContent] = useState("");

  const API = "http://localhost:5000/api";

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axios.get(`${API}/policy/privacy`);
        
        console.log("API DATA 👉", res.data);

        setContent(res.data.content || "");
      } catch (error) {
        console.error(error);
      }
    };

    fetchPolicy();
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Privacy Policy
        </h1>

        {content ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-center text-gray-500">
            No Privacy Policy Available
          </p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;