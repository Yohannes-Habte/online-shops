import "./SingleOrderRefund.scss";
import { BadgeDollarSign, FileText, History, } from "lucide-react";

const SingleOrderRefund = ({
  order,
  handleRefund,
  refundAmount,
  setRefundAmount,
  refundReason,
  setRefundReason,
  processing,
  status,
}) => {
  // Corrected logic for disabling the refund button
  const isRefundDisabled =
    !order ||
    !order.payment ||
    !order.payment.paymentStatus ||
    order.payment.paymentStatus !== "completed" ||
    ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(
      order.orderStatus
    ) ||
    status !== "Returned" ||
    processing ||
    (order.payment.refunds && order.payment.refunds.length > 0);

  return (
    <div className="refund-order-processing-container">
      {order?.payment?.paymentStatus === "completed" && (
        <section className="order-refund-form-wrapper">
          <h2 className="order-refund-form-title">Refund Order</h2>
          <form onSubmit={handleRefund} className="order-refund-form">
            <div className="input-container">
              <BadgeDollarSign className="input-icon" size={20} />
              <input
                type="number"
                placeholder="Refund Amount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="textarea-input-container">
              <FileText className="input-icon" size={20} />
              <textarea
                name="refundReason"
                id="refundReason"
                rows={4}
                cols={30}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Refund Reason"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={isRefundDisabled}
              className="order-refund-btn"
            >
              {processing ? "Processing..." : "Process Refund"}
            </button>
          </form>
        </section>
      )}

      {order?.payment?.refunds?.length > 0 && (
        <section className="order-refund-history-wrapper">
          <h2 className="order-refund-history-title">
            <History size={22} /> Refund History
          </h2>
          <ul className="order-refund-history-list">
            {order.payment.refunds.map((refund) => (
              <li key={refund.refundId} className="order-refund-history-item">
                <p className="refund-info">
                  <strong>Refund ID:</strong> {refund.refundId}
                </p>
                <p className="refund-info">
                  <strong>Amount:</strong> ${refund.amount.toFixed(2)}
                </p>
                <p className="refund-info">
                  <strong>Reason:</strong> {refund.reason}
                </p>
                <p className="refund-info">
                  <strong>Refunded On:</strong>{" "}
                  {new Date(refund.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default SingleOrderRefund;
