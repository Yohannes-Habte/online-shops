import "./SingleOrderRefundRequest.scss";
import { BadgeDollarSign } from "lucide-react";

const SingleOrderRefundRequest = ({
  order,
  setSelectedRefundRequestId,
  setProductId,
}) => {
  // When user click on refundRequestId, it should populate the order refund request id and amount in the refund form

  const handleRefundRequestId = (refundRequestId) => {
    setSelectedRefundRequestId(refundRequestId);
  };

  const handleProductId = (productId) => {
    setProductId(productId);
  };

  return (
    <section className="shop-order-refund-request-container">
      <h2 className="shop-order-refund-request-title">
        <BadgeDollarSign size={22} /> Refund Request
      </h2>
      {order?.refundRequests.map((refund) => (
        <article
          key={refund.refundRequestId}
          className="shop-order-refund-request-details-wrapper"
        >
          <div className="shop-order-refund-request-infos">
            <aside className="shop-order-refund-request-info-left">
              <p className="refund-request-info">
                <strong>Refund Request On:</strong>{" "}
                <span className="request-on-for">
                  {" "}
                  {refund.requestedDate.slice(0, 10)}
                </span>
              </p>
              <p
                className="refund-request-info"
                onClick={() => handleProductId(refund.product._id)}
              >
                <strong>Product ID:</strong> {refund?.product._id}
              </p>
              <p
                className="refund-request-info"
                onClick={() => handleRefundRequestId(refund.refundRequestId)}
              >
                <strong>Refund ID:</strong> {refund.refundRequestId}
              </p>

              <p className="refund-request-info">
                <strong>Product Color:</strong> {refund.requestedItemColor}
              </p>
            </aside>

            <aside className="shop-order-refund-request-info-right">
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

              <h3 className="refund-request-info">
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

export default SingleOrderRefundRequest;
