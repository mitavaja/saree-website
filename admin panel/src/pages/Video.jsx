import { useState, useEffect } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { getVideos, addVideo, deleteVideo } from "../api/videoGalleryApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchVideos = async () => {
    const data = await getVideos();
    setVideos(data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleVideo = (file) => {
    setVideo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAdd = async () => {
    if (!video) {
      toast.error("Select a video", { position: "top-right", autoClose: 2000 });
      return;
    }

    try {
      await addVideo(video);
      setVideo(null);
      setPreview(null);
      setShowModal(false);
      fetchVideos();
      toast.success("Video uploaded successfully", { position: "top-right", autoClose: 2000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload video", { position: "top-right", autoClose: 2000 });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVideo(id);
      fetchVideos();
      toast.error("Video deleted successfully", { position: "top-right", autoClose: 2000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete video", { position: "top-right", autoClose: 2000 });
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-100 p-8">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#082e21]">Video Gallery</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#082e21] text-[#ecc153] px-4 py-2 rounded-lg"
        >
          <MdAdd size={20} />
          Add Video
        </button>
      </div>

      {/* VIDEO GRID */}
      <div className="grid grid-cols-3 gap-6">
        {videos.map((v) => (
          <div key={v._id} className="bg-white rounded-xl shadow p-3 relative">
            <video
              src={`http://localhost:5000${v.video}`}
              controls
              className="w-full h-48 object-cover rounded"
            />
            <button
              onClick={() => handleDelete(v._id)}
              className="absolute top-3 right-3 text-red-600"
            >
              <MdDelete size={22} />
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-80">
            <h2 className="text-lg font-bold mb-4 text-[#082e21]">Upload Video</h2>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleVideo(e.target.files[0])}
              className="w-full mb-3"
            />

            {preview && (
              <video
                src={preview}
                className="w-full h-40 object-cover rounded mb-3"
                controls
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-[#082e21] text-[#ecc153] rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;