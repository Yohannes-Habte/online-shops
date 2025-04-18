import { useState, useEffect } from "react";
import "./PaymentMethod.scss";
import { useNavigate } from "react-router-dom";
import {
  CardNumberElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import PaymentInfo from "../paymentInfo/PaymentInfo";
import CartData from "../cartData/CartData";
import { clearFromCart } from "../../../redux/reducers/cartReducer";
import { API } from "../../../utils/security/secreteKey";

const PaymentMethod = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const { currentUser } = useSelector((state) => state.user);
  const [orderData, setOrderData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const currencyOptions = ["USD", "EUR", "GBP", "INR", "JPY", "AUD"];

  const paymentMethodConfig = {
    "Credit Card": { provider: "Stripe", status: "completed" },
    "Debit Card": { provider: "Bank Transfer", status: "completed" },
    PayPal: { provider: "PayPal", status: "completed" },
    "Cash On Delivery": { provider: undefined, status: "pending" },
  };

  const methodOptions = Object.keys(paymentMethodConfig);

  // =========================================================================
  // Load Order Data
  // =========================================================================

  useEffect(() => {
    const latestOrder = localStorage.getItem("latestOrder");
    if (latestOrder) setOrderData(JSON.parse(latestOrder));
  }, []);

  // =========================================================================
  // Handle API Errors
  // =========================================================================

  const handleAPIError = (error, fallbackMessage = "An error occurred.") => {
    console.error(error);
    toast.error(error?.response?.data?.message || fallbackMessage);
  };

  // =============================================================================
  // Clear Cart and Redirect to Order Success Page
  // =============================================================================

  const clearCartAndRedirect = () => {
    dispatch(clearFromCart());
    localStorage.removeItem("latestOrder");
    navigate("/order/success");
    toast.success("Order placed successfully!");
  };

  // ================================================================================
  // Create Order Object
  // ================================================================================
  const createOrderObject = (paymentId, method, provider, status) => ({
    orderedItems: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    subTotal: orderData?.subTotal,
    shippingFee: orderData?.shippingFee,
    tax: orderData?.tax,
    grandTotal: orderData?.grandTotal,
    customer: currentUser?._id,
    payment: {
      method,
      provider: method === "Cash On Delivery" ? undefined : provider,
      paymentStatus: status,
      transactionId: paymentId || undefined,
      currency: selectedCurrency || "USD",
      amountPaid: orderData?.grandTotal?.toFixed(2),
      metadata: {
        userId: currentUser?._id,
        orderDate: new Date().toISOString(),
        shippingFee: orderData?.shippingFee,
        tax: orderData?.tax,
        discount: orderData?.discount,
      },
      createdBy: currentUser?._id,
    },
    orderStatus: "Pending",
  });

  // ===============================================================================
  // Stripe Payment Handler
  // ===============================================================================
  const stripePaymentHandler = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!selectedCurrency) {
      toast.error("Please select a currency.");
      return;
    }

    const paymentData = {
      amount: Math.round(orderData?.grandTotal * 100),
      currency: selectedCurrency,
    };

    setIsProcessing(true);

    try {
      const { data } = await axios.post(`${API}/payment/stripe`, paymentData, {
        withCredentials: true,
      });

      const clientSecret = data.client_secret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        const config = paymentMethodConfig[selectedPaymentMethod] || {};
        const order = createOrderObject(
          result.paymentIntent.id,
          selectedPaymentMethod,
          config.provider,
          config.status
        );
        await submitOrder(order);
      }
    } catch (error) {
      handleAPIError(error, "Stripe payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // =================================================================================
  // PayPal Payment Handler: Create Order and On Approve
  // =================================================================================

  const createOrder = async (data, actions) => {
    if (!selectedCurrency) {
      toast.error("Please select a currency.");
      return;
    }
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Lisa Online Shopping Products",
            amount: {
              currency_code: selectedCurrency,
              value: orderData?.grandTotal.toFixed(2), // Ensure proper decimal format
            },
          },
        ],
        application_context: { shipping_preference: "NO_SHIPPING" },
      })
      .catch((error) => {
        console.error("PayPal Order Creation Error:", error);
        handleAPIError(error, "Failed to create PayPal order.");
      });
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture(); // Capture payment
      const paymentInfo = details?.purchase_units[0]?.payments?.captures[0];

      if (paymentInfo) {
        const config = paymentMethodConfig[selectedPaymentMethod] || {};
        const order = createOrderObject(
          paymentInfo.id, // Use PayPal capture ID
          selectedPaymentMethod,
          config.provider,
          config.status
        );
        await submitOrder(order); // Submit order
      } else {
        throw new Error("Payment details not available.");
      }
    } catch (error) {
      handleAPIError(error, "PayPal payment failed. Please try again.");
    }
  };

  // ======================================================================
  // Cash on Delivery Payment Handler
  // ======================================================================

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    if (!selectedCurrency) {
      toast.error("Please select a currency.");
      return;
    }

    // Generate a random transaction ID
    const generateTransactionId = () => {
      const timestamp = Date.now().toString();
      const randomBytes = new Uint8Array(16);
      window.crypto.getRandomValues(randomBytes);

      const randomHex = Array.from(randomBytes)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      return `txn-${timestamp}-${randomHex.slice(0, 32)}`;
    };

    const config = paymentMethodConfig[selectedPaymentMethod] || {};

    const transactionId = generateTransactionId();
    const order = createOrderObject(
      transactionId,
      selectedPaymentMethod,
      config.provider,
      config.status
    );

    await submitOrder(order);
  };

  // ================================================================================
  // Submit Order
  // ================================================================================
  const submitOrder = async (order) => {
    try {
      await axios.post(`${API}/orders/create`, order, {
        withCredentials: true,
      });
      clearCartAndRedirect();
    } catch (error) {
      handleAPIError(error, "Failed to place the order. Please try again.");
    }
  };

  return (
    <div className="payment-methods-wrapper">
      <PaymentInfo
        user={currentUser}
        onApprove={onApprove}
        createOrder={createOrder}
        stripePaymentHandler={stripePaymentHandler}
        cashOnDeliveryHandler={cashOnDeliveryHandler}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        handleAPIError={handleAPIError}
        currencyOptions={currencyOptions}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        methodOptions={methodOptions}
      />

      <CartData orderData={orderData} />
    </div>
  );
};

export default PaymentMethod;
