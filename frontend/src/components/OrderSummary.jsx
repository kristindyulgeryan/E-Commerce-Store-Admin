import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore.js";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios.js";
import { useEffect } from "react";

const stripePromise = loadStripe(
  "pk_test_51SChpME5vHFQInsc1BGbgApxXWavUCfETYT2gsYesZIJV5PvSrQC9IWerFKMgwJT8AiEfsEAlwOvzvIL3iXmGPnl00E0XSfA9w",
  { locale: "en" }
);

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart, setCoupon } =
    useCartStore();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  useEffect(() => {
    const checkForCoupon = async () => {
      try {
        const res = await axios.get(`/coupons?subtotal=${subtotal}`);
        const couponData = res.data;

        if (couponData && !coupon) {
          setCoupon(couponData);

          if (!isCouponApplied) {
            useCartStore.getState().applyCoupon(couponData.code);
          }
        }
      } catch (error) {
        console.error("Error checking coupon:", error);
      }
    };

    checkForCoupon();
  }, [subtotal, coupon, setCoupon, isCouponApplied]);

  const handlePayment = async () => {
    try {
      const res = await axios.post("/payments/create-checkout-session", {
        products: cart,
        couponCode: coupon ? coupon.code : null,
      });
      const session = res.data;

      window.location.href = session.url;
    } catch (error) {
      console.error("Checkout error:", error.response?.data || error.message);
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700  bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-yellow-600"> Order Summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              ${formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-yellow-600">
                -${formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-yellow-600">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}

          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-yellow-600">
              ${formattedTotal}
            </dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-yellow-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-yellow-600 underline hover:text-yellow-700 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
