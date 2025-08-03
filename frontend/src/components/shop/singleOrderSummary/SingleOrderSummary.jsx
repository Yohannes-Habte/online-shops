import { useState } from "react";
import UpdateTransaction from "../../forms/updateTransaction/UpdateTransaction";
import "./SingleOrderSummary.scss";

const SingleOrderSummary = ({ order }) => {
  const [openUpdateTransaction, setOpenUpdateTransaction] = useState(false);
  return (
    <div className="order-summary-and-shipping-address-container">
      <section className="order-summary-wrapper">
        <h3 className="order-summary-title">Order Summary</h3>
        <p className="order-summary-info">
          Subtotal: ${order?.subtotal?.toFixed(2)}
        </p>
        <p className="order-summary-info">
          Shipping Fee: ${order?.shippingFee?.toFixed(2)}
        </p>
        <p className="order-summary-info">Tax: ${order?.tax?.toFixed(2)}</p>
        <p className="order-summary-info">
          Service Fee: ${order?.serviceFee?.toFixed(2)}
        </p>
        <p className="order-summary-info">
          Grand Total: ${order?.grandTotal?.toFixed(2)}
        </p>

        <p className="order-summary-info">
          Service: {order?.shippingAddress?.service}
        </p>

        <p className="order-summary-info">
          Provider:{" "}
          <strong style={{ color: "#1e40af" }}>
            {order?.tracking?.carrier || "N/A"}
          </strong>
        </p>

        <button
          className="transact-now-btn"
          onClick={() => setOpenUpdateTransaction(true)}
        >
          Update Transaction
        </button>
        {openUpdateTransaction && (
          <UpdateTransaction
            order={order}
            setOpenUpdateTransaction={setOpenUpdateTransaction}
            transactionId={order?.transaction?._id}
            currentTransactionType={order?.transaction?.transactionType}
            currentTransactionStatus={order?.transaction?.transactionStatus}
          />
        )}
      </section>

      <section className="shipping-address-wrapper">
        <h2 className="shipping-address-title">Shipping Address</h2>
        <p className="shipping-address-info">
          Street: {order?.shippingAddress?.streetName}
        </p>

        <p className="shipping-address-info">
          House Number: {order?.shippingAddress?.houseNumber}
        </p>

        <p className="shipping-address-info">
          Zip Code: {order?.shippingAddress?.zipCode}
        </p>
        <p className="shipping-address-info">
          City: {order?.shippingAddress?.city}
        </p>
        <p className="shipping-address-info">
          State: {order?.shippingAddress?.state}
        </p>
        <p className="shipping-address-info">
          Country: {order?.shippingAddress?.country}
        </p>
        <p className="shipping-address-info">
          Phone: {order?.shippingAddress?.phoneNumber}
        </p>
      </section>
    </div>
  );
};

export default SingleOrderSummary;
