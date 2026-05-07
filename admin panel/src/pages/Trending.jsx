import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete, MdAdd, MdEdit } from "react-icons/md";

const API = "http://localhost:5000/api";

const Trending = () => {
  const [items, setItems] = useState([]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ image: null });
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);

  const fetchTrending = async () => {
    try {
      const res = await axios.get(`${API}/trending`);
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to fetch trending images");
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await axios.delete(`${API}/trending/${id}`);
      toast.success("Deleted successfully");
      fetchTrending();
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  const handleImage = (file) => {
    setFormData({ ...formData, image: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({ image: null });
    setPreview(`http://localhost:5000/uploads/${item.image}`);
    setShowAddModal(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!editId && items.length >= 10) {
      toast.error("Maximum 10 trending images allowed");
      return;
    }
    if (!editId && !formData.image) {
      toast.error("Please upload an image");
      return;
    }

    const data = new FormData();
    if (formData.image) data.append("image", formData.image);

    try {
      if (editId) {
        await axios.put(`${API}/trending/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Updated successfully");
      } else {
        await axios.post(`${API}/trending`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Added successfully");
      }
      setShowAddModal(false);
      setFormData({ image: null });
      setPreview(null);
      setEditId(null);
      fetchTrending();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save image");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-100 p-8">
      <ToastContainer autoClose={2000} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#082e21]">Trending Images</h1>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({ image: null });
            setPreview(null);
            setShowAddModal(true);
          }}
          disabled={items.length >= 10}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${items.length >= 10 ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-[#082e21] text-[#ecc153] hover:opacity-90'}`}
        >
          <MdAdd size={20} /> Add Image ({items.length}/10)
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden w-full md:w-1/2">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 border-b">Image</th>
              <th className="p-4 border-b text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 border-t transition">
                <td className="p-4">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt="trend"
                    className="w-16 h-16 object-cover rounded-full shadow"
                  />
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-500 hover:text-blue-700 p-2 bg-blue-50 rounded-full transition"
                      title="Edit"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-full transition"
                      title="Delete"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="2" className="p-8 text-center text-gray-500">
                  No trending images found. Click "Add Image" to add up to 10 images.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[400px]">
            <h2 className="text-2xl font-bold mb-6 text-[#082e21]">{editId ? "Edit Trending Image" : "Add Trending Image"}</h2>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              
              <div>
                <label className="block text-sm font-semibold mb-2">Image *</label>
                <div
                  onClick={() => document.getElementById("trendImage").click()}
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#082e21]"
                >
                  {preview ? (
                    <img src={preview} className="w-24 h-24 object-cover mx-auto rounded-full shadow" />
                  ) : (
                    <p className="text-gray-500 text-sm">Upload Image</p>
                  )}
                  <input
                    id="trendImage"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImage(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ image: null });
                    setPreview(null);
                    setEditId(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#082e21] text-[#ecc153] py-2 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Save Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trending;
