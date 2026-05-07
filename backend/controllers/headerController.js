import headerModel from "../models/Header.js";

// Get header nav links
export const getHeader = async (req, res) => {
  try {
    const header = await headerModel.findOne();
    if (!header) {
      // Default links if empty
      return res.json({
        success: true,
        header: {
          logo: "",
          navLinks: [
            { name: "HOME", link: "/" },
            { name: "COLLECTION", link: "/collection" },
            { name: "ABOUT", link: "/about" },
            { name: "CONTACT", link: "/contact" }
          ]
        }
      });
    }
    res.json({ success: true, header });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update header nav links
export const updateHeader = async (req, res) => {
  try {
    let { navLinks } = req.body;
    if (typeof navLinks === "string") {
      navLinks = JSON.parse(navLinks);
    }
    
    let logo = "";
    if (req.file) {
      logo = `/uploads/${req.file.filename}`;
    }

    let header = await headerModel.findOne();

    if (header) {
      if (navLinks) header.navLinks = navLinks;
      if (logo) header.logo = logo;
      await header.save();
    } else {
      header = new headerModel({ navLinks: navLinks || [], logo });
      await header.save();
    }

    res.json({ success: true, message: "Header settings updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
