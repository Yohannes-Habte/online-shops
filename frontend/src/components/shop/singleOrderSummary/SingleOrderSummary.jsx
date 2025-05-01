import { useState } from "react";
import TransactionForm from "../../forms/transaction/TransactionForm";
import "./SingleOrderSummary.scss";

const SingleOrderSummary = ({ order }) => {
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
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
        <button
          className="transact-now-btn"
          onClick={() => setIsTransactionFormOpen(true)}
        >
          Transact Now
        </button>
        {isTransactionFormOpen && (
          <TransactionForm
            order={order}
            setIsTransactionFormOpen={setIsTransactionFormOpen}
          />
        )}
      </section>

      <section className="shipping-address-wrapper">
        <h2 className="shipping-address-title">Shipping Address</h2>
        <p className="shipping-address-info">
          {order?.shippingAddress?.address}
        </p>
        <p className="shipping-address-info">
          {order?.shippingAddress?.zipCode}, {order?.shippingAddress?.city}
        </p>
        <p className="shipping-address-info">{order?.shippingAddress?.state}</p>
        <p className="shipping-address-info">
          {order?.shippingAddress?.country}
        </p>
        <p className="shipping-address-info">
          Phone: {order?.shippingAddress?.phoneNumber}
        </p>
      </section>
    </div>
  );
};

export default SingleOrderSummary;
