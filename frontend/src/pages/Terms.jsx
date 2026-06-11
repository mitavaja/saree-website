import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";

const Terms = () => {
  const [content, setContent] = useState("");

  const API = "http://localhost:5000/api";

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await axios.get(`${API}/policy/terms`);
        setContent(res.data.content || "");
      } catch (error) {
        console.error(error);
      }
    };

    fetchTerms();
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:p-6 lg:p-10">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Terms & Conditions
        </h1>

        {content ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-center text-gray-500">
            No Terms Available
          </p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Terms;