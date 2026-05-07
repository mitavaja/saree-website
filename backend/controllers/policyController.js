import Policy from "../models/Policy.js";

// GET Privacy Policy
export const getPrivacyPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({ type: "privacy" });

    if (!policy) {
      return res.json({ success: false, message: "Not found" });
    }

    res.json({
      success: true,
      content: policy.content
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// CREATE / UPDATE Privacy Policy
export const updatePrivacyPolicy = async (req, res) => {
  try {
    const { content } = req.body;

    const updated = await Policy.findOneAndUpdate(
      { type: "privacy" },
      { type: "privacy", content },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET Terms
export const getTerms = async (req, res) => {
  try {
    const policy = await Policy.findOne({ type: "terms" });

    res.json({
      success: true,
      content: policy?.content || ""
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// SAVE / UPDATE Terms
export const updateTerms = async (req, res) => {
  try {
    const { content } = req.body;

    const updated = await Policy.findOneAndUpdate(
      { type: "terms" },
      { type: "terms", content },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET Return
export const getReturnPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({ type: "return" });

    res.json({
      success: true,
      content: policy?.content || ""
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE Return
export const updateReturnPolicy = async (req, res) => {
  try {
    const { content } = req.body;

    const updated = await Policy.findOneAndUpdate(
      { type: "return" },
      { type: "return", content },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// GET Shipping
export const getShippingPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({ type: "shipping" });

    res.json({
      success: true,
      content: policy?.content || ""
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE Shipping
export const updateShippingPolicy = async (req, res) => {
  try {
    const { content } = req.body;

    const updated = await Policy.findOneAndUpdate(
      { type: "shipping" },
      { type: "shipping", content },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};