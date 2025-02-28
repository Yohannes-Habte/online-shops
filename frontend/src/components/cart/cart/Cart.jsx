import "./Cart.scss";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SingleCart from "../singleCart/SingleCart";
import { addToCart, removeFromCart } from "../../../redux/reducers/cartReducer";

const Cart = ({ setOpenCart }) => {
  // Global state variables
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Remove from cart handler
  const removeFromCartHandler = (productId, productColor, size) => {
    dispatch(removeFromCart({ productId, productColor, size }));
  };

  // Total price
  const totalItemsPrice = cart?.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // Change quantity handler
  const quantityChangeHandler = (productId, productColor, size, qty) => {
    dispatch(addToCart({ productId, productColor, size, qty }));
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
                      key={`${product._id}-${product.variant.productColor}-${product.variant.size}`} // Unique key
                      data={product}
                      setOpenCart={setOpenCart}
                      quantityChangeHandler={() =>
                        quantityChangeHandler(
                          product._id,
                          product.variant.productColor,
                          product.variant.size,
                          1 // Increase by 1
                        )
                      }
                      removeFromCartHandler={() =>
                        removeFromCartHandler(
                          product._id,
                          product.variant.productColor,
                          product.variant.size
                        )
                      }
                    />
                  ))}
              </div>
            </section>
           
            <div className="cart-horizontal-line"></div>
            <h2 className="cart-items-total-price">
              Total Price:{" "}
              <span className="cart-items-total-price-amount">
                ${totalItemsPrice.toFixed(2)}
              </span>
            </h2>
            <hr />

            {/* checkout buttons */}
          <div className="cart-checkout-btn-container">
          <Link to="/checkout">
              <button className="checkout-now-btn">Checkout Now</button>
            </Link>
          </div>
          </>
        )}
      </article>
    </main>
  );
};

export default Cart;
