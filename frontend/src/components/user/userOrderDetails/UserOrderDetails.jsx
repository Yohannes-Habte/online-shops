import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { API } from "../../../utils/security/secreteKey";
import "./UserOrderDetails.scss";
import UserSingleOrderItems from "../userSingleOrderItems/UserSingleOrderItems";
import UserSingleOrderItemReview from "../userSingleOrderItemReview/UserSingleOrderItemReview";
import UserSingleOrderRefund from "../userSingleOrderRefund/UserSingleOrderRefund";
import UserSingleOrderSummary from "../userSingleOrderSummary/UserSingleOrderSummary";

const initialState = {
  comment: "",
  rating: 1,
};
const UserOrderDetails = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [orderInfos, setOrderInfos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refundReason, setRefundReason] = useState("");

  console.log("orderInfos", orderInfos);

  useEffect(() => {
    const fetchSingleOrder = async () => {
      try {
        const { data } = await axios.get(`${API}/orders/${id}`, {
          withCredentials: true,
        });
        setOrderInfos(data.order);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch order details");
        setLoading(false);
      }
    };
    fetchSingleOrder();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRatings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setRatings(initialState);
    setOpen(false);
  };

  // Review product handler
  const reviewHandler = async (e) => {
    e.preventDefault();
    try {
      const newProductReview = {
        userId: currentUser._id,
        ratings,
        productId: selectedProduct?._id,
        orderId: id,
      };

      const { data } = await axios.put(
        `${API}/products/product/review`,
        newProductReview,
        { withCredentials: true }
      );

      toast.success(data.message);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Review submission failed");
    }
  };

  // Request refund handler
  // Request refund handler
  const refundHandler = async () => {
    // Ensure we have the latest order status before proceeding
    if (orderInfos?.orderStatus === "Refund Requested") {
      return toast.error("Refund request already submitted.");
    }

    if (!refundReason) {
      return toast.error("Please provide a reason for the refund request.");
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to request a refund?"
    );
    if (!isConfirmed) return;

    try {
      setLoading(true);

      const refundRequest = {
        orderStatus: "Refund Requested",
        returnReason: refundReason,
      };

      const { data } = await axios.put(
        `${API}/orders/${id}/refund/request`,
        refundRequest,
        { withCredentials: true }
      );

      toast.success(data.message);

      // Update orderInfos state with new status to prevent multiple submissions
      setOrderInfos((prev) => ({
        ...prev,
        orderStatus: "Refund Requested",
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="user-order-details">
      <header className="order-header">
        <h1>Order Details</h1>
        <p className="order-id">
          Order ID: <span>#{orderInfos?._id?.slice(0, 8)}</span>
        </p>
        <p className="order-date">
          Placed on: <strong>{orderInfos?.createdAt?.slice(0, 10)}</strong>
        </p>
      </header>

      <UserSingleOrderItems
        orderInfos={orderInfos}
        setOpen={setOpen}
        setSelectedProduct={setSelectedProduct}
      />

      {open && (
        <UserSingleOrderItemReview
          reviewHandler={reviewHandler}
          handleChange={handleChange}
          ratings={ratings}
          resetForm={resetForm}
        />
      )}

      <UserSingleOrderSummary
        orderInfos={orderInfos}
        currentUser={currentUser}
      />

      <UserSingleOrderRefund
        refundHandler={refundHandler}
        refundReason={refundReason}
        setRefundReason={setRefundReason}
      />

      {/* Refund Details Section */}
      {orderInfos?.payment?.refunds?.length > 0 && (
        <section className="refund-details">
          <h2>Refund Details</h2>
          {orderInfos.payment.refunds.map((refund, index) => (
            <div key={index} className="refund-item">
              <p>
                <strong>Refund ID:</strong> {refund.refundId}
              </p>
              <p>
                <strong>Amount:</strong> ${refund.amount.toFixed(2)}
              </p>
              <p>
                <strong>Reason:</strong> {refund.reason || "No reason provided"}
              </p>
              <p>
                <strong>Refund Date:</strong>{" "}
                {new Date(refund.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </section>
      )}
    </section>
  );
};

export default UserOrderDetails;
