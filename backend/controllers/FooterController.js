import Footer from "../models/Footer.js";
import multer from "multer";
import fs from "fs";

// ================= MULTER CONFIG =================

// create uploads folder
const uploadPath = "uploads/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s/g, "");
    cb(null, uniqueName);
  },
});

// filter
const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ================= API =================

// GET FOOTER
export const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();

    if (!footer) {
      footer = await Footer.create({});
    }

    res.status(200).json(footer);
  } catch (err) {
    res.status(500).json({ message: "Error fetching footer" });
  }
};

// UPDATE FOOTER (WITH IMAGE)
export const updateFooter = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    let footer = await Footer.findOne();

    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      req.body.logo = imageUrl;
    }

    // SAFE PARSE
    if (req.body.categories && typeof req.body.categories === "string") {
      try {
        req.body.categories = JSON.parse(req.body.categories);
      } catch {
        req.body.categories = [];
      }
    }

    if (req.body.footerLinks && typeof req.body.footerLinks === "string") {
      try {
        req.body.footerLinks = JSON.parse(req.body.footerLinks);
      } catch {
        req.body.footerLinks = [];
      }
    }

    if (!footer) {
      footer = new Footer(req.body);
    } else {
      Object.assign(footer, req.body);
    }

    await footer.save();

    res.status(200).json({
      message: "Footer updated successfully",
      footer,
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};