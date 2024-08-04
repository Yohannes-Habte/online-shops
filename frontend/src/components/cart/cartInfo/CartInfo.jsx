import React from 'react';
import './CartInfo.scss';
import { RiCouponFill } from 'react-icons/ri';

const CartInfo = ({
  handleSubmit,
  totalPrice,
  shippingPrice,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentage,
}) => {
  return (
    <section className="cart-info-wrapper">
      <h2 className='cart-info-title'> Price Summary</h2>
      {/* subtotal */}
      <article className="info-container">
        <h3 className="subTitle">Subtotal Price:</h3>
        <p className="outcome">${subTotalPrice}</p>
      </article>

      {/* shiping */}
      <article className="info-container">
        <h3 className="subTitle">Shipping Price:</h3>
        <p className="outcome">${shippingPrice.toFixed(2)}</p>
      </article>

      {/* Discount */}
      <article className="info-container">
        <h3 className="subTitle">Discount Price:</h3>
        <p className="outcome">
          ${discountPercentage ? discountPercentage.toString() : 0}
        </p>
      </article>

      {/* Total Price */}
      <h2 className="total-price"> Total Price: ${totalPrice}</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="cart-info-form">
        <div className="input-container">
          <RiCouponFill className="icon" />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            required
            placeholder="Enter Coupoun code"
            className="input-field"
          />

          <label htmlFor="name" className="input-label">
            Coupon Code
          </label>
          <span className="input-highlight"></span>
        </div>

        <button type="submit" className="submit-btn">
          Apply Code
        </button>
      </form>
    </section>
  );
};

export default CartInfo;
