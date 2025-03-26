import "./Cart.scss";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SingleCart from "../singleCart/SingleCart";
import {
  addToCart,
  removeEventFromCart,
  removeFromCart,
} from "../../../redux/reducers/cartReducer";

const Cart = ({ setOpenCart }) => {
  // Global state variables
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Remove from cart handler
  // const removeFromCartHandler = (productId, color, size) => {
  //   dispatch(removeFromCart({ productId, productColor: color, size }));
  // };
  const removeFromCartHandler = (product) => {
    const isEvent = product.selectedColor && product.selectedSize;
    // dispatch(
    //   removeFromCart({
    //     productId: product._id,
    //     productColor: isEvent
    //       ? product.selectedColor
    //       : product.variant?.productColor,
    //     size: isEvent ? product.selectedSize : product.variant?.size,
    //   })
    // );

    if (isEvent) {
      dispatch(
        removeEventFromCart({
          productId: product._id,
          productColor: product.selectedColor,
          size: product.selectedSize,
        })
      );
    } else {
      dispatch(
        removeFromCart({
          productId: product._id,
          productColor: product.variant?.productColor,
          size: product.variant?.size,
        })
      );
    }
  };

  // Total price calculation
  const totalItemsPrice = cart?.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // Change quantity handler
  const quantityChangeHandler = (productId, color, size, qty) => {
    dispatch(addToCart({ productId, productColor: color, size, qty }));
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

              {/* Item count */}
              <IoBagHandleOutline className="icon" />
              <h5 className="subTitle">
                {cart.length === 1
                  ? `There is ${cart.length} item in the shopping cart`
                  : `There are ${cart.length} items in the shopping cart`}
              </h5>

              {/* Cart items */}
              <div className="single-cart-wrapper">
            
                {cart &&
                  cart.map((product) => {
                    const isEvent =
                      product.selectedColor && product.selectedSize;
                    const color = isEvent
                      ? product.selectedColor
                      : product.variant?.productColor;
                    const size = isEvent
                      ? product.selectedSize
                      : product.variant?.size;

                    return (
                      <SingleCart
                        key={`${product._id}-${color}-${size}`}
                        data={product}
                        setOpenCart={setOpenCart}
                        quantityChangeHandler={() =>
                          quantityChangeHandler(product._id, color, size, 1)
                        }
                        removeFromCartHandler={() =>
                          removeFromCartHandler(product)
                        }
                      />
                    );
                  })}
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

            {/* Checkout button */}
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
