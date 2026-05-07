import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FooterSettings = () => {

  const [form, setForm] = useState({
    logo: "",
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
    categories: [],
    footerLinks: [],
    newsletterText: "",
    bottomText: "",
  });

  const [file, setFile] = useState(null); // ✅ IMPORTANT
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/footer/settings"); // ✅ FIXED
      if (res.data) {
        setForm({
          logo: res.data.logo || "",
          whatsapp: res.data.whatsapp || "",
          phone: res.data.phone || "",
          email: res.data.email || "",
          address: res.data.address || "",
          categories: res.data.categories || [],
          footerLinks: res.data.footerLinks || [],
          newsletterText: res.data.newsletterText || "",
          bottomText: res.data.bottomText || "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ FILE SELECT (NO API CALL HERE)
  const handleLogoUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // preview
    if (selectedFile) {
      setForm({
        ...form,
        logo: URL.createObjectURL(selectedFile),
      });
    }
  };

  // CATEGORY
  const addCategory = () => {
    setForm({ ...form, categories: [...form.categories, ""] });
  };

  const updateCategory = (i, value) => {
    const updated = [...form.categories];
    updated[i] = value;
    setForm({ ...form, categories: updated });
  };

  const removeCategory = (i) => {
    const updated = form.categories.filter((_, index) => index !== i);
    setForm({ ...form, categories: updated });
  };

  // LINKS
  const addLink = () => {
    setForm({
      ...form,
      footerLinks: [...form.footerLinks, { name: "", url: "" }],
    });
  };

  const updateLink = (i, field, value) => {
    const updated = [...form.footerLinks];
    updated[i][field] = value;
    setForm({ ...form, footerLinks: updated });
  };

  const removeLink = (i) => {
    const updated = form.footerLinks.filter((_, index) => index !== i);
    setForm({ ...form, footerLinks: updated });
  };

  // ✅ SUBMIT (SINGLE API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "categories" || key === "footerLinks") {
          formData.append(key, JSON.stringify(form[key]));
        } else {
          formData.append(key, form[key]);
        }
      });

      // ✅ send file
      if (file) {
        formData.append("logo", file);
      }

      await axios.put("http://localhost:5000/api/footer/settings", formData); // ✅ FIXED

      toast.success("Footer updated successfully");

    } catch (err) {
      toast.error("Error updating footer");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Footer Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* LOGO */}
        <div>
          <h3 className="font-semibold mb-2">Footer Logo</h3>
          <input type="file" onChange={handleLogoUpload} />

          {form.logo && (
            <img src={form.logo} alt="logo" className="w-32 mt-3" />
          )}
        </div>

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="WhatsApp" className="border p-2 rounded" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
        </div>

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 rounded w-full"
        />

        {/* CATEGORIES */}
        <div>
          <h3 className="font-semibold mb-2">Categories</h3>

          {form.categories.map((cat, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={cat}
                onChange={(e) => updateCategory(i, e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button type="button" onClick={() => removeCategory(i)} className="bg-red-500 text-white px-3 rounded">
                X
              </button>
            </div>
          ))}

          <button type="button" onClick={addCategory} className="bg-green-500 text-white px-4 py-1 rounded">
            + Add Category
          </button>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="font-semibold mb-2">Footer Links</h3>

          {form.footerLinks.map((link, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                placeholder="Name"
                value={link.name}
                onChange={(e) => updateLink(i, "name", e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button type="button" onClick={() => removeLink(i)} className="bg-red-500 text-white px-3 rounded">
                X
              </button>
            </div>
          ))}

          <button type="button" onClick={addLink} className="bg-green-500 text-white px-4 py-1 rounded">
            + Add Link
          </button>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="font-semibold mb-2">Newsletter Text</h3>
          <textarea
            name="newsletterText"
            value={form.newsletterText}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* BOTTOM TEXT */}
        <div>
          <h3 className="font-semibold mb-2">Bottom Bar Text</h3>
          <textarea
            name="bottomText"
            value={form.bottomText}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#082e21] text-[#ecc153] px-6 py-2 rounded font-semibold"
        >
          {loading ? "Saving..." : "Save Footer"}
        </button>

      </form>
    </div>
  );
};

export default FooterSettings;