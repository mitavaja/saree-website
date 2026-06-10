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
    redefineSubtitle: "",
    redefineTitle: "",
    redefineDesc: "",
    stat1Val: "",
    stat1Text: "",
    stat2Val: "",
    stat2Text: "",
    whyTitle: "",
    whyItems: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" }
    ]
  });

  const [image, setImage] = useState(null); // Story Image
  const [preview, setPreview] = useState(""); // Preview Story Image
  const [redefineImage, setRedefineImage] = useState(null); // Redefining Saree Image
  const [redefinePreview, setRedefinePreview] = useState(""); // Preview Redefining Image

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

      setForm({
        heroTitle: fetched.heroTitle || "",
        heroSubtitle: fetched.heroSubtitle || "",
        storyTitle: fetched.storyTitle || "",
        storyDesc1: fetched.storyDesc1 || "",
        storyDesc2: fetched.storyDesc2 || "",
        bannerText: fetched.bannerText || "",
        redefineSubtitle: fetched.redefineSubtitle || "",
        redefineTitle: fetched.redefineTitle || "",
        redefineDesc: fetched.redefineDesc || "",
        stat1Val: fetched.stat1Val || "",
        stat1Text: fetched.stat1Text || "",
        stat2Val: fetched.stat2Val || "",
        stat2Text: fetched.stat2Text || "",
        whyTitle: fetched.whyTitle || "",
        whyItems: fetched.whyItems
      });

      // 👇 existing image preview
      if (fetched.storyImage) {
        setPreview(`http://localhost:5000${fetched.storyImage}`);
      }
      if (fetched.redefineImage) {
        setRedefinePreview(`http://localhost:5000${fetched.redefineImage}`);
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
          formData.append(key, form[key] || "");
        }
      });

      if (image) {
        formData.append("storyImage", image);
      }
      if (redefineImage) {
        formData.append("redefineImage", redefineImage);
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

        {/* REDEFINING SAREE FASHION */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Redefining Saree Fashion Section</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Subtitle</label>
              <input name="redefineSubtitle" value={form.redefineSubtitle} onChange={handleChange} placeholder="e.g. Modern Innovation" className="inputStyle" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Title</label>
              <input name="redefineTitle" value={form.redefineTitle} onChange={handleChange} placeholder="e.g. Redefining Saree Fashion" className="inputStyle" />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
            <textarea name="redefineDesc" value={form.redefineDesc} onChange={handleChange} placeholder="Description text" className="inputStyle h-24" />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-xl border">
              <h3 className="font-semibold mb-2 text-sm text-[#082e21]">Stat 1</h3>
              <input name="stat1Val" value={form.stat1Val} onChange={handleChange} placeholder="Value (e.g. 150+)" className="inputStyle mb-2" />
              <input name="stat1Text" value={form.stat1Text} onChange={handleChange} placeholder="Label (e.g. Unique Patterns)" className="inputStyle" />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border">
              <h3 className="font-semibold mb-2 text-sm text-[#082e21]">Stat 2</h3>
              <input name="stat2Val" value={form.stat2Val} onChange={handleChange} placeholder="Value (e.g. 20k+)" className="inputStyle mb-2" />
              <input name="stat2Text" value={form.stat2Text} onChange={handleChange} placeholder="Label (e.g. Happy Brides)" className="inputStyle" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Section Image</label>
            <input type="file" onChange={(e) => {
              const file = e.target.files[0];
              setRedefineImage(file);
              setRedefinePreview(URL.createObjectURL(file));
            }} className="inputStyle" />
            {redefinePreview && (
              <img src={redefinePreview} className="w-40 h-40 object-cover mt-3 rounded-lg border" />
            )}
          </div>
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