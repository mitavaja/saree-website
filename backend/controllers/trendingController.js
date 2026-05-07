import Trending from "../models/Trending.js";

// ✅ CREATE
export const createTrending = async (req, res) => {
  try {
    const count = await Trending.countDocuments();
    if (count >= 10) {
      return res.status(400).json({
        success: false,
        message: "Maximum 10 trending images allowed",
      });
    }

    const image = req.file ? req.file.filename : null;

    const newTrending = new Trending({
      image,
    });

    await newTrending.save();

    res.status(201).json({
      success: true,
      data: newTrending,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET ALL
export const getTrending = async (req, res) => {
  try {
    const data = await Trending.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET SINGLE
export const getSingleTrending = async (req, res) => {
  try {
    const item = await Trending.findById(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ UPDATE
export const updateTrending = async (req, res) => {
  try {
    const { isActive, order } = req.body;

    let updateData = {
      isActive,
      order,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Trending.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ DELETE
export const deleteTrending = async (req, res) => {
  try {
    await Trending.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};