import axios from "axios";

const API = "http://localhost:5000/api/video";

/* GET ALL VIDEOS */
export const getVideos = async () => {

  try {

    const res = await axios.get(`${API}/list`);

    return res.data.videos;

  } catch (err) {

    console.error("Error fetching videos:", err);

    return [];

  }

};


/* ADD VIDEO (UPLOAD FILE) */
export const addVideo = async (video) => {

  try {

    const formData = new FormData();

    formData.append("video", video);

    const res = await axios.post(`${API}/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.video;

  } catch (err) {

    console.error("Error uploading video:", err);

    return null;

  }

};


/* DELETE VIDEO */
export const deleteVideo = async (id) => {

  try {

    const res = await axios.delete(`${API}/delete/${id}`);

    return res.data;

  } catch (err) {

    console.error("Error deleting video:", err);

    return null;

  }

};