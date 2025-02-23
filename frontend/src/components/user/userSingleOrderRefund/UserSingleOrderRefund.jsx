import { FileText } from "lucide-react";
import "./UserSingleOrderRefund.scss";

const UserSingleOrderRefund = ({
  refundHandler,
  refundReason,
  setRefundReason,
}) => {
  return (
    <section className="user-refund-request-container">
      <h2 className="user-refund-request-title">Request Refund</h2>
      <form
        action=""
        onSubmit={refundHandler}
        className="user-refund-request-form"
      >
        <div className="textarea-container">
          <FileText className="input-icon" size={20} />
          <textarea
            name="refundReason"
            id="refundReason"
            rows={5}
            cols={30}
            placeholder="Enter refund reason..."
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            className="textarea-field"
          />
        </div>
        <button className="refund-request-btn">Submit Refund Request</button>
      </form>
    </section>
  );
};

export default UserSingleOrderRefund;
