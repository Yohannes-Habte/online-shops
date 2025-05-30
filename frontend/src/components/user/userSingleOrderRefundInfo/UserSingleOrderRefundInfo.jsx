import "./UserSingleOrderRefundInfo.scss";
import { History } from "lucide-react";

const UserSingleOrderRefundInfo = ({ order }) => {
  return (
    <section className="shop-order-refunded-history-container">
      <h2 className="shop-order-refunded-history-title">
        <History size={22} /> Refund Information
      </h2>
      {order?.returnedItems.map((refund) => (
        <article
          key={refund.refundId}
          className="shop-order-refunded-info-wrapper"
        >
          <div className="shop-order-refunded-info">
            <aside>
              <p>
                <strong>Refund Request Id:</strong> {refund.itemRefundRequestId?._id}
              </p>
              <p>
                <strong>Refund ID:</strong> {refund.returnedId}
              </p>
              <p>
                <strong>Refund Processed Date:</strong>{" "}
                {refund.processedDate.slice(0, 10)}
              </p>
              <p>
                <strong>Refund Status:</strong> {refund.Refund}
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

export default UserSingleOrderRefundInfo;
