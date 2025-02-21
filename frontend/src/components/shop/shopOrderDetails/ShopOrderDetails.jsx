import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ShopOrderDetails.scss";
import { API } from "../../../utils/security/secreteKey";
import SingleOrderSummary from "../singleOrderSummary/SingleOrderSummary";
import SingleOrderItems from "../singleOrderItems/SingleOrderItems";
import SingleOrderStatusUpdate from "../singleOrderStatusUpdate/SingleOrderStatusUpdate";
import SingleOrderRefund from "../singleOrderRefund/SingleOrderRefund";

const ShopOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [tracking, setTracking] = useState({
    carrier: "",
    trackingNumber: "",
    estimatedDeliveryDate: null,
  });

  // Allowed order status sequence
  const orderStatusSequence = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Returned",
    "Refunded",
  ];

  const isValidOrderStatusUpdate = (currentStatus, newStatus) => {
    if (newStatus === "Cancelled") return true; // Allow cancellation anytime
    const currentIndex = orderStatusSequence.indexOf(currentStatus);
    const newIndex = orderStatusSequence.indexOf(newStatus);
    return newIndex === currentIndex + 1; // Only allow moving forward
  };

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/orders/${id}/shop/order`, {
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

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="shop-order-details-container">
      <header className="order-details-header-wrapper">
        <h1 className="order-details-header-title">Order Details</h1>
        <p>Order ID: #{order?._id?.slice(0, 8)}</p>
        <p>Placed on: {order?.createdAt?.slice(0, 10)}</p>
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
        cancellationReason={cancellationReason}
        setCancellationReason={setCancellationReason}
        returnReason={returnReason}
        setReturnReason={setReturnReason}
        order={order}
        processing={processing}
      />

      {order?.orderStatus === "Cancelled" && order?.cancellationReason && (
        <section>
          <h2>Order Cancellation Reason</h2>
          <p>{order.cancellationReason}</p>
        </section>
      )}

      {order?.orderStatus === "Returned" && order?.returnReason && (
        <section>
          <h2>Order Return Reason</h2>
          <p>{order.returnReason}</p>
        </section>
      )}

      <SingleOrderRefund
        order={order}
        handleRefund={() => {}}
        refundAmount={refundAmount}
        setRefundAmount={setRefundAmount}
        refundReason={refundReason}
        setRefundReason={setRefundReason}
        processing={processing}
        status={status}
      />
    </section>
  );
};

export default ShopOrderDetails;
