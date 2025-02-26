import "./UserSingleOrderRefundInfo.scss";

const UserSingleOrderRefundInfo = ({ orderInfos }) => {
  return (
    <>
      {orderInfos?.payment?.refunds?.length > 0 && (
        <section className="user-refund-details-wrapper">
          <h2>Refund Details</h2>
          {orderInfos.payment.refunds.map((refund, index) => (
            <div key={index} className="refund-item">
              <p>
                <strong>Refund ID:</strong> {refund.refundId}
              </p>
              <p>
                <strong>Amount:</strong> ${refund.amount.toFixed(2)}
              </p>
              <p>
                <strong>Reason:</strong> {refund.reason || "No reason provided"}
              </p>
              <p>
                <strong>Refund Date:</strong>{" "}
                {new Date(refund.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </section>
      )}
    </>
  );
};

export default UserSingleOrderRefundInfo;
