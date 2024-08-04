import React, { useState } from 'react';
import './PaymentMethod.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  CardNumberElement,
  useStripe,
  useElements,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import PaymentInfo from '../paymentInfo/PaymentInfo';
import CartData from '../cartData/CartData';
import { clearFromCart } from '../../../redux/reducers/cartReducer';
import { API } from '../../../utils/security/secreteKey';

const PaymentMethod = () => {
  const navigate = useNavigate();
  // Global state bariables
  const { currentUser } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Get stripe and elements from @stripe/react-stripe-js
  const stripe = useStripe();
  const elements = useElements();

  // Local state variables
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem('latestOrder'));
    setOrderData(orderData);
  }, []);

  // payment data for stripe
  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };
  console.log('Stripe payment date is', paymentData);

  //=======================================
  // order used in all payment platform
  //=======================================
  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    totalPrice: orderData?.totalPrice,
    user: currentUser && currentUser,
  };

  //=======================================
  // Create order for Paypal
  //=======================================
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: 'Lisa Online Shoping Products',
            amount: {
              currency_code: 'USD',
              value: orderData?.totalPrice,
            },
          },
        ],
        // not needed if a shipping address is actually needed
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      })
      .then((orderID) => {
        return orderID;
      });
  };

  //=======================================
  // On Approve for Paypal
  //=======================================
  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;

      let paymentInfo = payer;

      if (paymentInfo !== undefined) {
        paypalPaymentHandler(paymentInfo);
      }
    });
  };

  // ========================================================================
  // Paypal payment handler
  // ========================================================================
  const paypalPaymentHandler = async (paymentInfo) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      order.paymentInfo = {
        id: paymentInfo.payer_id,
        status: 'succeeded',
        type: 'Paypal',
      };

      const { data } = await axios.post(
        `${API}/orders/new-order`,
        order,
        config
      );

      setOpen(false);
      navigate('/order/success');
      toast.success('Order successful!');
      dispatch(clearFromCart());
      localStorage.setItem('latestOrder', JSON.stringify([]));
      window.location.reload();
    } catch (error) {
      toast.error('Paypal payment failed! Please try again!');
    }
  };

  // ========================================================================
  // Stripe payment handler
  // ========================================================================
  const stripePaymentHandler = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `${API}/payment/stripe`,
        paymentData,
        config
      );

      // Client secret
      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      // If tripe and clements are exist, cofirm card payement using client secret and payment method
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      // If there is an error, then ...
      if (result.error) {
        toast.error(result.error.message);
      } else {
        // If there is not error, then ...
        if (result.paymentIntent.status === 'succeeded') {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: 'Credit Card',
          };

          // If the stripe payement is corret, and then create an order
          try {
            const { data } = await axios.post(
              `${API}/orders/new-order`,
              order,
              config
            );
            setOpen(false);
            navigate('/order/success');
            toast.success('Order successful!');
            dispatch(clearFromCart());
            localStorage.setItem('latestOrder', JSON.stringify([]));
            window.location.reload();
            //& You can send email here to the user
          } catch (error) {
            toast.error(error.response.data.message);
          }
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // ========================================================================
  // Cash on delivery handler
  // ========================================================================
  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      order.paymentInfo = {
        type: 'Cash On Delivery',
      };

      const { data } = await axios.post(
        `${API}/orders/new-order`,
        order,
        config
      );

      setOpen(false);
      navigate('/order/success');
      toast.success('Order successful!');
      dispatch(clearFromCart());
      localStorage.setItem('latestOrder', JSON.stringify([]));
      window.location.reload();
    } catch (error) {
      toast.error('Cash on delivery payment failed!');
    }
  };

  return (
    <section className="payment-methods-wrapper">
      <article className="header-wrapper">
        <h1 className="add-payment-methods-title"> Add Payment Method </h1>
        <span className="add-new">Add New </span>
      </article>
      <div className="paymentInfo-cardData-wrapper">
        <PaymentInfo
          user={currentUser}
          open={open}
          setOpen={setOpen}
          onApprove={onApprove}
          createOrder={createOrder}
          stripePaymentHandler={stripePaymentHandler}
          cashOnDeliveryHandler={cashOnDeliveryHandler}
        />
        <CartData orderData={orderData} />
      </div>
    </section>
  );
};

export default PaymentMethod;
