import React, { useEffect, useState } from 'react';
import './Checkout.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Shipping from '../shipping/Shipping';
import CartInfo from '../cartInfo/CartInfo';
import { API } from '../../../utils/security/secreteKey';

const Checkout = () => {
  const navigate = useNavigate();
  // Global state variables
  const { currentUser } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);

  // Local state variables
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [userInfo, setUserInfo] = useState(false);

  // Display the data at the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // updateChange
  const updateChange = (e) => {
    switch (e.target.name) {
      case 'address':
        setAddress(e.target.value);
        break;
      case 'zipCode':
        setZipCode(e.target.value);
        break;
      case 'city':
        setCity(e.target.value);
        break;
      case 'state':
        setState(e.target.value);
        break;
      case 'country':
        setCountry(e.target.value);
        break;
      default:
        break;
    }
  };

  // Reset variables
  const reset = () => {
    setCountry('');
    setState('');
    setCity('');
    setAddress('');
    setZipCode(null);
  };

  // Sub total price
  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // this is shipping cost variable
  const shippingPrice = subTotalPrice <= 100 ? 50 : subTotalPrice * 0.1;

  // Payment page requires the following order data from the checkout page
  const paymentPage = () => {
    if (
      address === '' ||
      zipCode === null ||
      country === '' ||
      state === '' ||
      city === ''
    ) {
      toast.error('Please choose your delivery address!');
    } else {
      const shippingAddress = {
        address,
        zipCode,
        country,
        state,
        city,
      };

      const orderData = {
        currentUser,
        cart,
        shippingAddress,
        subTotalPrice,
        shippingPrice,
        discountPrice,
        totalPrice,
      };

      // update local storage with the updated orders array
      localStorage.setItem('latestOrder', JSON.stringify(orderData));
      navigate('/payment');
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    try {
      const { data } = await axios.get(`${API}/coupons/shop/value/${name}`);
      const shopId = data?.shopId;
      const couponCodeValue = data?.percent;

      if (data !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error('Coupon code is not valid for this shop');
          setCouponCode('');
        } else {
          // Eligible price
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );

          // Discount price
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(data);
          setCouponCode('');
        }
      }

      if (data === null) {
        toast.error("Coupon code doesn't exists!");
        setCouponCode('');
      }

      reset();
    } catch (error) {
      console.log(error);
    }
  };

  // Discount percentage
  const discountPercentage = couponCodeData
    ? (discountPrice * couponCodeData.percent) / 100
    : '';

  // Total price
  const totalPrice = couponCodeData
    ? (subTotalPrice + shippingPrice - discountPercentage).toFixed(2)
    : (subTotalPrice + shippingPrice).toFixed(2);

  console.log(discountPercentage);

  return (
    <section className="cart-checkout-wrapper">
      <div className="shipping-and-cart-info-container">
        <CartInfo
          subTotalPrice={subTotalPrice}
          shippingPrice={shippingPrice}
          totalPrice={totalPrice}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          discountPercentage={discountPercentage}
          handleSubmit={handleSubmit}
        />

        <Shipping
          user={currentUser}
          country={country}
          setCountry={setCountry}
          state={state}
          setState={setState}
          city={city}
          setCity={setCity}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          address={address}
          setAddress={setAddress}
          zipCode={zipCode}
          setZipCode={setZipCode}
          updateChange={updateChange}
        />
      </div>

      <h4 onClick={paymentPage} className="proceed-payment">
        Proceed to Payment
      </h4>
    </section>
  );
};

export default Checkout;
