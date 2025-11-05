import Coupon from "../models/coupon.model.js";

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days
    userId,
  });

  await newCoupon.save();

  return newCoupon;
}

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });

    if (
      !coupon &&
      req.query.subtotal &&
      parseFloat(req.query.subtotal) >= 200
    ) {
      const newCoupon = await createNewCoupon(req.user._id);
      return res.json(newCoupon);
    }

    res.json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controlelr", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon controlelr", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
