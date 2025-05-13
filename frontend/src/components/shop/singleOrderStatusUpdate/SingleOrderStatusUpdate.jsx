import { useEffect, useState } from "react";
import "./SingleOrderStatusUpdate.scss";
import {
  LucideCheckSquare,
  LucideMessageCircle,
  LucideTruck,
  LucidePackage,
} from "lucide-react";
import TransactionForm from "../../forms/transaction/TransactionForm";
import ShipmentForm from "../../forms/deliveryAddress/ShipmentForm";
import UpdateOrderCancellation from "../../forms/updateOrderCancellation/UpdateOrderCancellation";

const providers = [
  "UPS",
  "FEDEX",
  "DHL",
  "USPS",
  "ROYAL_MAIL",
  "DPD",
  "GLS",
  "TNT",
  "ARAMEX",
  "CANADA_POST",
  "AUSTRALIA_POST",
  "JAPAN_POST",
  "SF_EXPRESS",
  "YAMATO",
  "POSTNL",
  "CORREIOS",
  "CHINA_POST",
  "LA_POSTE",
  "DEUTSCHE_POST",
  "EMS",
  "BLUE_DART",
  "J&T_EXPRESS",
  "NINJA_VAN",
  "LALAMOVE",
  "GRABEXPRESS",
  "GOJEK",
  "ZTO",
  "XPRESSBEES",
  "DELHIVERY",
  "SHIPROCKET",
  "CAINIAO",
];

const SingleOrderStatusUpdate = ({
  updateOrderStatus,
  status,
  setStatus,
  tracking,
  setTracking,
  handleChange,
  generateProcessingCode,
  getEstimatedDeliveryDate,
  returnReason,
  setReturnReason,
  order,
  processStatus,
}) => {
  const [showTrackingInfo, setShowTrackingInfo] = useState(false);
  const [showCancellationReason, setShowCancellationReason] = useState(false);
  const [showReturnReason, setShowReturnReason] = useState(false);
  const [openTransaction, setOpenTransaction] = useState(false);
  const [openShippedStatus, setOpenShippedStatus] = useState(false);
  const [statusManuallyChanged, setStatusManuallyChanged] = useState(false);

  const refundStatuses = [
    "Refund Requested",
    "Awaiting Item Return",
    "Refund Processing",
    "Returned",
    "Refund Rejected",
    "Refund Accepted",
    "Refunded",
  ];

const currentOrderStatus = refundStatuses.includes(order?.orderStatus)
  ? order.orderStatus
  : null;


  const orderStatusArray = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    ...(currentOrderStatus ? [currentOrderStatus] : []),
  ];

  const statusHandler = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setStatusManuallyChanged(true);

    if (newStatus === "Delivered") {
      setOpenTransaction(true);
    } else {
      setOpenTransaction(false);
    }

    if (newStatus === "Shipped") {
      setOpenShippedStatus(true);
    } else {
      setOpenShippedStatus(false);
    }

    if (newStatus === "Cancelled") {
      setShowCancellationReason(true);
    } else {
      setShowCancellationReason(false);
    }
  };

  // Toggle fields based on status selection
  useEffect(() => {
    setShowTrackingInfo(status === "Processing");
    setShowCancellationReason(status === "Cancelled" && statusManuallyChanged);
    setShowReturnReason(status === "Returned");
  }, [status, statusManuallyChanged]);

  // Close all fields after updating status
  const handleOpenAndClose = () => {
    setShowTrackingInfo(false);
    setShowCancellationReason(false);
    setShowReturnReason(false);
  };

  // Handle form submission
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
            onChange={statusHandler}
            className="select-field"
          >
            {orderStatusArray.map((selectStatus) => (
              <option key={selectStatus} value={selectStatus}>
                {selectStatus}
              </option>
            ))}
          </select>
        </div>

        {/* Tracking Information (only for "Processing" status) */}
        {showTrackingInfo && (
          <div className="tracking-information-wrapper">
            <div className="input-container">
              <LucideTruck className="input-icon" />
              <select
                name="carrier"
                value={tracking.carrier}
                onChange={handleChange}
                className="select-field"
              >
                <option value="" disabled>
                  Select Carrier
                </option>
                {providers.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-container tracking-number-container">
              <LucidePackage className="input-icon" />
              <input
                type="text"
                name="processingCode"
                placeholder="Processing Code"
                value={tracking.processingCode}
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
                    processingCode: generateProcessingCode(),
                  }))
                }
                className="generate-tracking-btn"
              >
                Processing Code
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

      {showCancellationReason && (
        <UpdateOrderCancellation
          setShowCancellationReason={setShowCancellationReason}
          order={order}
        />
      )}

      {openShippedStatus && (
        <ShipmentForm
          setOpenShippedStatus={setOpenShippedStatus}
          order={order}
        />
      )}

      {openTransaction && status === "Delivered" && (
        <TransactionForm
          setOpenTransaction={setOpenTransaction}
          order={order}
        />
      )}
    </section>
  );
};

export default SingleOrderStatusUpdate;
