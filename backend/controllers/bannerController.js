import Banner from "../models/Banner.js";

// Get all banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json({ banners });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add new banner
export const addBanner = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    const banner = await Banner.create({
      title: req.body.title,
      subtitle: req.body.subtitle || "",
      buttonText: req.body.buttonText || "SHOP NOW",
      image: `/uploads/banners/${req.file.filename}`,
    });

    res.status(201).json({ banner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update banner
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    banner.title = req.body.title || banner.title;
    banner.subtitle = req.body.subtitle || banner.subtitle;
    banner.buttonText = req.body.buttonText || banner.buttonText;

    if (req.file) banner.image = `/uploads/banners/${req.file.filename}`;

    await banner.save();
    res.json({ banner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    res.json({ message: "Banner deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};