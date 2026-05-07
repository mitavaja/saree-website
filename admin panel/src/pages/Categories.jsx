import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "http://localhost:5000/api/category";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");

  // FETCH CATEGORY
  const fetchCategories = async () => {
    const res = await fetch(`${API}/list`);
    const data = await res.json();
    if (data.success) setCategories(data.categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ADD CATEGORY
  const addCategory = async () => {
    const res = await fetch(`${API}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (data.success) {
      fetchCategories();
      resetForm();
      toast.success("Category added successfully", { position: "top-right", autoClose: 2000 });
    } else {
      toast.error("Failed to add category", { position: "top-right", autoClose: 2000 });
    }
  };

  // UPDATE CATEGORY
  const updateCategory = async () => {
    const res = await fetch(`${API}/update/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (data.success) {
      fetchCategories();
      resetForm();
      toast.info("Category updated successfully", { position: "top-right", autoClose: 2000 });
    } else {
      toast.error("Failed to update category", { position: "top-right", autoClose: 2000 });
    }
  };

  // DELETE CATEGORY
  const deleteCategory = async (id) => {
    const res = await fetch(`${API}/delete/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      fetchCategories();
      toast.error("Category deleted successfully", { position: "top-right", autoClose: 2000 });
    } else {
      toast.error("Failed to delete category", { position: "top-right", autoClose: 2000 });
    }
  };

  const editCategory = (c) => {
    setEditId(c._id);
    setName(c.name);
    setShowModal(true);
  };

  const resetForm = () => {
    setShowModal(false);
    setEditId(null);
    setName("");
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-100 p-8">
      <ToastContainer /> {/* Add toast container once */}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#082e21]">Categories</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#082e21] text-[#ecc153] px-4 py-2 rounded-lg"
        >
          <MdAdd size={20} />
          Add Category
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Category Name</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => editCategory(c)}
                    className="text-blue-600 hover:scale-110"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => deleteCategory(c._id)}
                    className="text-red-600 hover:scale-110"
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4 text-[#082e21]">
              {editId ? "Edit Category" : "Add Category"}
            </h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Category Name"
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={resetForm} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={editId ? updateCategory : addCategory}
                className="px-4 py-2 bg-[#082e21] text-[#ecc153] rounded"
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

export default Category;