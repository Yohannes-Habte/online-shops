import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { API } from "../../../utils/security/secreteKey";
import "./UserOrderDetails.scss";
import UserSingleOrderItems from "../userSingleOrderItems/UserSingleOrderItems";
import UserSingleOrderItemReview from "../userSingleOrderItemReview/UserSingleOrderItemReview";
import UserSingleOrderSummary from "../userSingleOrderSummary/UserSingleOrderSummary";
import UserSingleOrderRefundInfo from "../userSingleOrderRefundInfo/UserSingleOrderRefundInfo";
import UserSingleOrderRefundRequest from "../userSingleOrderRefundRequest/UserSingleOrderRefundRequest";
import UserSingleOrderRefundForm from "../userSingleOrderRefundForm/UserSingleOrderRefund";

const initialState = {
  comment: "",
  rating: 1,
};

const UserOrderDetails = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [orderInfos, setOrderInfos] = useState(null);
  const [ratings, setRatings] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single order details
  useEffect(() => {
    const fetchSingleOrder = async () => {
      try {
        const { data } = await axios.get(`${API}/orders/${id}`, {
          withCredentials: true,
        });
        setOrderInfos(data.order);
      } catch (error) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleOrder();
  }, [id]);

  // Handle ratings change
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

  // ==================================================================
  // Review product handler
  // ==================================================================
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

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <section className="user-order-details">
      <header className="order-header">
        <h1>Order Details</h1>
        <p className="order-id">
          Order ID: <span>#{orderInfos?._id?.slice(0, 10)}</span>
        </p>
        <p className="order-date">
          Placed on: <strong>{orderInfos?.createdAt?.slice(0, 10)}</strong>
        </p>
      </header>

      {error && <h2>{error}</h2>}

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

      <UserSingleOrderRefundForm
        orderInfos={orderInfos}
        setOrderInfos={setOrderInfos}
      />

      {(orderInfos.orderStatus === "Refund Requested" ||
        orderInfos.payment.paymentStatus === "refunded") && (
        <UserSingleOrderRefundRequest order={orderInfos} />
      )}

      {orderInfos?.orderStatus === "Refunded" &&
        orderInfos.payment.paymentStatus === "refunded" &&
        orderInfos?.payment?.refunds?.length > 0 && (
          <UserSingleOrderRefundInfo order={orderInfos} />
        )}
    </section>
  );
};

export default UserOrderDetails;
