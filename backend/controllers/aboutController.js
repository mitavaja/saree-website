import About from "../models/About.js";

export const getAbout = async (req, res) => {
  try {
    const data = await About.findOne();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    let imagePath = about?.storyImage || "";

    // 👇 agar new image upload hui
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const updatedData = {
      ...req.body,
      storyImage: imagePath,
      whyItems: JSON.parse(req.body.whyItems || "[]")
    };

    if (about) {
      about = await About.findByIdAndUpdate(about._id, updatedData, { new: true });
    } else {
      about = new About(updatedData);
      await about.save();
    }

    res.json({ message: "Saved", about });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};