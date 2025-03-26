import { useEffect, useState } from "react";
import "./SingleOrderStatusUpdate.scss";
import {
  LucideCheckSquare,
  LucideMessageCircle,
  LucideTruck,
  LucidePackage,
} from "lucide-react";

const SingleOrderStatusUpdate = ({
  updateOrderStatus,
  status,
  setStatus,
  tracking,
  setTracking,
  handleChange,
  generateTrackingNumber,
  getEstimatedDeliveryDate,
  cancellationReason,
  setCancellationReason,
  returnReason,
  setReturnReason,
  order,
  processStatus,
}) => {
  const [showTrackingInfo, setShowTrackingInfo] = useState(false);
  const [showCancellationReason, setShowCancellationReason] = useState(false);
  const [showReturnReason, setShowReturnReason] = useState(false);

  // Toggle fields based on status selection
  useEffect(() => {
    setShowTrackingInfo(status === "Processing");
    setShowCancellationReason(status === "Cancelled");
    setShowReturnReason(status === "Returned");
  }, [status]);

  // Close all fields after updating status
  const handleOpenAndClose = () => {
    setShowTrackingInfo(false);
    setShowCancellationReason(false);
    setShowReturnReason(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    updateOrderStatus(e);
    handleOpenAndClose(); // Close fields after updating
  };
  return (
    <section className="order-update-processing-wrapper">
      <h2 className="order-status-update-title">Update Order Status</h2>
      <form onSubmit={handleSubmit} className="order-status-update-form">
        {/* Order Status Dropdown */}
        <div className="input-container">
          <LucideCheckSquare className="input-icon" />
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select-field"
          >
            {[
              "Pending",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled",
              "Refund Requested",
              "Returned",
              "Refunded",
            ].map((selectStatus) => (
              <option key={selectStatus} value={selectStatus}>
                {selectStatus}
              </option>
            ))}
          </select>
        </div>

        {/* Tracking Information (only for "Processing" status) */}
        {showTrackingInfo  && (
          <div className="tracking-information-wrapper">
            <div className="input-container">
              <LucideTruck className="input-icon" />
              <select
                name="carrier"
                value={tracking.carrier}
                onChange={handleChange}
                className="select-field"
              >
                <option value="">Select Carrier</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="USPS">USPS</option>
                <option value="DHL">DHL</option>
              </select>
            </div>

            <div className="input-container tracking-number-container">
              <LucidePackage className="input-icon" />
              <input
                type="text"
                name="trackingNumber"
                placeholder="Tracking Number"
                value={tracking.trackingNumber}
                onChange={handleChange}
                readOnly
                className="select-field select-tracking-field"
                disabled={tracking.carrier === ""}
              />
              <button
                type="button"
                onClick={() =>
                  setTracking((prev) => ({
                    ...prev,
                    trackingNumber: generateTrackingNumber(),
                  }))
                }
                className="generate-tracking-btn"
              >
                Generate Tracking Number
              </button>
            </div>

            <div className="input-container">
              <LucideCheckSquare className="input-icon" />
              <input
                type="date"
                name="estimatedDeliveryDate"
                value={
                  tracking.estimatedDeliveryDate || getEstimatedDeliveryDate()
                }
                className="select-field"
                readOnly
              />
            </div>
          </div>
        )}

        {/* Cancellation Reason Input */}
        {showCancellationReason  && (
          <div className="textarea-container">
            <LucideMessageCircle className="input-icon" />
            <textarea
              name="cancellationReason"
              rows={4}
              cols={30}
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Enter cancellation reason"
              className="textarea-field"
            />
          </div>
        )}

        {/* Return Reason Input */}
        {showReturnReason && (
          <div className="textarea-container">
            <LucideMessageCircle className="input-icon" />
            <textarea
              name="returnReason"
              rows={4}
              cols={30}
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder="Enter return reason"
              className="textarea-field"
            />
          </div>
        )}

        <button
          type="submit"
          className="update-status-btn"
          disabled={order?.orderStatus === "Refunded"}
        >
          {processStatus ? "Updating..." : "Update Status"}
        </button>
      </form>
    </section>
  );
};

export default SingleOrderStatusUpdate;
