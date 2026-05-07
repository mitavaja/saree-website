import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BrandStory = () => {
  const [data, setData] = useState({
    title: "",
    desc1: "",
    desc2: "",
    desc3: "",
    buttonText: "",
  });
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewVideo, setPreviewVideo] = useState("");

  const fetchBrandStory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/brand-story");
      if (res.data.success && res.data.data) {
        const bd = res.data.data;
        setData({
          title: bd.title || "",
          desc1: bd.desc1 || "",
          desc2: bd.desc2 || "",
          desc3: bd.desc3 || "",
          buttonText: bd.buttonText || "",
        });
        if (bd.video) {
          setPreviewVideo(bd.video.startsWith("http") ? bd.video : `http://localhost:5000/uploads/${bd.video}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBrandStory();
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("desc1", data.desc1);
      formData.append("desc2", data.desc2);
      formData.append("desc3", data.desc3);
      formData.append("buttonText", data.buttonText);
      if (video) {
        formData.append("video", video);
      }

      const res = await axios.post("http://localhost:5000/api/brand-story", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchBrandStory(); // Refresh to get updated video URL
        setVideo(null); // Clear file input
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error saving brand story");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Brand Story</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-3xl border border-gray-100">
        
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ecc153] focus:border-transparent transition-all"
            required
            placeholder="e.g. A Legacy of Elegance"
          />
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">Paragraph 1 (Main Description)</label>
          <textarea
            name="desc1"
            value={data.desc1}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ecc153] focus:border-transparent transition-all"
            placeholder="Main story paragraph..."
          ></textarea>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">Paragraph 2 (Quote / Highlight)</label>
          <textarea
            name="desc2"
            value={data.desc2}
            onChange={handleChange}
            rows="2"
            className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ecc153] focus:border-transparent transition-all"
            placeholder="A special quote or italicized text..."
          ></textarea>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">Paragraph 3 (Closing Description)</label>
          <textarea
            name="desc3"
            value={data.desc3}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ecc153] focus:border-transparent transition-all"
            placeholder="Closing story paragraph..."
          ></textarea>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">Button Text</label>
          <input
            type="text"
            name="buttonText"
            value={data.buttonText}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#ecc153] focus:border-transparent transition-all"
            placeholder="e.g. Know More"
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="w-full border border-gray-300 rounded-md px-4 py-2.5 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#082e21] file:text-[#ecc153] hover:file:bg-[#0b3d2c] transition-all cursor-pointer"
          />
          {previewVideo && !video && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 inline-block">
              <p className="text-sm font-semibold text-gray-600 mb-2">Current Video:</p>
              <video src={previewVideo} controls className="w-80 rounded-md border shadow-sm"></video>
            </div>
          )}
          {video && (
            <p className="mt-3 text-sm font-semibold text-green-600">✅ New video selected: {video.name}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#082e21] text-[#ecc153] font-bold tracking-wider uppercase px-6 py-3.5 rounded-md hover:bg-[#0b3d2c] hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Saving Changes..." : "Save Brand Story"}
        </button>
      </form>
    </div>
  );
};

export default BrandStory;