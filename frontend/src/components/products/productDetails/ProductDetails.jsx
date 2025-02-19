import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";

const ProductDetails = ({
  variantToggles,
  addToCartHandler,
  selectedSize,
  setSelectedSize,
  currentProduct,
  selectedVariant,
  handleToggle,
  handleMessageSubmit,
  addToWishlistHandler,
  removeFromWishlistHandler,
  clickWishlist,
}) => {
  // ===========================================================================
  // Handle conversion for a product
  // ===========================================================================

  const handleConversationAside = () => (
    <aside className="product-message-aside-wrapper">
      <h4 className="send-message-title">Have Questions About This Product?</h4>
      <p className="send-message-paragraph">
        We are here to help. Click the message icon to chat with us:
      </p>

      <p onClick={handleMessageSubmit} className="send-message">
        Send a Message <AiOutlineMessage className="send-message-icon" />
      </p>
    </aside>
  );

  // ===========================================================================
  // Handle wishlist for a product
  // ===========================================================================

  const handleWishlistAside = () => (
    <aside className="product-wishlist-aside-wrapper">
      <h4 className="product-wishlist-aside-title">
        Do you like this product?
      </h4>
      <p className="wishlist">
        {clickWishlist ? (
          <AiFillHeart
            className={clickWishlist ? "active-wishlist" : "passive-wishlist"}
            onClick={() => removeFromWishlistHandler(currentProduct._id)}
            color={clickWishlist ? "red" : "black"}
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            className={clickWishlist ? "active-wishlist" : "passive-wishlist"}
            onClick={() => addToWishlistHandler(currentProduct)}
            color={clickWishlist ? "active" : "passive"}
            title="Add to wishlist"
          />
        )}
      </p>
    </aside>
  );
  return (
    <div className="single-product-parts-wrapper">
      <aside className="product-size-aside-wrapper">
        <h2 className="product-size-title">Select Product Size</h2>
        <form className="size-selection-form" onSubmit={addToCartHandler}>
          <label htmlFor="size-selector">Choose Size:</label>
          <select
            id="size-selector"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {selectedVariant?.productSizes?.map((sizeObj, index) => (
              <option key={index} value={sizeObj.size}>
                {sizeObj.size} {sizeObj.stock < 1 ? "(Out of Stock)" : ""}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="size-button"
            onClick={addToCartHandler}
          >
            Add to Cart
          </button>
        </form>

        {/* Single Product Chatting */}
        {handleConversationAside()}

        {/* Single Product Wishlist */}
        {handleWishlistAside()}
      </aside>

      <aside className="product-infos-aside-wrapper">
        <h3 className="product-info-title">Product Details</h3>
        <p className="product-prices-info">
          <strong>Discounted Price:</strong>
          <span className="discounted-price">
            {" "}
            ${currentProduct?.discountPrice}
          </span>
          <span className="original-price">
            {" "}
            ${currentProduct?.originalPrice}
          </span>
        </p>
        <p className="product-info">
          <strong>Shop:</strong> {currentProduct?.shop?.name || "N/A"}
        </p>

        <p className="product-info">
          <strong>Supplier:</strong>{" "}
          {currentProduct?.supplier?.supplierName || "N/A"}
        </p>

        <p className="product-info">
          <strong>Category:</strong>{" "}
          {currentProduct?.category?.categoryName || "N/A"}
        </p>

        <p className="product-info">
          <strong>Subcategory:</strong>{" "}
          {currentProduct?.subcategory?.subcategoryName || "N/A"}
        </p>

        <p className="product-info">
          <strong>Customer Category:</strong>{" "}
          {currentProduct?.customerCategory || "N/A"}
        </p>

        <p className="product-info">
          <strong>Brand:</strong> {currentProduct?.brand?.brandName || "N/A"}
        </p>

        <p className="product-info">
          <strong>Status:</strong> {currentProduct?.status}
        </p>

        <p className="product-info">
          <strong>Sold Out:</strong> {currentProduct?.soldOut}
        </p>

        <p className="product-info">
          <strong>Ratings:</strong> {currentProduct?.ratings?.average} (
          {currentProduct?.ratings?.count} reviews)
        </p>
      </aside>

      <aside className="product-variants-aside-wrapper">
        <h2 className="product-variants-title">Product Variants</h2>
        {currentProduct?.variants.length > 0 ? (
          <ul className="variants-list">
            {currentProduct?.variants.map((variant, index) => (
              <li key={index} className="variant-item">
                <p className="variant-color">
                  <strong>Color:</strong> {variant.productColor}{" "}
                  <button
                    className="toggle-button"
                    onClick={() => handleToggle(index)}
                  >
                    {variantToggles[index] ? "Hide Details" : "Show Details"}
                  </button>
                </p>
                {variantToggles[index] && (
                  <ul className="variant-size-details">
                    {variant.productSizes.map((size, idx) => (
                      <li key={idx}>
                        <strong>Size:</strong> {size.size} - {size.stock} in
                        stock
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No variants available.</p>
        )}
      </aside>
    </div>
  );
};

export default ProductDetails;
