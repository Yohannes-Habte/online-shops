import "./SingleProductAddToCart.scss";
import { FaCartPlus } from "react-icons/fa";

const SingleProductAddToCart = ({
  addToCartHandler,
  setSelectedSize,
  selectedSize,
  selectedVariant,
}) => {
  return (
    <section className="single-product-size-wrapper">
      <h2 className="product-size-title">Select Product Size</h2>
      <form className="single-product-size-selection-form">
        <label htmlFor="size-selector-label">Choose Size:</label>
        <select
          id="size-selector"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)} // Only update state
          className="select-size-field"
        >
          {selectedVariant?.productSizes?.map((sizeObj, index) => (
            <option
              key={index}
              value={sizeObj.size}
              className={sizeObj.stock < 1 ? "out-of-stock" : ""}
              disabled={sizeObj.stock < 1}
            >
              {sizeObj.size} {sizeObj.stock < 1 ? "(Out of Stock)" : ""}
            </option>
          ))}
        </select>

        {/* Ensure addToCartHandler only runs on button click */}
        <button
          type="button"
          className="single-product-add-to-cart-btn"
          onClick={addToCartHandler}
        >
          <FaCartPlus className="add-to-cart-icon" />
          Add to Cart
        </button>
      </form>
    </section>
  );
};

export default SingleProductAddToCart;
