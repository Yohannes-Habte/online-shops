import "./SingleOrderRefunded.scss";
import { History } from "lucide-react";

const SingleOrderRefunded = ({ order, setRefundTransactionId }) => {
  console.log("order:", order);

  const handleRefundTransactionId = (refundTransactionId) => {
    setRefundTransactionId(refundTransactionId);
  };

  return (
    <section className="shop-order-refunded-history-container">
      <h2 className="shop-order-refunded-history-title">
        <History size={22} /> Refund History
      </h2>
      {order?.returnedItems.map((refund) => (
        <article
          key={refund.refundId}
          className="shop-order-refunded-info-wrapper"
        >
          <div className="shop-order-refunded-info">
            <aside>
              <p>
                <strong>Refund Request Id:</strong>{" "}
                {refund.refundRequestIdLinked}
              </p>
              <p onClick={() => handleRefundTransactionId(refund.returnedId)}>
                <strong>Refund ID:</strong> {refund.returnedId}
              </p>
              <p>
                <strong>Refund Processed Date:</strong>{" "}
                {refund.processedDate.slice(0, 10)}
              </p>
              <p>
                <strong>Refund Status:</strong> {refund.refundStatus}
              </p>
            </aside>

            <aside>
              <p>
                <strong>Product Returned Date:</strong>{" "}
                {refund.returnedDate.slice(0, 10)}
              </p>

              <p>
                {" "}
                <strong>Product Condition:</strong> {refund.condition}
              </p>

              <p>
                {" "}
                <strong>Refund Amount:</strong> {refund.refundAmount.toFixed(2)}
              </p>
              <h3>
                {" "}
                <strong> Refund Processed By:</strong> ${refund?.processedBy}
              </h3>
            </aside>
          </div>

          <h3 className="shop-order-refunded-info-title"> Refunding Reason</h3>
          <p className="shop-order-refunded-reason-paragraph">
            {refund.comments}
          </p>
        </article>
      ))}
    </section>
  );
};

export default SingleOrderRefunded;
