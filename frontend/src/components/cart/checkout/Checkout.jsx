import { useEffect, useState } from "react";
import "./Checkout.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Shipping from "../shipping/Shipping";
import CartInfo from "../cartInfo/CartInfo";

const initialState = {
  country: "",
  state: "",
  city: "",
  address: "",
  zipCode: "",
  phoneNumber: "",
  couponCode: "",
  couponCodeData: null,
  discountPrice: null,
  userInfo: false,
};

const Checkout = () => {
  const navigate = useNavigate();

  // Global state
  const { currentUser } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);

  // Local state
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors on input change
  };

  const validateForm = () => {
    const { address, zipCode, country, state, city, phoneNumber } = formData;
    const newErrors = {};
    if (!address) newErrors.address = "Address is required.";
    if (!zipCode) newErrors.zipCode = "Zip code is required.";
    if (!country) newErrors.country = "Country is required.";
    if (!state) newErrors.state = "State is required.";
    if (!city) newErrors.city = "City is required.";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSubTotal = () =>
    cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);

  const calculateShippingFee = (subTotal) =>
    subTotal <= 100 ? 50 : subTotal * 0.1;

  const calculateTax = (subTotal) => subTotal * 0.02;

  const calculateServiceCharge = (subTotal) => subTotal * 0.01;

  const calculateDiscount = (subTotal) => {
    if (subTotal > 500) return subTotal * 0.1; // 10% discount
    if (subTotal > 200) return subTotal * 0.05; // 5% discount
    return 0; // No discount
  };

  const proceedToPayment = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    try {
      const { address, zipCode, country, state, city, phoneNumber } = formData;
      const subTotal = calculateSubTotal();
      const shippingFee = calculateShippingFee(subTotal);
      const tax = calculateTax(subTotal);
      const serviceCharge = calculateServiceCharge(subTotal);
      const discount = calculateDiscount(subTotal);
      const grandTotal = subTotal + shippingFee + tax + serviceCharge - discount;

      const orderData = {
        currentUser,
        cart,
        shippingAddress: { address, zipCode, country, state, city, phoneNumber },
        subTotal,
        shippingFee,
        tax,
        serviceCharge,
        discount,
        grandTotal,
      };

   

      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    } catch (error) {
      toast.error("Failed to proceed to payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const subTotal = calculateSubTotal();
  const shippingFee = calculateShippingFee(subTotal);
  const tax = calculateTax(subTotal);
  const serviceCharge = calculateServiceCharge(subTotal);
  const discount = calculateDiscount(subTotal);
  const totalPrice = subTotal + shippingFee + tax + serviceCharge - discount;

  return (
    <section className="cart-checkout-wrapper">
      <div className="shipping-and-cart-info-container">
        <CartInfo
          subTotal={subTotal}
          shippingFee={shippingFee}
          discount={discount}
          serviceCharge={serviceCharge}
          totalPrice={totalPrice}
        />

        <Shipping
          user={currentUser}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          errors={errors} // Pass validation errors to the Shipping component
        />
      </div>

      <button
        onClick={proceedToPayment}
        className="proceed-payment"
        disabled={loading} // Disable button if loading
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </section>
  );
};

export default Checkout;
