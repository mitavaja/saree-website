import { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getBanners,
  addBanner,
  updateBanner,
  deleteBanner,
} from "../api/bannerApi";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    title: "",
    subtitle: "",
    buttonText: "",
    image: null,
  });

  const fetchAll = async () => {
    const data = await getBanners();
    setBanners(data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (current._id) {
        await updateBanner(current._id, current);
        toast.info("Banner updated successfully", { position: "top-right", autoClose: 2000 });
      } else {
        await addBanner(current);
        toast.success("Banner added successfully", { position: "top-right", autoClose: 2000 });
      }
      fetchAll();
      setModalOpen(false);
      setCurrent({ id: null, title: "", subtitle: "", buttonText: "", image: null });
      localStorage.setItem("bannersUpdated", Date.now().toString());
    } catch (err) {
      console.error(err);
      toast.error("Operation failed", { position: "top-right", autoClose: 2000 });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await deleteBanner(id);
      fetchAll();
      toast.error("Banner deleted successfully", { position: "top-right", autoClose: 2000 });
      localStorage.setItem("bannersUpdated", Date.now().toString());
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete banner", { position: "top-right", autoClose: 2000 });
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-100 p-8">
      <ToastContainer /> {/* Top-right auto close toast */}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#082e21]">Banner Management</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#082e21] text-[#ecc153] px-4 py-2 rounded-lg"
        >
          <MdAdd size={20} /> Add Banner
        </button>
      </div>

      {/* Banner Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Subtitle</th>
              <th className="p-4 text-left">Button Text</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b._id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <img
                    src={`http://localhost:5000${b.image}`}
                    alt={b.title}
                    className="w-12 h-12 rounded"
                  />
                </td>
                <td className="p-4 font-medium">{b.title}</td>
                <td className="p-4">{b.subtitle}</td>
                <td className="p-4">{b.buttonText}</td>
                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => {
                      setCurrent(b);
                      setModalOpen(true);
                    }}
                    className="text-blue-600 hover:scale-110"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4 text-[#082e21]">
              {current._id ? "Edit" : "Add"} Banner
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  setCurrent({ ...current, image: e.dataTransfer.files[0] });
                }}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4"
              >
                {current.image ? (
                  <img
                    src={
                      typeof current.image === "string"
                        ? `http://localhost:5000${current.image}`
                        : URL.createObjectURL(current.image)
                    }
                    className="w-32 mx-auto rounded"
                  />
                ) : (
                  <p className="text-gray-500">Drag & Drop Image</p>
                )}
                <input
                  type="file"
                  onChange={(e) => setCurrent({ ...current, image: e.target.files[0] })}
                  className="mt-3"
                />
              </div>

              <input
                type="text"
                placeholder="Title"
                value={current.title}
                onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                className="w-full border p-2 rounded mb-2 focus:ring-2 focus:ring-blue-300"
                required
              />
              <input
                type="text"
                placeholder="Subtitle"
                value={current.subtitle}
                onChange={(e) => setCurrent({ ...current, subtitle: e.target.value })}
                className="w-full border p-2 rounded mb-2 focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="text"
                placeholder="Button Text"
                value={current.buttonText}
                onChange={(e) => setCurrent({ ...current, buttonText: e.target.value })}
                className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-blue-300"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setCurrent({ id: null, title: "", subtitle: "", buttonText: "", image: null });
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#082e21] text-[#ecc153] rounded hover:bg-[#0a3a25]"
                >
                  {current._id ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;