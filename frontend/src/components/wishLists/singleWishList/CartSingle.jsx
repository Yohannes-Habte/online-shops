import { useState, useEffect } from "react";
import "./CartSingle.scss";
import { FaPlusSquare } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const CartSingle = ({
  data,
  removeFromWishlistHandler,
  addToCartHandler,
  handleVariantSelection,
  selectedVariant,
}) => {
  // Set default variant (first color and first size of that color)
  const defaultColor = data?.variants?.[0]?.productColor; // Default color is the first available color
  const defaultSize = data?.variants?.[0]?.productSizes?.[0]?.size; // Default size is the first size of the first color

  const [currentVariant, setCurrentVariant] = useState({
    productColor: defaultColor,
    selectedSize: defaultSize,
    // Initialize with the default variant details
  });

  // Update the selected variant when the selected color or size changes
  useEffect(() => {
    if (selectedVariant) {
      setCurrentVariant(selectedVariant);
    } else {
      setCurrentVariant({
        productColor: defaultColor,
        selectedSize: defaultSize,
      });
    }
  }, [selectedVariant, defaultColor, defaultSize]);

  const totalPrice = data?.discountPrice || 0;

  // Handle variant change (size/color)
  const handleVariantChange = (size, color) => {
    const variant = data?.variants?.find(
      (variant) => variant.productColor === color
    );

    if (variant) {
      const selectedSize = variant.productSizes?.find(
        (item) => item.size === size
      );

      if (selectedSize) {
        setCurrentVariant({ ...variant, selectedSize });
        handleVariantSelection({ ...variant, selectedSize }); // Pass the selected variant to the parent
      }
    }
  };

  // Handle color change
  const handleColorChange = (color) => {
    setCurrentVariant({ ...currentVariant, productColor: color });
    const variant = data?.variants?.find(
      (variant) => variant.productColor === color
    );
    setCurrentVariant({
      ...variant,
      selectedSize: variant?.productSizes?.[0]?.size,
    });
    handleVariantSelection({ ...variant, selectedSize: variant?.productSizes?.[0] });
  };

  return (
    <section className="cart-single-wishlist">
      <FaPlusSquare
        className="add-icon"
        title="Add to cart"
        onClick={() => addToCartHandler({ ...data, variant: currentVariant })}
      />

      <figure className="image-container">
        <img
          src={currentVariant?.productImage || data?.productImage}
          alt={data?.title || "Product Image"}
          className="image"
        />
      </figure>

      <h2 className="title">${totalPrice.toFixed(2)}</h2>

      {/* Variant selection (Size/Color) */}
      <div className="variant-selection">
        {/* Color selection */}
        <select
          value={currentVariant.productColor}
          onChange={(e) => handleColorChange(e.target.value)}
        >
          {data?.variants?.map((variant) => (
            <option key={variant.productColor} value={variant.productColor}>
              {variant.productColor}
            </option>
          ))}
        </select>

        {/* Size selection for the selected color */}
        <select
          value={currentVariant.selectedSize}
          onChange={(e) =>
            handleVariantChange(e.target.value, currentVariant.productColor)
          }
        >
          {/* Get sizes for the selected color */}
          {data?.variants
            ?.find((variant) => variant.productColor === currentVariant.productColor)
            ?.productSizes?.map((variantSize) => (
              <option key={variantSize.size} value={variantSize.size}>
                {variantSize.size}
              </option>
            ))}
        </select>
      </div>

      <MdDelete
        className="delete-icon"
        title="Remove from wishlist"
        onClick={() => removeFromWishlistHandler(data?._id)}
      />
    </section>
  );
};

export default CartSingle;
