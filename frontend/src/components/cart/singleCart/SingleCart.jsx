import "./SingleCart.scss";
import { toast } from "react-toastify";
import { FaMinusSquare, FaPlusSquare } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  removeEventFromCart,
  addEventToCart,
} from "../../../redux/reducers/cartReducer";

const SingleCart = ({ data, setOpenCart }) => {
  const dispatch = useDispatch();
  const isEvent = data.selectedColor && data.selectedSize;

  // Increment quantity
  const increment = () => {
    if (isEvent) {
      if (data.totalInventory <= data.qty) {
        toast.error(
          "You have reached the maximum available products in stock!"
        );
      } else {
        dispatch(
          addEventToCart({
            ...data,
            qty: data.qty + 1,
          })
        );
      }
    } else {
      if (data.stock <= data.qty) {
        toast.error(
          "You have reached the maximum available products in stock!"
        );
      } else {
        dispatch(
          addToCart({
            ...data,
            qty: data.qty + 1,
          })
        );
      }
    }
  };

  // Decrement quantity
  const decrement = () => {
    if (isEvent) {
      if (data.qty > 1) {
        dispatch(
          addEventToCart({
            ...data,
            qty: data.qty - 1,
          })
        );
      } else {
        if (data.qty > 1) {
          dispatch(
            addToCart({
              ...data,
              qty: data.qty - 1,
            })
          );
        }
      }
    }
  };

  // Remove item from cart (product or event)
  const removeFromCartHandler = () => {
    if (isEvent) {
      dispatch(
        removeEventFromCart({
          productId: data._id,
          productColor: data.selectedColor,
          size: data.selectedSize,
        })
      );
    } else {
      dispatch(
        removeFromCart({
          productId: data._id,
          productColor: data.variant?.productColor,
          size: data.variant?.size,
        })
      );
    }
  };

  // Total price calculation
  const totalPrice = data.discountPrice * data.qty;
  const totalItemPrice = totalPrice.toFixed(2);

  return (
    <div className="single-cart-container">
      {/* Quantity Control */}
      <article className="cart-product-quantity-wrapper">
        <FaPlusSquare onClick={increment} className="increase-quantity" />
        <h3 className="product-quantity">{data.qty}</h3>
        <FaMinusSquare onClick={decrement} className="decrease-quantity" />
      </article>

      {/* Product Image */}
      <figure className="image-container">
        <Link to={`/products/${data._id}`}>
          <img
            src={data?.variant?.productImage || data.images?.[0]}
            alt={data.title}
            className="image"
            onClick={() => setOpenCart(false)}
          />
        </Link>
      </figure>

      {/* Product Details */}
      <article className="product-title-price-and-size-wrapper">
        <h3 className="product-title" onClick={() => setOpenCart(false)}>
          <Link to={`/products/${data._id}`} style={{ color: "blue" }}>
            {data.title}
          </Link>
        </h3>
        <p className="product-size">
          Size: {isEvent ? data.selectedSize : data.variant?.size}
        </p>
        <p className="product-price">
          Price: ${data.discountPrice.toFixed(2)} * {data.qty} ={" "}
          <strong className="price">${totalItemPrice}</strong>
        </p>
      </article>

      {/* Remove from Cart Button */}
      <MdDelete
        className="cart-product-delete-icon"
        onClick={removeFromCartHandler}
      />
    </div>
  );
};

export default SingleCart;
