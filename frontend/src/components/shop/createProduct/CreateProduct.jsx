import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiTag,
  FiAlignLeft,
  FiPackage,
  FiGrid,
  FiShoppingBag,
} from "react-icons/fi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { MdOutlineCategory, MdOutlineImage } from "react-icons/md";
import "./CreateProduct.scss";

import {
  API,
  cloud_name,
  cloud_URL,
  upload_preset,
} from "../../../utils/security/secreteKey";
import { useSelector } from "react-redux";

const initialState = {
  title: "",
  description: "",
  originalPrice: "",
  discountPrice: "",
  supplier: "",
  category: "",
  subcategory: "",
  brand: "",
  customerCategory: "",
  tags: [],
  status: "active",
  stock: 0,
  variants: [
    {
      productColor: "",
      productSize: "",
      productImage: null,
    },
  ],
};

const CreateProduct = () => {
  const { currentSeller } = useSelector((state) => state.seller);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await axios.get(`${API}/${endpoint}`, {
          withCredentials: true,
        });
        setter(response.data[endpoint]);
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        toast.error(`Failed to load ${endpoint}`);
      }
    };

    fetchData("brands", setBrands);
    fetchData("categories", setCategories);
    fetchData("subcategories", setSubcategories);
    fetchData("suppliers", setSuppliers);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedVariants = [...formData.variants];
    updatedVariants[index][name] = files ? files[0] : value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          productColor: "",
          productSize: "",
          productImage: null,
        },
      ],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required.";

    if (!formData.description.trim())
      newErrors.description = "Description is required.";

    if (!formData.originalPrice.trim())
      newErrors.originalPrice = "Original price is required.";

    if (!formData.discountPrice.trim())
      newErrors.discountPrice = "Discounted price is required.";

    if (!formData.supplier) newErrors.supplier = "Supplier ID is required.";

    if (!formData.category) newErrors.category = "Category ID is required.";

    if (!formData.subcategory)
      newErrors.subcategory = "Subcategory is required.";

    if (!formData.brand) newErrors.brand = "Brand ID is required.";

    if (!formData.stock.trim() || formData.stock <= 0)
      newErrors.stock = "Stock must be greater than 0.";

    if (!formData.customerCategory)
      newErrors.customerCategory = "Customer category is required.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
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
        shopId: currentSeller?._id,
        variants: variantImages,
      };
      const response = await axios.post(`${API}/products/create`, newProduct, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setFormData(initialState);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product">
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div className="input-container">
          <label htmlFor="title">Title</label>
          <div className="input-wrapper">
            <FiTag className="input-icon" />
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter product title"
              disabled={loading}
            />
          </div>
          {errors.title && <small className="error">{errors.title}</small>}
        </div>

        {/* Description Field */}
        <div className="input-container">
          <label htmlFor="description">Description</label>
          <div className="input-wrapper">
            <FiAlignLeft className="input-icon" />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              disabled={loading}
            ></textarea>
          </div>
          {errors.description && (
            <small className="error">{errors.description}</small>
          )}
        </div>

        {/* Product Original Price */}
        <div className="input-container">
          <label htmlFor="stock">Original Price</label>
          <div className="input-wrapper">
            <FaMoneyCheckAlt className="input-icon" />
            <input
              type="number"
              id="originalPrice"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleInputChange}
              placeholder="Enter product original price"
              disabled={loading}
            />
          </div>
          {errors.originalPrice && (
            <small className="error">{errors.originalPrice}</small>
          )}
        </div>

        {/* Product Discounted Price */}
        <div className="input-container">
          <label htmlFor="stock">Discount Price</label>
          <div className="input-wrapper">
            <FaMoneyCheckAlt className="input-icon" />
            <input
              type="number"
              id="discountPrice"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleInputChange}
              placeholder="Enter product discounted price"
              disabled={loading}
            />
          </div>
          {errors.discountPrice && (
            <small className="error">{errors.discountPrice}</small>
          )}
        </div>

        {/* Tags Field */}
        <div className="input-container">
          <label htmlFor="tags">Tags</label>
          <div className="input-wrapper">
            <FiPackage className="input-icon" />
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags.join(",")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(",").map((tag) => tag.trim()),
                })
              }
              placeholder="Enter tags separated by commas"
              disabled={loading}
            />
          </div>
        </div>

        {/* Supplier Dropdown */}
        <div className="input-container">
          <label htmlFor="supplier">Supplier</label>
          <div className="input-wrapper">
            <FiGrid className="input-icon" />
            <select
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.supplierName}
                </option>
              ))}
            </select>
          </div>
          {errors.supplier && (
            <small className="error">{errors.supplier}</small>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="input-container">
          <label htmlFor="category">Category</label>
          <div className="input-wrapper">
            <MdOutlineCategory className="input-icon" />
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <small className="error">{errors.category}</small>
          )}
        </div>

        {/* Subcategory Dropdown */}
        <div className="input-container">
          <label htmlFor="subcategory">Subcategory</label>
          <div className="input-wrapper">
            <FiShoppingBag className="input-icon" />
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.subcategoryName}
                </option>
              ))}
            </select>
          </div>
          {errors.subcategory && (
            <small className="error">{errors.subcategory}</small>
          )}
        </div>

        {/* Brand Dropdown */}
        <div className="input-container">
          <label htmlFor="brand">Brand</label>
          <div className="input-wrapper">
            <FiPackage className="input-icon" />
            <select
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
          {errors.brand && <small className="error">{errors.brand}</small>}
        </div>

        {/* customer category Dropdown */}
        <div className="input-container">
          <label htmlFor="customerCategory">Customer Category</label>
          <div className="input-wrapper">
            <FiPackage className="input-icon" />
            <select
              id="customerCategory"
              name="customerCategory"
              value={formData.customerCategory}
              onChange={handleInputChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Select Customer Category </option>
              <option value="Ladies">Ladies </option>
              <option value="Gents">Gents </option>
              <option value="Kids">Kids </option>
            </select>
          </div>
          {errors.customerCategory && (
            <small className="error">{errors.customerCategory}</small>
          )}
        </div>

        {/* Variants */}
        <fieldset>
          <legend>Variants</legend>
          {formData.variants.map((variant, index) => (
            <div className="variant-group" key={index}>
              {[
                {
                  name: "productColor",
                  placeholder: "Color",
                  icon: FiTag,
                },
                {
                  name: "productSize",
                  placeholder: "Size",
                  icon: FiAlignLeft,
                },
              ].map(({ name, placeholder, icon: Icon }) => (
                <div className="variant-input-container" key={name}>
                  <label>{placeholder}</label>
                  <div className="variant-input">
                    <Icon className="variant-icon" />
                    <input
                      type="text"
                      placeholder={placeholder}
                      name={name}
                      value={variant[name]}
                      onChange={(e) => handleVariantChange(index, e)}
                      disabled={loading}
                    />
                  </div>
                  {errors[`variant_${index}`] && (
                    <small className="error">
                      {errors[`variant_${index}`]}
                    </small>
                  )}
                </div>
              ))}

              <div className="variant-input-container">
                <label>Variant Image</label>
                <div className="variant-input">
                  <MdOutlineImage className="variant-icon" />
                  <input
                    type="file"
                    name="productImage"
                    onChange={(e) => handleVariantChange(index, e)}
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeVariant(index)}
                disabled={loading}
              >
                Remove Variant
              </button>
            </div>
          ))}
        </fieldset>

        <button type="button" onClick={addVariant} disabled={loading}>
          Add Variant
        </button>

        {/* Product quantity */}
        <div className="input-container">
          <label htmlFor="stock">Stock</label>
          <div className="input-wrapper">
            <FiTag className="input-icon" />
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Enter product quantity"
              disabled={loading}
            />
          </div>
          {errors.stock && <small className="error">{errors.stock}</small>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
