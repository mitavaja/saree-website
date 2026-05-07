import axios from "axios";

const API = "http://localhost:5000/api/video";

/**
 * Fetch all videos
 * @returns Array of video objects [{_id, url}]
 */
export const getVideos = async () => {
  try {
    const res = await axios.get(`${API}/list`);
    return res.data.videos;
  } catch (err) {
    console.error("Error fetching videos:", err);
    return [];
  }
};

/**
 * Add a new video
 * @param {File} videoFile - The video file to upload
 * @returns Created video object
 */
export const addVideo = async (videoFile) => {
  try {
    const formData = new FormData();
    formData.append("video", videoFile);

    const res = await axios.post(`${API}/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.video;
  } catch (err) {
    console.error("Error adding video:", err);
    return null;
  }
};

/**
 * Delete a video by ID
 * @param {string} id
 * @returns Success message
 */
export const deleteVideo = async (id) => {
  try {
    const res = await axios.delete(`${API}/delete/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting video:", err);
    return null;
  }
};

