import "./SingleOrderRefunded.scss";
import { History } from "lucide-react";

const SingleOrderRefunded = ({ order }) => {
  console.log("order:", order);

  return (
    <section className="shop-order-refunded-history-container">
      <h2 className="shop-order-refunded-history-title">
        <History size={22} /> Refund History
      </h2>
      {order.payment.refunds.map((refund) => (
        <article key={refund.refundId} className="shop-order-refunded-info-wrapper">
          <div className="shop-order-refunded-info">
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
                <strong> Subtotal Price:</strong> ${refund?.amount.toFixed(2)}
              </h3>
            </aside>
          </div>

          <h3 className="shop-order-refunded-info-title">
            {" "}
            Refunding Reason for {refund.title}{" "}
          </h3>
          <p className="shop-order-refunded-reason-paragraph">
            {refund.reason}
          </p>
        </article>
      ))}
    </section>
  );
};

export default SingleOrderRefunded;
