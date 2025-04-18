import { AiOutlineHeart } from "react-icons/ai";
import "./SpecificWishlist.scss";

const SpecificWishlist = ({
  currentProduct,
  selectedVariant,
  selectedSize,
  setSelectedSize,
  clickWishlist,
  addToWishlistHandler,
}) => {
  return (
    <section className="product-wishlist-wrapper">
      <h4 className="product-wishlist-aside-title">
        Add this product to your wishlist
      </h4>

      <form className="single-product-size-selection-form">
        <label htmlFor="size-selector-label">Choose Size:</label>
        <select
          id="size-selector"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)} // Only update state
          className="select-size-field"
        >
          <option value="" disabled>
            Select Size
          </option>
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
        <div>
          <button
            type="button"
            className="wishlist-size-button"
            onClick={addToWishlistHandler}
          >
            <AiOutlineHeart
              className={clickWishlist ? "active-wishlist" : "passive-wishlist"}
              onClick={() =>
                addToWishlistHandler({
                  ...currentProduct,
                  variant: {
                    productColor: selectedVariant?.productColor,
                    size: selectedSize,
                  },
                })
              }
              color={clickWishlist ? "active" : "passive"}
              title="Add to wishlist"
            />
            Add to Wishlist
          </button>
        </div>
      </form>
    </section>
  );
};

export default SpecificWishlist;
