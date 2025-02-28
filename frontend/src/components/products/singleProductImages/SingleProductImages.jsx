import "./SingleProductImages.scss";

const SingleProductImages = ({
  currentProduct,
  selectedImage,
  setSelectedVariant,
  setSelectedSize,
  setSelectedImage,
  selectedVariant,
}) => {
  return (
    <div className="single-product-images-wrapper">
      <figure className="single-product-large-image-container">
        <img
          src={selectedImage}
          alt="Large product"
          className="single-product-large-image"
        />
      </figure>
      <div className="single-product-thumbnail-images-wrapper">
        {currentProduct?.variants.map((variant, index) => (
          <img
            key={index}
            src={variant.productImage}
            alt={`${variant.productColor}`}
            onClick={() => {
              setSelectedVariant(variant);
              setSelectedSize(""); // Reset size when color changes
              setSelectedImage(variant.productImage);
            }}
            className={`single-product-thumbnail-image ${
              selectedVariant === variant ? "selected" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SingleProductImages;
