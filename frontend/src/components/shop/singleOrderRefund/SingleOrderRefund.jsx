import "./SingleOrderRefund.scss";
import { BadgeDollarSign, FileText, History } from "lucide-react";

const SingleOrderRefund = ({
  order,
  handleShopOrderRefund,
  refundReason,
  setRefundReason,
  processRefund,
}) => {
  // Corrected logic for disabling the refund button
  const isRefundDisabled =
    order.payment.paymentStatus !== "completed" || processRefund;

  console.log("order:", order);

  return (
    <div
      className={`${
        order?.payment?.paymentStatus === "completed" &&
        order?.orderStatus === "Refund Requested"
          ? "refund-order-processing-container"
          : "no-refund-order-processing-container"
      }`}
    >
      {order?.payment?.paymentStatus === "completed" &&
        order?.orderStatus === "Refund Requested" && (
          <section className="order-refund-form-wrapper">
            <h2 className="order-refund-form-title">Refund Order</h2>
            <form
              onSubmit={handleShopOrderRefund}
              className="order-refund-form"
            >
              <div className="input-container">
                <BadgeDollarSign className="input-icon" size={20} />
                <input
                  type="number"
                  placeholder="Refund Amount"
                  value={order?.grandTotal?.toFixed(2)}
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
                {processRefund ? "Processing..." : "Process Refund"}
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
