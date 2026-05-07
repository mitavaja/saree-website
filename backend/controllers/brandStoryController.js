// controllers/brandStoryController.js

import BrandStory from "../models/BrandStory.js";

// GET (Frontend use)
export const getBrandStory = async (req, res) => {
  try {
    const data = await BrandStory.findOne().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching brand story",
      error: error.message,
    });
  }
};

// CREATE / UPDATE (Admin)
export const saveBrandStory = async (req, res) => {
  try {
    const { title, desc1, desc2, desc3, buttonText } = req.body;

    let video = "";
    if (req.file) {
      video = req.file.filename; // multer upload
    }

    // overwrite old (single record system)
    let existing = await BrandStory.findOne();

    if (existing) {
      existing.title = title;
      existing.desc1 = desc1;
      existing.desc2 = desc2;
      existing.desc3 = desc3;
      existing.buttonText = buttonText;
      if (video) existing.video = video;

      await existing.save();

      return res.json({
        success: true,
        message: "Updated successfully",
        data: existing,
      });
    }

    const newData = new BrandStory({
      title,
      desc1,
      desc2,
      desc3,
      buttonText,
      video,
    });

    await newData.save();

    res.json({
      success: true,
      message: "Created successfully",
      data: newData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving brand story",
      error: error.message,
    });
  }
};