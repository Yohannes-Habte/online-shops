import "./SingleOrderCancelled.scss";

const SingleOrderCancelled = ({ order }) => {
  console.log("Cancelled Order: ", order);

  const { cancelledOrder } = order;
  return (
    <section className="single-order-cancelled-container">
      <h3 className="single-order-cancelled-title">Cancelled Order Summary</h3>
      <div className="order-details">
        <p className="cancelled-order-info">
          <strong className="cancelled-order-strong">Order ID:</strong>{" "}
          {order._id}
        </p>

        <p className="cancelled-order-info">
          <strong className="cancelled-order-strong">Cancellation Code:</strong>{" "}
          {cancelledOrder.cancellationCode}
        </p>

        <p className="cancelled-order-info">
          <strong className="cancelled-order-strong">Status:</strong>{" "}
          {cancelledOrder.cancellationStatus}
        </p>

        <p className="cancelled-order-info">
          <strong className="cancelled-order-strong">Reason:</strong>{" "}
          {cancelledOrder.reason || "N/A"}
        </p>

        {cancelledOrder.otherReason && (
          <p className="cancelled-order-info">
            <strong className="cancelled-order-strong">Other Reason:</strong>{" "}
            {cancelledOrder.otherReason}
          </p>
        )}

        <p className="cancelled-order-info">
          <strong className="cancelled-order-strong">Requested By:</strong>{" "}
          {cancelledOrder.requestedBy}
        </p>

        <p className="cancelled-order-info">
          <strong className="cancelled-order-strong">Reviewed By:</strong>{" "}
          {cancelledOrder.reviewer}
        </p>

        <p className="cancelled-order-info">
          <strong className="cancelled-order-strong">Reviewed Date:</strong>{" "}
          {new Date(cancelledOrder.reviewedDate).toLocaleDateString()}
        </p>

        <p className="cancelled-order-info">
          <strong className="cancelled-order-strong">Created At:</strong>{" "}
          {new Date(cancelledOrder.createdAt).toLocaleString()}
        </p>

        <p className="cancelled-order-info">
          <strong className="cancelled-order-strong">Last Updated:</strong>{" "}
          {new Date(cancelledOrder.updatedAt).toLocaleString()}
        </p>
      </div>
      <div className="cancelled-order-reviewer-notes-wrapper">
        <h4 className="reviewer-message-title">Reviewer Notes</h4>
        <p className="cancelled-order-info">{cancelledOrder.reviewerNotes}</p>
      </div>
    </section>
  );
};

export default SingleOrderCancelled;
