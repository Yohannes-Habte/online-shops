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

  // ==========================================================================================
  // Load Order Data
  // ==========================================================================================

  useEffect(() => {
    const latestOrder = localStorage.getItem("latestOrder");
    if (latestOrder) setOrderData(JSON.parse(latestOrder));
  }, []);

  // ==========================================================================================
  // Handle API Errors
  // ==========================================================================================

  const handleAPIError = (error, fallbackMessage = "An error occurred.") => {
    console.error(error);
    toast.error(error?.response?.data?.message || fallbackMessage);
  };

  // ==========================================================================================
  // Clear Cart and Redirect to Order Success Page
  // ==========================================================================================

  const clearCartAndRedirect = () => {
    dispatch(clearFromCart());
    localStorage.removeItem("latestOrder");
    navigate("/order/success");
    toast.success("Order placed successfully!");
  };

  // ==========================================================================================
  // Stripe Payment Handler
  // ==========================================================================================
  const stripePaymentHandler = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const paymentData = {
      amount: Math.round(orderData?.grandTotal * 100),
      currency: "USD",
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
        const order = createOrderObject(
          result.paymentIntent.id,
          "Credit Card",
          "completed"
        );
        await submitOrder(order);
      }
    } catch (error) {
      handleAPIError(error, "Stripe payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ==========================================================================================
  // PayPal Payment Handler: Create Order and On Approve
  // ==========================================================================================

  const createOrder = async (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Lisa Online Shopping Products",
            amount: {
              currency_code: "USD",
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
        const order = createOrderObject(
          paymentInfo.id, // Use PayPal capture ID
          "PayPal",
          "completed"
        );
        await submitOrder(order); // Submit order
      } else {
        throw new Error("Payment details not available.");
      }
    } catch (error) {
      handleAPIError(error, "PayPal payment failed. Please try again.");
    }
  };

  // ==========================================================================================
  // Cash on Delivery Payment Handler
  // ==========================================================================================

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    // Generate a random transaction ID
    const generateTransactionId = () => {
      const timestamp = Date.now().toString(36); // Base-36 representation of current timestamp
      const randomString = Math.random().toString(36).substring(2, 8);
      return `${timestamp}-${randomString}`;
    };

    const transactionId = generateTransactionId();
    const order = createOrderObject(
      transactionId,
      "Cash On Delivery",
      "pending"
    );

    await submitOrder(order);
  };

  // ==========================================================================================
  // Create Order Object
  // ==========================================================================================
  const createOrderObject = (paymentId, method, status) => ({
    orderedItems: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    subTotal: orderData?.subTotal,
    shippingFee: orderData?.shippingFee,
    tax: orderData?.tax,
    serviceFee: orderData?.serviceCharge,
    grandTotal: orderData?.grandTotal,
    customer: currentUser?._id,
    payment: {
      method,
      provider: method === "Cash On Delivery" ? undefined : method,
      paymentStatus: status,
      transactionId: paymentId || undefined,
      amountPaid: orderData?.grandTotal,
      currency: "USD",
      metadata: {
        orderId: orderData?.orderId,
        userId: currentUser?._id,
      },
    },
    orderStatus: "Pending",
  });

  // ==========================================================================================
  // Submit Order
  // ==========================================================================================
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
    <section className="payment-methods-wrapper">
      <div className="paymentInfo-cardData-wrapper">
        <PaymentInfo
          user={currentUser}
          onApprove={onApprove}
          createOrder={createOrder}
          stripePaymentHandler={stripePaymentHandler}
          cashOnDeliveryHandler={cashOnDeliveryHandler}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          handleAPIError={handleAPIError}
        />
        <CartData orderData={orderData} />
      </div>
    </section>
  );
};

export default PaymentMethod;
