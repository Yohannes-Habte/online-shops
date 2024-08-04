import React, { useState } from 'react';
import './PaymentInfo.scss';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import { FaAddressCard } from 'react-icons/fa';
import { FaCreditCard } from 'react-icons/fa';

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  stripePaymentHandler,
  cashOnDeliveryHandler,
}) => {
  // Local state variables
  const [select, setSelect] = useState(1);

  return (
    <div className="payment-info-wrapper">
      {/* pay with card */}

      <section className="card-payment-container">
        <article className="title-wrapper">
          <div className="seletected-wrapper" onClick={() => setSelect(1)}>
            {select === 1 ? <div className="seletected" /> : null}
          </div>
          <h4 className="subTitle">Pay with Debit/credit card</h4>
        </article>

        {/* Form */}
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

      {/* paypal payment */}
      <div className="paypal-payment-container">
        <article className="title-wrapper">
          <div className="seletected-wrapper" onClick={() => setSelect(2)}>
            {select === 2 ? <div className="seletected" /> : null}
          </div>
          <h4 className="subTitle"> Pay with Paypal</h4>
        </article>

        {/* pay with paypal payement */}
        {select === 2 ? (
          <article className="pay-using-paypal-wrapper">
            <h4 className={`pay-now-btn`} onClick={() => setOpen(true)}>
              Pay Now
            </h4>
            {open && (
              <div className="paypal-btn">
                <span
                  className="paypal-close-btn-icon"
                  onClick={() => setOpen(false)}
                >
                  X
                </span>

                <PayPalScriptProvider
                  options={{
                    'client-id':
                      'AUpP1Z1S8dO-IvQejorPNV9S8mEjeWl0yj_-B6wmAXwnJAbl2LceoVlIfA6o7xSPWFuSBr4eZfoDj0ki',
                  }}
                >
                  <PayPalButtons
                    style={{ layout: 'vertical' }}
                    onApprove={onApprove}
                    createOrder={createOrder}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </article>
        ) : null}
      </div>

      {/* cash on delivery */}
      <div className="cash-on-deliver-container">
        <article className="title-wrapper">
          <div className="seletected-wrapper" onClick={() => setSelect(3)}>
            {select === 3 ? <div className="seletected" /> : null}
          </div>
          <h4 className="subTitle"> Cash on Delivery</h4>
        </article>

        {/* cash on delivery */}
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
