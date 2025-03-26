import "./UserSingleOrderRefundInfo.scss";
import { History } from "lucide-react";

const UserSingleOrderRefundInfo = ({ order }) => {
  return (
    <section className="user-order-refunded-history-wrapper">
      <h2 className="user-order-refunded-history-title">
        <History size={22} /> Refund Information
      </h2>
      {order.payment.refunds.map((refund) => (
        <article
          key={refund.refundId}
          className="user-order-refunded-info-wrapper"
        >
          <p className="user-refund-info">
            <strong>Refund ID:</strong> {refund.refundId}
          </p>
          <p className="user-refund-info">
            <strong>Amount:</strong> ${refund.amount.toFixed(2)}
          </p>
          <h3 className="user-refund-reason-title"> Refund Reason </h3>
          <p className="user-refund-info shop-refund-reason-paragraph">
            {refund.reason}
          </p>
          <p className="user-refund-info">
            <strong>Refunded On:</strong>{" "}
            {new Date(refund.createdAt).toLocaleDateString()}
          </p>
        </article>
      ))}
    </section>
  );
};

export default UserSingleOrderRefundInfo;
