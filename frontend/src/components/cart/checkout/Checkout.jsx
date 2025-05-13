import { useEffect, useState } from "react";
import "./Checkout.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Shipping from "../shipping/Shipping";
import CartInfo from "../cartInfo/CartInfo";
import CalculatedShippingPrice from "../../../utils/shippingPrice/ShippingPrice";

const serviceEnum = [
  "Standard",
  "Express",
  "Overnight",
  "TwoDay",
  "SameDay",
  "Economy",
  "Freight",
  "International",
  "NextDay",
  "Scheduled",
];

const initialState = {
  country: "",
  state: "",
  city: "",
  streetName: "",
  houseNumber: "",
  zipCode: "",
  phoneNumber: "",
  service: "",
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
    const {
      streetName,
      houseNumber,
      service,
      zipCode,
      country,
      state,
      city,
      phoneNumber,
    } = formData;
    const newErrors = {};
    if (!streetName) newErrors.streetName = "Street name is required.";
    if (!houseNumber) newErrors.houseNumber = "House number is required.";
    if (!service) newErrors.service = "Service type is required.";
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

  const subTotal = calculateSubTotal();

  const totalItems = cart?.reduce((acc, item) => acc + item.qty, 0);

  const totalShippingFee = CalculatedShippingPrice(subTotal, totalItems, formData.service || serviceEnum[0]);


  const calculateTax = (subTotal) => subTotal * 0.02;

  const calculateDiscount = (subTotal) => {
    if (typeof subTotal !== "number" || subTotal < 0) return 0;

    // Discount tiers (threshold and discount values)
    const discountTiers = [
      { threshold: 10000, discount: 0.05 },
      { threshold: 4000, discount: 0.04 },
      { threshold: 2000, discount: 0.03 },
      { threshold: 1000, discount: 0.02 },
      { threshold: 500, discount: 0.01 },
      { threshold: 250, discount: 0.005 },
    ];

    // Loop through the discount tiers to find the appropriate discount
    for (const { threshold, discount } of discountTiers) {
      if (subTotal >= threshold) {
        return subTotal * discount;
      }
    }

    // No discount if subTotal is below the first threshold
    return 0;
  };

  const calculateGrandTotal = (subtotal, tax, shippingFee, discount) => {
    if (
      typeof subtotal !== "number" ||
      typeof tax !== "number" ||
      typeof shippingFee !== "number" ||
      typeof discount !== "number"
    ) {
      throw new Error("Invalid input: All inputs must be numbers.");
    }

    return subtotal + tax + shippingFee - discount;
  };

  const proceedToPayment = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    try {
      const {
        streetName,
        houseNumber,
        service,
        zipCode,
        country,
        state,
        city,
        phoneNumber,
      } = formData;
      const subTotal = calculateSubTotal();
      const shippingFee = totalShippingFee;
      const tax = calculateTax(subTotal);
      const discount = calculateDiscount(subTotal);
      const grandTotal = calculateGrandTotal(
        subTotal,
        tax,
        totalShippingFee,
        discount
      );

      const orderData = {
        currentUser,
        cart,
        shippingAddress: {
          streetName,
          houseNumber,
          zipCode,
          country,
          state,
          city,
          phoneNumber,
          service,
        },
        subTotal,
        shippingFee,
        tax,
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

 
 
  const tax = calculateTax(subTotal);
  const discount = calculateDiscount(subTotal);
  const totalPrice = subTotal + totalShippingFee + tax - discount;

  return (
    <div className="cart-checkout-wrapper">
      <Shipping
        user={currentUser}
        serviceEnum={serviceEnum}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        errors={errors}
        proceedToPayment={proceedToPayment}
        loading={loading}
      />

      <CartInfo
        subTotal={subTotal}
        shippingFee={totalShippingFee}
        tax={tax}
        discount={discount}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default Checkout;
