import { useState } from "react";
import "./PaymentInfo.scss";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { FaAddressCard } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { paypalClientId } from "../../../utils/security/secreteKey";

const PaymentInfo = ({
  user,
  isProcessing,
  setIsProcessing,
  onApprove,
  createOrder,
  stripePaymentHandler,
  cashOnDeliveryHandler,
  handleAPIError,
}) => {
  // Local state variables
  const [select, setSelect] = useState(1);

  return (
    <div className="payment-info-wrapper">
      {/* pay with card */}
      <section className="card-payment-container">
        <article className="title-wrapper">
          <div className="selected-wrapper" onClick={() => setSelect(1)}>
            {select === 1 ? <div className="selected" /> : null}
          </div>
          <h4 className="subTitle">Pay with Debit/Credit Card</h4>
        </article>

        {select === 1 ? (
          <form className="payment-form" onSubmit={stripePaymentHandler}>
            <div className="wrapper">
              <div className="input-container">
                <label className="label">Card Owner </label>
                <input
                  required
                  placeholder={user && user.name}
                  value={user && user.name}
                  className="input-field"
                />
                <FaAddressCard className="icon" />
              </div>

              <div className="input-container">
                <label className="label">Exp Date</label>
                <CardExpiryElement className={`cart-element`} />
                <FaCreditCard className="icon" />
              </div>
            </div>

            <div className="wrapper">
              <div className="input-container">
                <label className="label">Card Number</label>
                <CardNumberElement className="cart-element" />
                <FaCreditCard className="icon" />
              </div>
              <div className="input-container">
                <label className="label">CVC</label>
                <CardCvcElement className="cart-element" />
                <FaCreditCard className="icon" />
              </div>
            </div>

            <button className="submit-payment-btn" type="submit">
              Submit
            </button>
          </form>
        ) : null}
      </section>

      {/* PayPal payment */}
      <div className="paypal-payment-container">
        <article className="title-wrapper">
          <div className="selected-wrapper" onClick={() => setSelect(2)}>
            {select === 2 ? <div className="selected" /> : null}
          </div>
          <h4 className="subTitle">Pay with PayPal</h4>
        </article>

        {select === 2 ? (
          <article className="pay-using-paypal-wrapper">
            <h4 className="pay-now-btn" onClick={() => setIsProcessing(true)}>
              Pay With PayPal
            </h4>
            {isProcessing && (
              <div className="paypal-btn">
                <span
                  className="paypal-close-btn-icon"
                  onClick={() => setIsProcessing(false)}
                >
                  X
                </span>
                <PayPalScriptProvider
                  options={{
                    "client-id": paypalClientId,
                    currency: "USD",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={createOrder}
                    onApprove={(data, actions) => {
                      console.log("PayPal Approved:", data);
                      return onApprove(data, actions);
                    }}
                    onError={(error) => {
                      console.error("PayPal Error:", error);
                      handleAPIError(error, "PayPal encountered an issue.");
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </article>
        ) : null}
      </div>

      {/* Cash on Delivery */}
      <div className="cash-on-deliver-container">
        <article className="title-wrapper">
          <div className="selected-wrapper" onClick={() => setSelect(3)}>
            {select === 3 ? <div className="selected" /> : null}
          </div>
          <h4 className="subTitle">Cash on Delivery</h4>
        </article>

        {select === 3 ? (
          <form
            className="cash-on-deliver-form"
            onSubmit={cashOnDeliveryHandler}
          >
            <button type="submit" className="cash-on-delivery-btn">
              Submit
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentInfo;
