import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ShopOrderDetails.scss";
import { API } from "../../../utils/security/secreteKey";
import { MdOutlineAssignmentTurnedIn, MdMessage } from "react-icons/md";

const ShopOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [cancellationReason, setCancellationReason] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [tracking, setTracking] = useState({
    carrier: "",
    trackingNumber: "",
    estimatedDeliveryDate: null,
  });

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/orders/${id}/shop/order`, {
          withCredentials: true,
        });

        setOrder(data.order);
        setStatus(data.order?.orderStatus || "");
        setReviews(data.order?.reviews || []);
        setTracking({
          carrier: data.order?.tracking?.carrier || "",
          trackingNumber: data.order?.tracking?.trackingNumber || "",
          estimatedDeliveryDate: data.order?.tracking?.estimatedDeliveryDate
            ? new Date(data.order.tracking.estimatedDeliveryDate)
            : null,
        });
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Handle tracking input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTracking((prevTracking) => ({
      ...prevTracking,
      [name]: value,
    }));
  };

  // Generate tracking number only when necessary
  const generateTrackingNumber = () => {
    return `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
  };

  // Update order status
  const updateOrderStatus = async (e) => {
    e.preventDefault();
    if (!status) return toast.error("Please select an order status.");

    const updateData = { orderStatus: status, tracking: tracking };

    if (status === "Cancelled")
      updateData.cancellationReason = cancellationReason;
    if (status === "Returned") updateData.returnReason = returnReason;

    if (status === "Processing") {
      updateData.tracking = {
        carrier: tracking.carrier,
        estimatedDeliveryDate: tracking.estimatedDeliveryDate,
        trackingNumber: tracking.trackingNumber || generateTrackingNumber(),
      };
    }

    setProcessing(true);
    try {
      const { data } = await axios.put(
        `${API}/orders/${id}/update/status`,
        updateData,
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setOrder((prevOrder) => ({
        ...prevOrder,
        orderStatus: status,
        cancellationReason:
          status === "Cancelled"
            ? cancellationReason
            : prevOrder.cancellationReason,
        returnReason:
          status === "Returned" ? returnReason : prevOrder.returnReason,
        tracking:
          status === "Processing" ? updateData.tracking : prevOrder.tracking,
        statusHistory: [
          ...(prevOrder.statusHistory || []),
          { status, changedAt: new Date().toISOString() },
        ],
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating order status"
      );
    } finally {
      setProcessing(false);
    }
  };

  // Handle refund processing
  const handleRefund = async (e) => {
    e.preventDefault();
    if (!refundAmount || !refundReason) {
      return toast.error("Please enter refund amount and reason.");
    }

    try {
      const { data } = await axios.put(
        `${API}/orders/${id}/process-refund`,
        { refundAmount, refundReason },
        { withCredentials: true }
      );

      toast.success(data.message);
      setOrder((prevOrder) => ({
        ...prevOrder,
        isRefunded: true,
        refundAmount,
        refundReason,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing refund.");
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="shop-order-details">
      <header>
        <h1>Order Details</h1>
        <p>Order ID: #{order?._id?.slice(0, 8)}</p>
        <p>Placed on: {order?.createdAt?.slice(0, 10)}</p>
      </header>

      <section className="ordered-items">
        <h2>Ordered Items</h2>
        {order?.orderedItems?.map((item) => (
          <article key={item._id} className="product-card">
            <figure>
              <img src={item.productImage} alt={item.title} />
            </figure>
            <article>
              <h3>{item.title}</h3>
              <p>Brand: {item.brand?.brandName}</p>
              <p>Category: {item.category?.categoryName}</p>
              <p>Color: {item.productColor}</p>
              <p>Size: {item.size}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
              <p>Total: ${item.total}</p>
            </article>
          </article>
        ))}
      </section>

      <div className="order-summary-and-shipping-address">
        <section className="order-summary">
          <h2>Order Summary</h2>
          <p>Subtotal: ${order?.subtotal?.toFixed(2)}</p>
          <p>Shipping Fee: ${order?.shippingFee?.toFixed(2)}</p>
          <p>Tax: ${order?.tax?.toFixed(2)}</p>
          <p>Service Fee: ${order?.serviceFee?.toFixed(2)}</p>
          <h3>Grand Total: ${order?.grandTotal?.toFixed(2)}</h3>
        </section>

        <section className="shipping-address">
          <h2>Shipping Address</h2>
          <p>{order?.shippingAddress?.address}</p>
          <p>
            {order?.shippingAddress?.zipCode}, {order?.shippingAddress?.city}
          </p>
          <p>{order?.shippingAddress?.state}</p>
          <p>{order?.shippingAddress?.country}</p>
          <p>Phone: {order?.shippingAddress?.phoneNumber}</p>
        </section>
      </div>

      <section className="order-update-processing">
        <h2 className="status-update-title">Update Order Status</h2>
        <form onSubmit={updateOrderStatus} className="order-status-form">
          {/* Order Status Dropdown */}
          <div className="input-container">
            <MdOutlineAssignmentTurnedIn className="input-icon" />
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="status-select"
            >
              {[
                "Pending",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
                "Returned",
              ].map((selectStatus) => (
                <option key={selectStatus} value={selectStatus}>
                  {selectStatus}
                </option>
              ))}
            </select>
          </div>
          {/* Tracking Information (only for "Processing" status) */}
          {status === "Processing" && (
            <div className="tracking-info">
              <div className="input-container">
                <select
                  name="carrier"
                  value={tracking.carrier}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Carrier</option>
                  <option value="FedEx">FedEx</option>
                  <option value="UPS">UPS</option>
                  <option value="USPS">USPS</option>
                  <option value="DHL">DHL</option>
                </select>
              </div>

              <div className="input-container">
                <input
                  type="text"
                  name="trackingNumber"
                  placeholder="Tracking Number"
                  value={tracking.trackingNumber}
                  onChange={handleChange}
                  readOnly
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={() =>
                    setTracking((prev) => ({
                      ...prev,
                      trackingNumber: generateTrackingNumber(),
                    }))
                  }
                >
                  Generate Tracking Number
                </button>
              </div>

              <div className="input-container">
                <input
                  type="date"
                  name="estimatedDeliveryDate"
                  value={
                    tracking.estimatedDeliveryDate
                      ? new Date(tracking.estimatedDeliveryDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Cancellation Reason Input */}
          {status === "Cancelled" && (
            <div className="input-container">
              <MdMessage className="input-icon" />
              <textarea
                name="cancellationReason"
                id="cancellationReason"
                rows={4}
                cols={50}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter cancellation reason"
              />
            </div>
          )}

          {/* Return Reason Input */}
          {status === "Returned" && (
            <div className="input-container">
              <MdMessage className="input-icon" />
              <textarea
                name="returnReason"
                id="returnReason"
                rows={4}
                cols={50}
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Enter return reason"
              />
            </div>
          )}

          <button type="submit" disabled={order?.orderStatus === "Delivered"}>
            {processing ? "Updating..." : "Update Status"}
          </button>
        </form>
      </section>

      {order?.orderStatus === "Cancelled" && order?.cancellationReason && (
        <section className="cancellation-info">
          <h2>Cancellation Details</h2>
          <p>
            <strong>Reason:</strong> {order.cancellationReason}
          </p>
        </section>
      )}

      {order?.orderStatus === "Returned" && order?.returnReason && (
        <section className="return-info">
          <h2>Return Details</h2>
          <p>
            <strong>Reason:</strong> {order.returnReason}
          </p>
        </section>
      )}

      {/* Refund order processing */}
      <div className="refund-order-processing-container">
        {order?.payment?.paymentStatus === "completed" && (
          <section className="refund">
            <h2>Refund Order</h2>
            <form onSubmit={handleRefund}>
              <input
                type="number"
                placeholder="Refund Amount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
              />
              <textarea
                placeholder="Refund Reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
              <button
                type="submit"
                disabled={
                  status !== "Delivered" ||
                  processing ||
                  order?.payment?.refunds?.length > 0
                }
              >
                {processing ? "Processing..." : "Process Refund"}
              </button>
            </form>
          </section>
        )}

        {order?.payment?.refunds?.length > 0 && (
          <section className="refund-history">
            <h2>Refund History</h2>
            <ul>
              {order.payment.refunds.map((refund) => (
                <li key={refund.refundId}>
                  <p>
                    <strong>Refund ID:</strong> {refund.refundId}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${refund.amount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Reason:</strong> {refund.reason}
                  </p>
                  <p>
                    <strong>Refunded On:</strong>{" "}
                    {new Date(refund.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <section className="reviews">
        <h2>Customer Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review">
              <p>
                <strong>{review.user.name}:</strong> {review.comment}
              </p>
              <p>Rating: {review.rating}/5</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </section>
    </section>
  );
};

export default ShopOrderDetails;
