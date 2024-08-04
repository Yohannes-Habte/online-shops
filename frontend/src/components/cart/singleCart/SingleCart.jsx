import React, { useState } from 'react';
import './SingleCart.scss';
import { toast } from 'react-toastify';
import { FaMinusSquare } from 'react-icons/fa';
import { FaPlusSquare } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

const SingleCart = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  // Local state variable
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  // Incremental function
  const increment = (data) => {
    if (data.stock < value) {
      toast.error('You have reached the maximum available products in the stock!');
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  // decremental function
  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="single-cart-container">
      <article className="quantity-management-wrapper">
        <FaMinusSquare
          onClick={() => decrement(data)}
          className="decrease-quantity"
        />

        <h3 className="quantity">{data.qty}</h3>

        <FaPlusSquare
          onClick={() => increment(data)}
          className="increase-quantity"
        />
      </article>

      <figure className="image-container">
        <img src={data?.images} alt="" className="image" />
      </figure>

      <article className="price-wrapper">
        <h3 className="name">{data.name}</h3>
        <p className="price">
          ${data.discountPrice} * {value} = ${totalPrice}
        </p>
      </article>

      <MdDelete
        className="delete-icon"
        onClick={() => removeFromCartHandler(data._id)}
      />
    </div>
  );
};

export default SingleCart;
