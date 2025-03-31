import "./UserSingleOrderRefundRequest.scss";
import { BadgeDollarSign } from "lucide-react";

const UserSingleOrderRefundRequest = ({ order }) => {
  console.log("Single item order =", order);
  return (
    <section className="user-order-refund-request-container">
      <h2 className="user-order-refund-request-title">
        <BadgeDollarSign size={22} /> Refund Request
      </h2>
      {order?.refundRequestInfo.map((refund) => (
        <article
          key={refund.refundRequestId}
          className="user-order-refund-request-info-wrapper"
        >
          <div className="user-order-refund-request-infos">
            <aside className="user-order-refund-request-info-left">
              <p className="refund-request-info-title">
                <strong>Refund Request On:</strong>{" "}
                <span className="request-on-for">
                  {" "}
                  {refund.requestedDate.slice(0, 10)}
                </span>
              </p>
              <p className="refund-request-info">
                <strong>Product ID:</strong> {refund?.product._id}
              </p>
              <p className="refund-request-info">
                <strong>Refund ID:</strong> {refund.refundRequestId}
              </p>

              <p className="refund-request-info">
                <strong>Product Color:</strong> {refund.requestedItemColor}
              </p>
            </aside>

            <aside className="user-order-refund-request-info-right">
              <p className="refund-request-info">
                {" "}
                <strong>Product Size:</strong> {refund.requestedItemSize}
              </p>

              <p className="refund-request-info">
                {" "}
                <strong>Product Quantity:</strong>{" "}
                {refund.requestedItemQuantity}
              </p>

              <p className="refund-request-info">
                {" "}
                <strong>Refund Reason:</strong> {refund.requestRefundReason}
              </p>

              <h3 className="refund-request-info-title">
                {" "}
                <strong> Requested Refund Amount:</strong>
                <span className="request-on-for">
                  {" "}
                  ${refund.requestedRefundAmount.toFixed(2)}
                </span>
              </h3>
            </aside>
          </div>

          {refund.otherReason.length > 0 && (
            <>
              <h3 className="user-order-refund-request-info-title">
                {" "}
                Refund Request Reason
              </h3>
              <p className="user-order-refund-request-reason-paragraph">
                {refund.requestRefundReason}
              </p>
            </>
          )}
        </article>
      ))}
    </section>
  );
};

export default UserSingleOrderRefundRequest;
