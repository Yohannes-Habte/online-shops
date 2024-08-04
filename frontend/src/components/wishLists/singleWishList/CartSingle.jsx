import React, { useState } from 'react';
import './CartSingle.scss';
import { FaPlusSquare } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.discountPrice * value;

  return (
    <section className="cart-single-wishlist">
      <FaPlusSquare
        className="add-icon"
        title="Add to cart"
        onClick={() => addToCartHandler(data)}
      />
      <figure className="image-container">
        <img src={data?.images} alt="" className="image" />
      </figure>

      <h2 className="title">
        {data.name}: ${totalPrice}
      </h2>

      <MdDelete
        className="delete-icon"
        title="Delete from cart"
        onClick={() => removeFromWishlistHandler(data._id)}
      />
    </section>
  );
};

export default CartSingle;
