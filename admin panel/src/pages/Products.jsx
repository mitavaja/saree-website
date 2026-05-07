import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "http://localhost:5000/api";

const Products = () => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState(true);

  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const [preview, setPreview] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideo, setPreviewVideo] = useState(null);

  // FETCH
  const fetchProducts = async () => {
    const res = await axios.get(`${API}/product/list`);
    if (res.data.success) setProducts(res.data.products);
  };

  const fetchCategories = async () => {
    const res = await fetch(`${API}/category/list`);
    const data = await res.json();
    if (data.success) setCategories(data.categories);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // HANDLERS
  const handleImage = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

const handleSingleThumbnail = (file, index) => {
  if (!file) return;

  // images update
  const newImages = [...images];
  newImages[index] = file;
  setImages(newImages);

  // preview update
  const newPreview = [...previewImages];
  newPreview[index] = URL.createObjectURL(file);
  setPreviewImages(newPreview);
};

  const handleVideo = (file) => {
    setVideo(file);
    setPreviewVideo(URL.createObjectURL(file));
  };

  const dropImage = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImage(file);
  };

  // ADD
  const addProduct = async () => {
    try {
      // 🔥 VALIDATION
      if (!image) return toast.error("Main image required");
      if (images.length !== 3) return toast.error("Upload exactly 3 thumbnails");
      if (!video) return toast.error("Video required");

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("features", features);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("color", color);
      formData.append("stock", stock);
      formData.append("status", status);

      formData.append("image", image);
      images.forEach(img => formData.append("images", img));
      formData.append("video", video);

      await axios.post(`${API}/product/add`, formData);

      toast.success("Product added successfully");
      resetForm();
      fetchProducts();

    } catch {
      toast.error("Failed to add product");
    }
  };

  // UPDATE
  const updateProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("features", features);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("color", color);
      formData.append("stock", stock);
      formData.append("status", status);

      if (image) formData.append("image", image);

      if (images.length > 0) {
        if (images.length !== 3) {
          return toast.error("Upload exactly 3 thumbnails");
        }
        images.forEach(img => formData.append("images", img));
      }

      if (video) formData.append("video", video);

      await axios.put(`${API}/product/update/${editId}`, formData);

      toast.info("Product updated successfully");
      resetForm();
      fetchProducts();

    } catch {
      toast.error("Failed to update product");
    }
  };

  const deleteProduct = async (id) => {
    await axios.delete(`${API}/product/delete/${id}`);
    toast.error("Product deleted successfully");
    fetchProducts();
  };

 const editProduct = (p) => {
  setEditId(p._id);
  setName(p.name);
  setDescription(p.description || "");
  setFeatures(p.features ? p.features.join(", ") : "");
  setPrice(p.price);
  setCategory(p.category);
  setColor(p.color);
  setStock(p.stock);
  setStatus(p.status);

  setPreview(`http://localhost:5000${p.image}`);

  // ✅ IMPORTANT FIX
  setImages(p.images || []);

  setPreviewImages(
    p.images?.map(i => `http://localhost:5000${i}`) || []
  );

  setPreviewVideo(
    p.video ? `http://localhost:5000${p.video}` : null
  );

  setShowModal(true);
};

  const toggleStatus = async (p) => {
    await axios.put(`${API}/product/update/${p._id}`, { ...p, status: !p.status });
    toast.info(`Product ${p.status ? "deactivated" : "activated"}`);
    fetchProducts();
  };

  const resetForm = () => {
    setShowModal(false);
    setEditId(null);
    setName("");
    setDescription("");
    setFeatures("");
    setPrice("");
    setCategory("");
    setColor("");
    setStock("");
    setImage(null);
    setImages([]);
    setVideo(null);
    setPreview(null);
    setPreviewImages([]);
    setPreviewVideo(null);
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-100 p-8">

      <ToastContainer autoClose={2000} />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#082e21]">Products</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#082e21] text-[#ecc153] px-4 py-2 rounded-lg">
          <MdAdd size={20} /> Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Color</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <img src={`http://localhost:5000${p.image}`} className="w-12 h-12 rounded" />
                </td>

                <td className="p-4 font-medium">
                  {p.name}
                </td>

                <td className="p-4">{p.category}</td>
                <td className="p-4">{p.color}</td>
                <td className="p-4">₹{p.price}</td>
                <td className="p-4">{p.stock}</td>

                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(p)}
                    className={`px-3 py-1 rounded text-xs ${
                      p.status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {p.status ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="p-4 flex gap-3">
                  <MdEdit onClick={() => editProduct(p)} className="text-blue-600 cursor-pointer"/>
                  <MdDelete onClick={() => deleteProduct(p._id)} className="text-red-600 cursor-pointer"/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
    {showModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">

    <div className="bg-white rounded-2xl shadow-2xl w-[430px] max-h-[90vh] overflow-y-auto p-6">

      {/* HEADER (sticky optional feel) */}
      <h2 className="text-2xl font-semibold mb-5 text-[#082e21] sticky top-0 bg-white z-10 pb-2">
        {editId ? "Edit Product" : "Add Product"}
      </h2>

      {/* IMAGE SECTION */}
      <div className="mb-5">

        {/* MAIN IMAGE */}
        <label className="block text-sm font-semibold mb-2">Main Image *</label>
        <div
          onClick={() => document.getElementById("mainImage").click()}
          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#082e21]"
        >
          {preview ? (
            <img src={preview} className="w-28 h-28 object-cover mx-auto rounded" />
          ) : (
            <p className="text-gray-500 text-sm">Upload Main Image</p>
          )}
          <input
            id="mainImage"
            type="file"
            hidden
            onChange={(e) => handleImage(e.target.files[0])}
          />
        </div>

        {/* THUMBNAILS */}
        <label className="block text-sm font-semibold mt-4 mb-2">
          Thumbnail Images (Max 3) *
        </label>
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              onClick={() => document.getElementById(`thumb${i}`).click()}
              className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-[#082e21]"
            >
              {previewImages[i] ? (
                <img
                  src={previewImages[i]}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-gray-400 text-xs">+</span>
              )}

              <input
                id={`thumb${i}`}
                type="file"
                hidden
                onChange={(e) =>
                  handleSingleThumbnail(e.target.files[0], i)
                }
              />
            </div>
          ))}
        </div>

        {/* VIDEO */}
        <label className="block text-sm font-semibold mt-4 mb-2">
  Product Video *
</label>

        <div
          onClick={() => document.getElementById("video").click()}
          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#082e21]"
        >
          {previewVideo ? (
            <video
              src={previewVideo}
              className="w-28 mx-auto rounded"
              controls
            />
          ) : (
            <p className="text-gray-500 text-sm">Upload Video</p>
          )}
          <input
            id="video"
            type="file"
            hidden
            onChange={(e) => handleVideo(e.target.files[0])}
          />
        </div>
      </div>

      {/* INPUTS */}
      <div className="space-y-3">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name *"
          className="w-full border p-2.5 rounded-lg"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short Description *"
          className="w-full border p-2.5 rounded-lg"
          rows={3}
        />

        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder="Features (comma separated) *"
          className="w-full border p-2.5 rounded-lg"
          rows={3}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2.5 rounded-lg"
        >
          <option value="">Select Category *</option>
          {categories.map((c) => (
            <option key={c._id}>{c.name}</option>
          ))}
        </select>

        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Color *"
          className="w-full border p-2.5 rounded-lg"
        />

        <div className="flex gap-3">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price *"
            className="w-1/2 border p-2.5 rounded-lg"
          />
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock *"
            className="w-1/2 border p-2.5 rounded-lg"
          />
        </div>
      </div>

      {/* BUTTONS (sticky bottom feel) */}
      <div className="flex justify-end gap-3 mt-6 sticky bottom-0 bg-white pt-3">
        <button
          onClick={resetForm}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (
              !name ||
              !description ||
              !features ||
              !category ||
              !color ||
              !price ||
              !stock ||
              !preview ||
              previewImages.filter(Boolean).length < 3 ||
              !previewVideo
            ) {
              alert("Please fill all required fields!");
              return;
            }

            editId ? updateProduct() : addProduct();
          }}
          className="px-5 py-2 bg-[#082e21] text-[#ecc153] rounded-lg"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default Products;