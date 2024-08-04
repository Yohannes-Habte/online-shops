import React from 'react';
import './TrackOrderCard.scss';

const TrackOrderCard = ({ user, shop, order }) => {
  return (
    <section className="track-order-card">
      <h3 className="subTitle"> Track Your Order form {shop.name} </h3>

      {/* Traking order information */}
      <p className="paragraph">
        Hello <span className="tracking-user-info">{user?.name}</span>, the
        products you ordered from{' '}
        <span className="tracking-shop-info">{shop.name}</span> is{' '}
        <strong className="tracking-order-info">{order.status}</strong>. The
        details of your order is displayed below.{' '}
        <span className="tracking-shop-info">{shop.name}</span> loves
        tranceparency, and we appreciate your professional way of handling
        things and becoming a loyal customer of{' '}
        <span className="tracking-shop-info">{shop.name}</span>. Welcome back to
        the <span className="tracking-shop-info">{shop.name}</span> and we are
        always ready to fulfil your needs.
      </p>

      {/* User Order Details */}
      {order.cart.map((product) => {
        return (
          <article className="order-details">
            <figure className="image-container">
              <img
                src={product?.images}
                alt={product?.name}
                className="image"
              />
            </figure>
            <aside className="product">
              <h3 className="product-name"> {product.name} </h3>
              <p className="description"> {product.description} </p>
            </aside>
          </article>
        );
      })}

      {/* User Address */}
      <article className="shoppping-address">
        <h3 className="subTitle"> Shopping address</h3>
        <p className="address"> {user?.name}, </p>
        <p className="address"> {order?.shippingAddress?.address}, </p>
        <p className="address">
          {order?.shippingAddress?.zipCode} {order?.shippingAddress?.city}{' '}
        </p>
        <p className="address">
          {order?.shippingAddress?.state}, {order?.shippingAddress?.country}{' '}
        </p>
      </article>
    </section>
  );
};

export default TrackOrderCard;
