import { useState } from "react";
import "./UserSingleOrderSummary.scss";
import OrderCancellation from "../../forms/orderCancellation/OrderCancellation";

const UserSingleOrderSummary = ({ orderInfos, currentUser }) => {
  const [showCancellationReason, setShowCancellationReason] = useState(false);
  return (
    <div className="order-summary">
      <div className="summary-details">
        <h2>Order Summary</h2>
        <p>
          Subtotal: <strong>${orderInfos?.subtotal.toFixed(2)}</strong>
        </p>
        <p>
          Shipping Fee: <strong>${orderInfos?.shippingFee.toFixed(2)}</strong>
        </p>
        <p>
          Tax: <strong>${orderInfos?.tax.toFixed(2)}</strong>
        </p>
        <p>
          Service Fee: <strong>${orderInfos?.serviceFee.toFixed(2)}</strong>
        </p>
        <h3>
          Grand Total: <strong>${orderInfos?.grandTotal.toFixed(2)}</strong>
        </h3>

        <button
          onClick={() => setShowCancellationReason(true)}
          className="user-cancel-order-btn"
        >
          Cancel Order
        </button>

        {showCancellationReason && (
          <OrderCancellation
            setShowCancellationReason={setShowCancellationReason}
            order={orderInfos}
          />
        )}
      </div>

      {/* Shipping Address */}
      <div className="shipping-address">
        <h2>Shipping Address</h2>
        <p>
          <strong>Name:</strong> {currentUser?.name}
        </p>
        <p>
          <strong>Address:</strong> {orderInfos?.shippingAddress?.address}
        </p>
        <p>
          <strong>City:</strong> {orderInfos?.shippingAddress?.city}
        </p>
        <p>
          <strong>State:</strong> {orderInfos?.shippingAddress?.state}
        </p>
        <p>
          <strong>Zip Code:</strong> {orderInfos?.shippingAddress?.zipCode}
        </p>
        <p>
          <strong>Country:</strong> {orderInfos?.shippingAddress?.country}
        </p>
        <p>
          <strong>Phone:</strong> {orderInfos?.shippingAddress?.phoneNumber}
        </p>
      </div>
    </div>
  );
};

export default UserSingleOrderSummary;
