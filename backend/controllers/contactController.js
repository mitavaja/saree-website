import Contact from "../models/Contact.js";

// CREATE MESSAGE
export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL (ADMIN)
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};