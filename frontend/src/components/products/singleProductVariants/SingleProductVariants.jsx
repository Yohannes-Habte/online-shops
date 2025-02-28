import "./SingleProductVariants.scss";

const SingleProductVariants = ({
  currentProduct,
  handleToggle,
  variantToggles,
}) => {
  return (
    <aside className="single-product-variants-wrapper">
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
                    <li
                      key={idx}
                      className={size.stock === 0 ? "out-of-stock" : ""}
                    >
                      <strong>Size:</strong> {size.size} - {size.stock} in stock
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
  );
};

export default SingleProductVariants;
