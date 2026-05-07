import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";

const About = () => {
  const [form, setForm] = useState({
    heroTitle: "",
    heroSubtitle: "",
    storyTitle: "",
    storyDesc1: "",
    storyDesc2: "",
    bannerText: "",
    whyTitle: "",
    whyItems: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" }
    ]
  });

  const [image, setImage] = useState(null); // ✅ new
  const [preview, setPreview] = useState(""); // ✅ preview

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("/about");

    if (res.data) {
      const fetched = res.data;

      if (!fetched.whyItems || fetched.whyItems.length === 0) {
        fetched.whyItems = [
          { title: "", description: "" },
          { title: "", description: "" },
          { title: "", description: "" }
        ];
      }

      setForm(fetched);

      // 👇 existing image preview
      if (fetched.storyImage) {
        setPreview(`http://localhost:5000${fetched.storyImage}`);
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWhyChange = (index, field, value) => {
    const updated = [...form.whyItems];
    updated[index][field] = value;
    setForm({ ...form, whyItems: updated });
  };

  // ✅ image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ submit with multer
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "whyItems") {
          formData.append("whyItems", JSON.stringify(form.whyItems));
        } else {
          formData.append(key, form[key]);
        }
      });

      if (image) {
        formData.append("storyImage", image);
      }

      await axios.post("/about/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Saved Successfully");

    } catch (err) {
      console.error(err);
      toast.error("Error saving data");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-[#082e21]">About Page Settings</h1>
          <p className="text-sm text-gray-500">Manage your website About page content</p>
        </div>

        {/* HERO */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Hero Section</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input name="heroTitle" value={form.heroTitle} onChange={handleChange} placeholder="Hero Title" className="inputStyle" />
            <input name="heroSubtitle" value={form.heroSubtitle} onChange={handleChange} placeholder="Hero Subtitle" className="inputStyle" />
          </div>
        </div>

        {/* STORY */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Story Section</h2>

          <input name="storyTitle" value={form.storyTitle} onChange={handleChange} placeholder="Story Title" className="inputStyle mb-3" />

          <textarea name="storyDesc1" value={form.storyDesc1} onChange={handleChange} placeholder="Description 1" className="inputStyle mb-3 h-24" />
          <textarea name="storyDesc2" value={form.storyDesc2} onChange={handleChange} placeholder="Description 2" className="inputStyle mb-3 h-24" />

          {/* ✅ IMAGE UPLOAD */}
          <input type="file" onChange={handleImageChange} className="inputStyle" />

          {/* ✅ PREVIEW */}
          {preview && (
            <img src={preview} className="w-40 h-40 object-cover mt-3 rounded-lg border" />
          )}
        </div>

        {/* BANNER */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Banner Section</h2>
          <input name="bannerText" value={form.bannerText} onChange={handleChange} placeholder="Banner Text" className="inputStyle" />
        </div>

        {/* WHY */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Why Choose Us</h2>

          <input name="whyTitle" value={form.whyTitle} onChange={handleChange} placeholder="Section Title" className="inputStyle mb-4" />

          <div className="grid md:grid-cols-3 gap-4">
            {form.whyItems.map((item, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-xl border">
                <input
                  value={item.title}
                  onChange={(e) => handleWhyChange(i, "title", e.target.value)}
                  placeholder="Title"
                  className="inputStyle mb-2"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => handleWhyChange(i, "description", e.target.value)}
                  placeholder="Description"
                  className="inputStyle h-20"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SAVE */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-[#082e21] text-[#ecc153] px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default About;