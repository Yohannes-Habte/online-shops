import { useState } from "react";
import "./PaymentInfo.scss";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { FaAddressCard, FaCreditCard } from "react-icons/fa";
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
  currencyOptions,
  selectedCurrency,
  setSelectedCurrency,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  methodOptions,
}) => {
  const isStripe =
    selectedPaymentMethod === "Credit Card" ||
    selectedPaymentMethod === "Debit Card";
  const isPayPal = selectedPaymentMethod === "PayPal";
  const isCOD = selectedPaymentMethod === "Cash On Delivery";

  return (
    <div className="payment-info-wrapper">
      <div className="payment-method-container">
        <div className="payment-method-input-wrapper">
          <label htmlFor="currency" className="payment-method-label">
            Select Currency:
          </label>
          <select
            id="currency"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="payment-method-field"
          >
            <option value="" disabled>
              -- Select Currency --
            </option>
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="payment-method-input-wrapper">
          <label className="payment-method-label">
            Select a payment method:
          </label>
          <div className="payment-method-options">
            {methodOptions.map((method) => (
              <div key={method} className="payment-option">
                <input
                  type="radio"
                  id={method}
                  name="paymentMethod"
                  value={method}
                  checked={selectedPaymentMethod === method}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="payment-method-field payment-option-radio-field"
                />
                <label htmlFor={method} className="payment-option-label">
                  {method}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isStripe && (
        <section className="card-payment-container">
          <h4 className="card-payment-title">
            {" "}
            {selectedPaymentMethod === "Credit Card" ? (
              <strong className="credit-card">Pay with Credit Card</strong>
            ) : (
              <strong className="debit-card">Pay with Debit Card</strong>
            )}
          </h4>
          <form className="payment-form" onSubmit={stripePaymentHandler}>
            <div className="wrapper">
              <div className="input-container">
                <label className="label">Card Owner</label>
                <input
                  required
                  readOnly
                  value={user?.name}
                  className="input-field"
                />
                <FaAddressCard className="icon" />
              </div>
              <div className="input-container">
                <label className="label">Exp Date</label>
                <CardExpiryElement className="cart-element" />
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

            <button
              className="submit-payment-btn"
              type="submit"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Submit"}
            </button>
          </form>
        </section>
      )}

      {isPayPal && (
        <div className="paypal-payment-container">
          <h4 className="paypal-payment-title">Pay with PayPal</h4>

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
                    currency: selectedCurrency,
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={(error) =>
                      handleAPIError(error, "PayPal encountered an issue.")
                    }
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </article>
        </div>
      )}

      {isCOD && (
        <div className="cash-on-deliver-container">
          <h4 className="cash-on-delivery-title">Cash on Delivery</h4>
          <form
            className="cash-on-deliver-form"
            onSubmit={cashOnDeliveryHandler}
          >
            <button
              type="submit"
              className="cash-on-delivery-btn"
              disabled={isProcessing}
            >
              {isProcessing ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentInfo;
