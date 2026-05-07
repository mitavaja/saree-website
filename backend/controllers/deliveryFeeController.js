import deliveryFeeModel from "../models/deliveryFee.js";

// ✅ ADD / UPDATE STATE FEE (Admin)
export const setDeliveryFee = async (req, res) => {
  try {
    const { state, fee } = req.body;

    let existing = await deliveryFeeModel.findOne({ state });

    if (existing) {
      existing.fee = fee;
      await existing.save();
    } else {
      await deliveryFeeModel.create({ state, fee });
    }

    res.json({ success: true, message: "Fee saved" });

  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// ✅ GET FEE BY STATE
export const getDeliveryFee = async (req, res) => {
  try {
    const { state } = req.params;

    const data = await deliveryFeeModel.findOne({
      state: new RegExp(`^${state}$`, "i") // case insensitive
    });

    if (!data) {
      return res.json({ success: true, fee: 0 }); // default
    }

    res.json({ success: true, fee: data.fee });

  } catch (error) {
    res.json({ success: false, fee: 0 });
  }
};

export const getAllDeliveryFees = async (req, res) => {
  try {
    const data = await deliveryFeeModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: data || []   // ✅ always array
    });

  } catch (error) {
    res.json({
      success: false,
      data: []           // ✅ fallback array
    });
  }
};

export const deleteDeliveryFee = async (req, res) => {
  try {
    const deleted = await deliveryFeeModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.json({ success: false, message: "Not found" });
    }

    res.json({ success: true });

  } catch (error) {
    res.json({ success: false });
  }
};