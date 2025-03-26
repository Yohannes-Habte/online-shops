import "./SingleOrderRefundRequest.scss";
import { BadgeDollarSign } from "lucide-react";

const SingleOrderRefundRequest = ({ order }) => {

  return (
    <section className="shop-order-refund-request-wrapper">
      <h2 className="shop-order-refund-request-title">
        <BadgeDollarSign size={22} /> Refund Request
      </h2>
      {order?.refundRequestInfo.map((refund) => (
        <article
          key={refund.refundId}
          className="shop-order-refund-request-info-wrapper"
        >
          <div className="shop-order-refund-request-info">
            <aside>
              <p>
                <strong>Product Name:</strong> {refund.title}
              </p>
              <p>
                <strong>Refund ID:</strong> {refund.refundId}
              </p>
              <p>
                <strong>Refund Request On:</strong>{" "}
                {new Date(refund.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Product Color:</strong> {refund.color}
              </p>
            </aside>

            <aside>
              <p>
                {" "}
                <strong>Product Size:</strong> {refund.size}
              </p>
              <p>
                <strong>Product Price:</strong> {refund.price}
              </p>

              <p>
                {" "}
                <strong>Product Quantity:</strong> {refund.quantity}
              </p>
              <h3>
                {" "}
                <strong> Subtotal Price:</strong> ${refund.amount.toFixed(2)}
              </h3>
            </aside>
          </div>

          <h3 className="shop-order-refund-request-info-title">
            {" "}
            Refund Request Reason for {refund.title}{" "}
          </h3>
          <p className="shop-order-refund-request-reason-paragraph">
            {refund.reason}
          </p>
        </article>
      ))}
    </section>
  );
};

export default SingleOrderRefundRequest;
