import "./ProductCard.scss";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import Ratings from "../ratings/Ratings";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { ShortenText } from "../../../utils/textHandler/text";

const ProductCard = ({ product }) => {
  const {
    title,
    description,
    originalPrice,
    discountPrice,
    soldOut,
    variants,
  } = product;
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [selectedVariant, setSelectedVariant] = useState(variants[0]); // Default variant

  // Add to cart handler
  const addToCartHandler = () => {
    const isItemExists =
      cart &&
      cart.find(
        (item) =>
          item._id === product._id &&
          item.variant.productColor === selectedVariant.productColor
      );

    if (isItemExists) {
      toast.error("Item already in cart!");
    } else if (product.stock < 1) {
      toast.error("Product is out of stock!");
    } else {
      const cartData = { ...product, qty: 1, variant: selectedVariant };
      dispatch(addToCart(cartData));
      toast.success("Item added to cart successfully!");
    }
  };

  return (
    <section className={"product-card"}>
      <figure className="image-container">
        {soldOut && <div className="overlay">Sold Out</div>}
        <Link to={`/products/${product._id}`}>
          <img
            src={selectedVariant.productImage}
            alt={title}
            className="product-image"
          />
        </Link>
      </figure>

      <div className="product-details">
        <h3 className="shop-name">{product.shop.name}</h3>
        <h4 className="product-title">{ShortenText(title, 40)}</h4>
        <p className="product-description">{ShortenText(description, 100)}</p>
        <div className="display-rating-flex-row">
          <Ratings averageRating={product?.ratings} />
          <span className="reviewers-number">
            25 people reviewed this product
          </span>
        </div>

        <div className="pricing">
          <span className="discount-price">${discountPrice}</span>
          {originalPrice && originalPrice > discountPrice && (
            <span className="original-price">${originalPrice}</span>
          )}
        </div>

        <div className="variant-selector">
          <select
            onChange={(e) =>
              setSelectedVariant(
                variants.find((v) => v.productColor === e.target.value)
              )
            }
          >
            {variants.map((variant, index) => (
              <option key={index} value={variant.productColor}>
                {variant.productColor} - {variant.productSize}
              </option>
            ))}
          </select>
        </div>

        <button
          className={`add-to-cart-btn ${soldOut ? "disabled" : ""}`}
          onClick={addToCartHandler}
        >
          <AiOutlineShoppingCart /> Add to Cart
        </button>
      </div>
    </section>
  );
};

export default ProductCard;
