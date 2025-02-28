import "./SingleProductDetails.scss";
import SpecificWishlist from "../specificWishList/SpecificWishlist";
import SingleProductAddToCart from "../singleProductAddToCart/SingleProductAddToCart";
import SingleProductChat from "../singleProductChat/SingleProductChat";
import SingleProductInfo from "../SingleProductInfo/SingleProductInfo";
import SingleProductVariants from "../singleProductVariants/SingleProductVariants";

const SingleProductDetails = ({
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
  return (
    <div className="single-product-details-wrapper">
      <div className="single-product-add-to-cart-wrapper-wishlist-chat-wrapper">
        <SingleProductAddToCart
          addToCartHandler={addToCartHandler}
          setSelectedSize={setSelectedSize}
          selectedSize={selectedSize}
          selectedVariant={selectedVariant}
        />

        {/* Single Product Wishlist */}
        <SpecificWishlist
          currentProduct={currentProduct}
          selectedVariant={selectedVariant}
          setSelectedSize={setSelectedSize}
          selectedSize={selectedSize}
          clickWishlist={clickWishlist}
          addToWishlistHandler={addToWishlistHandler}
          removeFromWishlistHandler={removeFromWishlistHandler}
        />

        {/* Single Product Chatting */}
        <SingleProductChat handleMessageSubmit={handleMessageSubmit} />
      </div>

      <div className="single-product-info-variants-wrapper">
        <SingleProductInfo currentProduct={currentProduct} />

        <SingleProductVariants
          currentProduct={currentProduct}
          handleToggle={handleToggle}
          variantToggles={variantToggles}
        />
      </div>
    </div>
  );
};

export default SingleProductDetails;
