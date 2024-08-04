import React from 'react';
import './Cart.scss';
import { RxCross1 } from 'react-icons/rx';
import { IoBagHandleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SingleCart from '../singleCart/SingleCart';
import { addToCart, removeFromCart } from '../../../redux/reducers/cartReducer';

const Cart = ({ setOpenCart }) => {
  // Global state variables
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Remove from cart handler
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  // Total price
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // Change quantity handler
  const quantityChangeHandler = (id) => {
    dispatch(addToCart(id));
  };

  return (
    <main className="cart">
      <article className="cart-container">
        {cart && cart.length === 0 ? (
          <section className="empty-cart-wrapper">
            <RxCross1
              className="close-icon"
              onClick={() => setOpenCart(false)}
            />
            <h2 className="empty-cart">Cart Items is empty!</h2>
          </section>
        ) : (
          <>
            <section className="cart-order-wrapper">
              <RxCross1
                className="close-icon"
                onClick={() => setOpenCart(false)}
              />

              {/* Item length */}

              <IoBagHandleOutline className="icon" />
              <h5 className="subTitle">
                {cart.length === 1 &&
                  `There is ${cart && cart.length} Item in the  Shopping Cart`}
                {cart.length > 1 &&
                  `There are ${cart && cart.length} Items in the Shopping Cart`}
              </h5>

              {/* cart Single Items */}
              <div className="single-cart-wrapper">
                {cart &&
                  cart.map((product) => (
                    <SingleCart
                      key={product._id}
                      data={product}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </section>
            <hr />
            <h2 className="total-price">
              Total Pirce: <span className="amount">${totalPrice}</span>
            </h2>
            <hr />

            {/* checkout buttons */}
            <Link to="/checkout">
              <button className="checkout-now-btn">Checkout Now</button>
            </Link>
          </>
        )}
      </article>
    </main>
  );
};

export default Cart;
