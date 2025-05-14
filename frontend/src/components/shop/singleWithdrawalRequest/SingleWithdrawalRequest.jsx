import "./SingleWithdrawalRequest.scss";

const SingleWithdrawalRequest = ({ order }) => {
  console.log("order for withdrawalRequests", order);

  if (!order) return <p>No withdrawal request data available.</p>;

  return (
    <section className="shop-withdrawal-request-container">
      <h3 className="shop-withdrawal-request-title">
        Withdrawal Request Information
      </h3>
      {order.withdrawalRequests.map((withdraw) => {
        return (
          <article className="withdrawal-info-wrapper" key={withdraw._id}>
            <h4 className="withdrawal-info">
              <strong className="withdrawal-strong">Withdrawal Purpose:</strong>{" "}
              {withdraw.withdrawalPurpose}
            </h4>

            <div className="withdrawal-info-asides-wrapper">
              <aside className="withdrawal-info-left-block">
                <h5 className="withdrawal-info">
                  <strong className="withdrawal-strong">Amount:</strong> $
                  {withdraw.amount}
                </h5>

                <p className="withdrawal-info">
                  <strong className="withdrawal-strong">Currency:</strong>{" "}
                  {withdraw.currency}
                </p>

                <p className="withdrawal-info">
                  <strong className="withdrawal-strong">Method:</strong>{" "}
                  {withdraw.method}
                </p>

                <p className="withdrawal-info">
                  <strong className="withdrawal-strong">Processed Date:</strong>{" "}
                  {withdraw.processedDate.slice(0, 10)}
                </p>
              </aside>

              <aside className="withdrawal-info-right-block">
                <h5 className="withdrawal-info">
                  <strong className="withdrawal-strong">Processed By:</strong>{" "}
                  {withdraw.processedBy}
                </h5>

                <p className="withdrawal-info">
                  <strong className="withdrawal-strong">
                    Refund Request ID:
                  </strong>{" "}
                  {withdraw.refundRequest}
                </p>

                <p className="withdrawal-info">
                  <strong className="withdrawal-strong">
                    Return Request ID:
                  </strong>{" "}
                  {withdraw.returnRequest}
                </p>
              </aside>
            </div>

            <p className="withdrawal-info">
              <strong className="withdrawal-strong">Withdrawal Code:</strong>{" "}
              {withdraw.withdrawalCode}
            </p>

            <p className="withdrawal-notes">{withdraw.notes}</p>
          </article>
        );
      })}
    </section>
  );
};

export default SingleWithdrawalRequest;
