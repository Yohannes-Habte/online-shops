import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ShopOrderDetails.scss";
import { API } from "../../../utils/security/secreteKey";
import SingleOrderSummary from "../singleOrderSummary/SingleOrderSummary";
import SingleOrderItems from "../singleOrderItems/SingleOrderItems";
import SingleOrderStatusUpdate from "../singleOrderStatusUpdate/SingleOrderStatusUpdate";
import SingleOrderRefundForm from "../singleOrderRefundForm/SingleOrderRefundForm";
import SingleOrderRefundRequest from "../singleOrderRefundRequest/SingleOrderRefundRequest";
import SingleOrderRefunded from "../singleOrderRefunded/SingleOrderRefunded";

const ShopOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [processStatus, setProcessStatus] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [tracking, setTracking] = useState({
    carrier: "",
    trackingNumber: "",
    estimatedDeliveryDate: null,
  });
  const [selectedRefundRequestId, setSelectedRefundRequestId] = useState(null);

  // Allowed order status sequence
  const orderStatusSequence = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Refund Requested",
    "Awaiting Item Return",
    "Returned",
    "Refund Processing",
    "Refund Accepted",
    "Refunded",
  ];

  // =============================================================================
  // The estimated delivery date should be three working days excluding weekends
  // =============================================================================
  const getEstimatedDeliveryDate = () => {
    let deliveryDate = new Date();
    let addedDays = 0;

    // If today is Saturday (6) or Sunday (0), move to the next day until a Monday–Friday is reached.
    while (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    // Count three working days (excluding weekends)
    while (addedDays < 3) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
        addedDays++;
      }
    }

    return deliveryDate.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  // =========================================================================
  // Check if the order status update is valid
  // =========================================================================
  const isValidOrderStatusUpdate = (currentStatus, newStatus) => {
    if (newStatus === "Cancelled") return true; // Allow cancellation anytime
    const currentIndex = orderStatusSequence.indexOf(currentStatus);
    const newIndex = orderStatusSequence.indexOf(newStatus);
    return newIndex === currentIndex + 1; // Only allow moving forward
  };

  // =========================================================================
  // Fetch order details
  // =========================================================================
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/orders/${id}`, {
          withCredentials: true,
        });

        setOrder(data?.order);
        setStatus(data?.order?.orderStatus || "");
        setTracking({
          carrier: data?.order?.tracking?.carrier || "",
          trackingNumber: data?.order?.tracking?.trackingNumber || "",
          estimatedDeliveryDate: data?.order?.tracking?.estimatedDeliveryDate
            ? new Date(data?.order?.tracking?.estimatedDeliveryDate)
            : null,
        });
      } catch (error) {
        setError(
          error?.response?.data?.message || "Failed to fetch order details"
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

  // =========================================================================
  // Generate tracking number only when necessary
  // =========================================================================
  const generateTrackingNumber = () => {
    return `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
  };

  // =========================================================================
  // Update order status
  // =========================================================================
  const updateOrderStatus = async (e) => {
    e.preventDefault();
    if (!status) return toast.error("Please select an order status.");

    const currentIndex = orderStatusSequence.indexOf(order?.orderStatus);
    const newIndex = orderStatusSequence.indexOf(status);

    if (!isValidOrderStatusUpdate(order?.orderStatus, status)) {
      if (newIndex < currentIndex) {
        return toast.error(
          `You cannot go backward. The next valid status after "${
            order?.orderStatus
          }" is "${orderStatusSequence[currentIndex + 1]}".`
        );
      }
      return toast.error(
        `Invalid status transition. The next valid status after "${
          order?.orderStatus
        }" is "${orderStatusSequence[currentIndex + 1]}".`
      );
    }

    const updateData = { orderStatus: status, tracking: tracking };

    if (status === "Cancelled")
      updateData.cancellationReason = cancellationReason;
    if (status === "Returned") updateData.returnReason = returnReason;

    if (status === "Processing") {
      updateData.tracking = {
        carrier: tracking.carrier,
        trackingNumber: tracking.trackingNumber || generateTrackingNumber(),
        estimatedDeliveryDate: getEstimatedDeliveryDate(),
      };
    }

    setProcessStatus(true);
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
      setProcessStatus(false);
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="shop-order-details-information-container">
      <header className="shop-order-details-header-wrapper">
        <h1 className="shop-order-details-header-title">Order Details</h1>
        <p className="shop-order-details-header-date">
          Order ID: #{order?._id}
        </p>
        <p className="shop-order-details-header-date">
          Placed on:{" "}
          {new Date(order?.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </header>

      <SingleOrderItems order={order} />

      <SingleOrderSummary order={order} />

      <SingleOrderStatusUpdate
        updateOrderStatus={updateOrderStatus}
        status={status}
        setStatus={setStatus}
        tracking={tracking}
        setTracking={setTracking}
        handleChange={handleChange}
        generateTrackingNumber={generateTrackingNumber}
        getEstimatedDeliveryDate={getEstimatedDeliveryDate}
        cancellationReason={cancellationReason}
        setCancellationReason={setCancellationReason}
        returnReason={returnReason}
        setReturnReason={setReturnReason}
        order={order}
        processStatus={processStatus}
      />

      {order?.orderStatus === "Cancelled" && order?.cancellationReason && (
        <section className="order-cancellation-reason-wrapper">
          <h2 className="order-cancellation-reason-title">
            Order Cancellation Reason
          </h2>
          <p className="order-cancellation-reason-message">
            {order.cancellationReason}
          </p>
        </section>
      )}

      {order?.orderStatus === "Returned" && order?.returnReason && (
        <section className="order-return-reason-wrapper">
          <h2 className="order-return-reason-title">Order Return Reason</h2>
          <p className="order-return-reason-message">{order.returnReason}</p>
        </section>
      )}

      <SingleOrderRefundRequest
        order={order}
        setSelectedRefundRequestId={setSelectedRefundRequestId}
      />

      <SingleOrderRefundForm
        order={order}
        status={status}
        selectedRefundRequestId={selectedRefundRequestId}
      />

      <SingleOrderRefunded order={order} />
    </section>
  );
};

export default ShopOrderDetails;
