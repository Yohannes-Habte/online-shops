import React from 'react';
import "./CartData.scss"

const CartData = ({ orderData }) => {
  const shippingCost = orderData?.shippingPrice?.toFixed(2);
  return (
    <section className="cart-data-wrapper">
      <article className="box subtotal-price">
        <h3 className="cart-data-subTitle">subtotal:</h3>
        <p className="cart-data-paragraph">${orderData?.subTotalPrice}</p>
      </article>

      <article className="box shipping-price">
        <h3 className="cart-data-subTitle">shipping:</h3>
        <p className="cart-data-paragraph">${shippingCost}</p>
      </article>

      <article className="box discount-price">
        <h3 className="cart-data-subTitle">Discount:</h3>
        <p className="cart-data-paragraph">
          {orderData?.discountPrice ? '$' + orderData.discountPrice : '-'}
        </p>
      </article>
<hr />
      <h2 className="cart-data-total-price">${orderData?.totalPrice}</h2>
    </section>
  );
};

export default CartData;
