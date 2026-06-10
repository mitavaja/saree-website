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

    let storyImagePath = about?.storyImage || "";
    let redefineImagePath = about?.redefineImage || "";

    // Handle uploaded files from upload.fields
    if (req.files) {
      if (req.files.storyImage && req.files.storyImage[0]) {
        storyImagePath = `/uploads/${req.files.storyImage[0].filename}`;
      }
      if (req.files.redefineImage && req.files.redefineImage[0]) {
        redefineImagePath = `/uploads/${req.files.redefineImage[0].filename}`;
      }
    } else if (req.file) {
      // Fallback for upload.single
      storyImagePath = `/uploads/${req.file.filename}`;
    }

    const updatedData = {
      ...req.body,
      storyImage: storyImagePath,
      redefineImage: redefineImagePath,
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