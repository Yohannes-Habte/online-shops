import "./SingleOrderReturnInfo.scss";
import { History } from "lucide-react";

const SingleOrderReturnInfo = ({ order }) => {
  console.log("order for return item:", order);

  return (
    <section className="shop-order-return-history-container">
      <h2 className="shop-order-return-history-title">
        <History size={22} /> Return for Refund History
      </h2>

      {order?.returnedItems?.map((returnRequest) => (
        <article
          key={returnRequest._id}
          className="shop-order-returned-info-wrapper"
        >
          <div className="shop-order-returned-infos-container">
            <aside className="shop-order-refunded-info-left">
              <p className="returned-item-p">
                <strong>Return Request ID:</strong> {returnRequest?._id}
              </p>

              <p className="returned-item-p">
                <strong>Refund Request:</strong>{" "}
                {returnRequest?.refundRequest || "N/A"}
              </p>

              <p className="returned-item-p">
                <strong> Is Product Returned?:</strong>{" "}
                {returnRequest?.isProductReturned ? "Yes" : "No"}
              </p>

              <p className="returned-item-p">
                <strong>Product Returned Date:</strong>{" "}
                {returnRequest.returnedDate?.slice(0, 10)}
              </p>

              <p className="returned-item-p">
                <strong>Product Condition:</strong> {returnRequest.condition}
              </p>
            </aside>

            <aside className="shop-order-returned-info-right">
              <p className="returned-item-p">
                <strong>Refund Processed Date:</strong>{" "}
                {returnRequest.processedDate?.slice(0, 10)}
              </p>

              <p className="returned-item-p">
                <strong>Refund Status:</strong> {returnRequest.refundStatus}
              </p>

              <p className="returned-item-p">
                <strong>Refund Amount:</strong> $
                {returnRequest.refundAmount?.toFixed(2)}
              </p>

              <h3 className="returned-item-p">
                <strong>Refund Processed By:</strong>{" "}
                {returnRequest.processedBy ? "Seller" : "N/A"}
              </h3>
            </aside>
          </div>

          <h3 className="shop-order-return-reason-title">Refund Reason</h3>
          <p className="shop-order-refunded-reason-paragraph">
            {returnRequest.comments}
          </p>

          {returnRequest.refundStatus === "Rejected" &&
            returnRequest.rejectedReason && (
              <>
                <h3 className="shop-order-refund-request-rejection-reason-title">
                  Rejection Reason
                </h3>
                <p className="shop-order-return-reason-paragraph">
                  {returnRequest.rejectedReason}
                </p>
              </>
            )}
        </article>
      ))}
    </section>
  );
};

export default SingleOrderReturnInfo;
