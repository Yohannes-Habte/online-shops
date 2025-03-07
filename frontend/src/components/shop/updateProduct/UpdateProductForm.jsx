import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearProductErrors } from "../../../redux/reducers/productReducer";
import { fetchProduct, updateProduct } from "../../../redux/actions/product";
import "./UpdateProductForm.scss";
import axios from "axios";
import {
  cloud_name,
  cloud_URL,
  upload_preset,
} from "../../../utils/security/secreteKey";

const UpdateProductForm = ({ productId }) => {
  const dispatch = useDispatch();
  const { loading, currentProduct, error } = useSelector(
    (state) => state.product
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    originalPrice: "",
    discountPrice: "",
    customerCategory: "",
    tags: [],
    status: "active",
    variants: [
      {
        productColor: "",
        productSizes: [{ size: "", stock: "" }],
        productImage: null,
      },
    ],
  });

  // State for image preview
  const [productImagePreview, setProductImagePreview] = useState(
    new Array(formData.variants.length).fill(null)
  );

  // Fetch product data if productId is provided
  useEffect(() => {
    if (productId) {
      dispatch(fetchProduct(productId));
    }
    return () => {
      dispatch(clearProductErrors());
    };
  }, [dispatch, productId]);

  useEffect(() => {
    if (currentProduct) {
      setFormData({
        title: currentProduct?.title || "",
        description: currentProduct?.description || "",
        originalPrice: currentProduct?.originalPrice || "",
        discountPrice: currentProduct?.discountPrice || "",
        supplier: currentProduct?.supplier?.supplierName || "",
        category: currentProduct?.category?.categoryName || "",
        subcategory: currentProduct?.subcategory?.subcategoryName || "",
        brand: currentProduct?.brand?.brandName || "",
        customerCategory: currentProduct.customerCategory || "",
        tags: currentProduct?.tags || [],
        status: currentProduct?.status || "active",
        variants: currentProduct?.variants || [
          {
            productColor: "",
            productSizes: [{ size: "", stock: "" }],
            productImage: null,
          },
        ],
      });
    }
  }, [currentProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    setFormData((prev) => ({ ...prev, tags: e.target.value.split(",") }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedVariants = prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      );

      return { ...prev, variants: updatedVariants };
    });
  };

  const handleProductSizeChange = (variantIndex, sizeIndex, field, value) => {
    setFormData((prevFormData) => {
      // Create a new array of variants
      const updatedVariants = prevFormData.variants.map(
        (variant, currentVariantIndex) =>
          currentVariantIndex === variantIndex
            ? {
                ...variant,
                // Create a new array of productSizes
                productSizes: variant.productSizes.map(
                  (sizeObj, currentSizeIndex) =>
                    currentSizeIndex === sizeIndex
                      ? { ...sizeObj, [field]: value }
                      : sizeObj
                ),
              }
            : variant
      );

      return { ...prevFormData, variants: updatedVariants };
    });
  };

  // Handle image change and update preview
  const handleImageChange = (e, variantIndex) => {
    const file = e.target.files[0];
    if (file) {
      // Set the preview URL
      setProductImagePreview((prev) => {
        const updatedPreview = [...prev];
        updatedPreview[variantIndex] = URL.createObjectURL(file);
        return updatedPreview;
      });
      handleVariantChange(variantIndex, "productImage", file);
    }
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { productImage: null, productColor: "", productSizes: [] },
      ],
    }));

    // Add preview slot for new variant
    setProductImagePreview((prev) => [...prev, null]);
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));

    // Remove preview for removed variant
    setProductImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSize = (variantIndex) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              productSizes: [...variant.productSizes, { size: "", stock: "" }],
            }
          : variant
      ),
    }));
  };

  const handleRemoveSize = (variantIndex, sizeIndex) => {
    setFormData((prev) => {
      // Shallow copy of variants array
      const updatedVariants = [...prev.variants];

      // Deep copy the variant object
      const updatedVariant = { ...updatedVariants[variantIndex] };

      // Remove the size at the specified index
      updatedVariant.productSizes = updatedVariant.productSizes.filter(
        (_, i) => i !== sizeIndex
      );

      // Replace the updated variant in the variants array
      updatedVariants[variantIndex] = updatedVariant;
      // Return the updated state
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Upload images to cloud
    const variantImages = await Promise.all(
      formData.variants.map(async (variant) => {
        if (variant.productImage) {
          const cloudData = new FormData();
          cloudData.append("file", variant.productImage);
          cloudData.append("upload_preset", upload_preset);
          cloudData.append("cloud_name", cloud_name);

          const res = await axios.post(cloud_URL, cloudData);
          return { ...variant, productImage: res.data.secure_url };
        }
        return variant;
      })
    );

    const newProduct = {
      ...formData,
      variants: variantImages,
    };

    await dispatch(updateProduct(productId, newProduct));
  };

  return (
    <div className="update-product-form-container">
      {error && <p className="error-message">{error}</p>}
      <form className="product-update-form" onSubmit={handleSubmit}>
        <div className="form-input-container">
          <label htmlFor="title" className="input-field-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="form-input-container">
          <label htmlFor="description" className="input-field-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            cols={30}
            value={formData.description}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="form-input-container">
          <label htmlFor="originalPrice" className="input-field-label">
            Original Price
          </label>
          <input
            type="number"
            id="originalPrice"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="form-input-container">
          <label htmlFor="discountPrice" className="input-field-label">
            Discount Price
          </label>
          <input
            type="number"
            id="discountPrice"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="form-input-container">
          <label htmlFor="tags" className="input-field-label">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags.join(",")}
            onChange={handleTagsChange}
            className="input-field"
          />
        </div>

        <div className="form-input-container">
          <label htmlFor="status" className="input-field-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <div className="form-input-container">
          <label htmlFor="status" className="input-field-label">
            Customer Category
          </label>
          <select
            id="customerCategory"
            name="customerCategory"
            value={formData.customerCategory}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
          >
            <option value="">Select Customer Category </option>
            <option value="Ladies">Ladies </option>
            <option value="Gents">Gents </option>
            <option value="Kids">Kids </option>
          </select>
        </div>

        <fieldset className="variants-section-container">
          <legend className="variants-title">Variants</legend>

          {formData.variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="single-variant-wrapper">
              <div className="variant-input-container">
                <label className="varian-input-field-label">
                  Image Update:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, variantIndex)}
                  className="variant-input-field"
                />

                {variant.productImage || productImagePreview[variantIndex] ? (
                  <img
                    src={
                      productImagePreview[variantIndex] || variant.productImage
                    }
                    alt="Product Variant"
                    className="variant-image"
                  />
                ) : (
                  ""
                )}
              </div>

              <div className="variant-input-container">
                <label className="varian-input-field-label">Color:</label>
                <input
                  type="text"
                  value={variant.productColor}
                  onChange={(e) =>
                    handleVariantChange(
                      variantIndex,
                      "productColor",
                      e.target.value
                    )
                  }
                  placeholder="Color"
                  className="variant-input-field"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveVariant(variantIndex)}
                className="remove-variant-button"
              >
                Remove Variant
              </button>

              <div className="product-sizes-section-container">
                <h4 className="product-size-title">Sizes</h4>

                {variant.productSizes.map((size, sizeIndex) => (
                  <div key={sizeIndex} className="single-product-size-wrapper">
                    <div className="product-size-input-container">
                      <label className="product-size-input-field-label">
                        Size:
                      </label>

                      <input
                        type="text"
                        value={size.size}
                        onChange={(e) =>
                          handleProductSizeChange(
                            variantIndex,
                            sizeIndex,
                            "size",
                            e.target.value
                          )
                        }
                        placeholder="Size"
                        className="product-size-input-field"
                      />
                    </div>

                    <div className="product-size-input-container">
                      <label className="product-size-input-field-label">
                        Stock:
                      </label>

                      <input
                        type="number"
                        value={size.stock}
                        onChange={(e) =>
                          handleProductSizeChange(
                            variantIndex,
                            sizeIndex,
                            "stock",
                            e.target.value
                          )
                        }
                        placeholder="Stock"
                        className="product-size-input-field"
                      />
                    </div>

                    <div className="product-size-stock-button-container">
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveSize(variantIndex, sizeIndex)
                        }
                        className="remove-size-button"
                      >
                        Remove Size
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddSize(variantIndex)}
                  className="add-size-button"
                >
                  Add Size
                </button>
              </div>
            </div>
          ))}
          <button
            className="add-variant-btn"
            type="button"
            onClick={handleAddVariant}
          >
            Add Variant
          </button>
        </fieldset>

        <button className="update-product-btn" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProductForm;
