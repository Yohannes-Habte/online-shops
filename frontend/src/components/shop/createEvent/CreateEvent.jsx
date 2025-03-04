import { useState, useRef, useEffect } from "react";
import "./CreateEvent.scss";
import {
  MdEvent,
  MdDescription,
  MdLabel,
  MdCloudUpload,
  MdAttachMoney,
  MdEventAvailable,
  MdCheckBox,
  MdCategory,
} from "react-icons/md";

import { Package, Ruler, Palette } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  API,
  cloud_URL,
  cloud_name,
  upload_preset,
} from "../../../utils/security/secreteKey";
import { toast } from "react-toastify";
import { createNewEvent } from "../../../redux/actions/event";

// Initial state
const initialState = {
  title: "",
  description: "",
  tags: [], // Array separated by commas
  originalPrice: "",
  discountPrice: "",

  images: [],
  stockLevels: [], // Array separated by commas
  sizes: [], // Array separated by commas
  colors: [], // Array separated by commas

  startDate: "",
  endDate: "",
  purposes: [],

  category: "",
  subcategory: "",
  brand: "",
  supplier: "",
};

const CreateEvent = () => {
  const startingDateRef = useRef();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.event);
  const { currentSeller } = useSelector((state) => state.seller);

  // Local state
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  console.log("formData", formData);

  const eventPurposeOptions = [
    "Selling affordable, durable shoes",
    "Selling affordable, durable handbags",
    "Selling affordable, durable clothing",
    "Selling affordable, durable accessories",
    "Selling affordable, durable electronics",
    "Selling affordable, long-lasting perfumes",
    "Buying quality, budget-friendly shoes",
    "Buying quality, budget-friendly handbags",
    "Buying quality, budget-friendly clothing",
    "Buying quality, budget-friendly accessories",
    "Buying quality, budget-friendly electronics",
    "Buying quality, long-lasting perfumes",
  ];

  // Toggle checkbox dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await axios.get(`${API}/${endpoint}`, {
          withCredentials: true,
        });
        setter(response.data[endpoint]);
      } catch (error) {
        toast.error(`Failed to load ${endpoint}`);
      }
    };

    fetchData("categories", setCategories);
    fetchData("subcategories", setSubcategories);
    fetchData("brands", setBrands);
    fetchData("suppliers", setSuppliers);
  }, []);

  // Handle input changes
  const updateChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...Array.from(files)],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    // Clear errors when user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Handle selection
  const handlePurposeChange = (purpose) => {
    setFormData((prevData) => {
      const updatedPurposes = prevData.purposes.includes(purpose)
        ? prevData.purposes.filter((p) => p !== purpose) // Remove if already selected
        : [...prevData.purposes, purpose]; // Add if not selected

      return { ...prevData, purposes: updatedPurposes };
    });

    // Clear errors when user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, purposes: "" }));
  };

  // Handle date changes
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    const minEndDate = new Date(newStartDate);
    minEndDate.setDate(minEndDate.getDate() + 2); // Enforce min 3-day gap

    setFormData((prevData) => ({
      ...prevData,
      startDate: newStartDate,
      endDate: "", // Reset endDate when startDate changes
    }));

    startingDateRef.current.min = minEndDate.toISOString(); // Ensure correct format

    // Clear errors when user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, startDate: "" }));
  };

  const handleEndDateChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      endDate: e.target.value, // Store as string
    }));

    // Clear errors when user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, endDate: "" }));
  };

  // Validate input fields
  const validateEventForm = () => {
    const errorMessage = {};
    const MAX_IMAGE_SIZE = 1048576; // 1MB
    const MAX_IMAGE_COUNT = 10;
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

    // Title validation
    if (!formData.title.trim()) {
      errorMessage.title = "Event title is required.";
    } else if (formData.title.length < 5) {
      errorMessage.title = "Event title must be at least 5 characters.";
    } else if (formData.title.length > 100) {
      errorMessage.title = "Event title must not exceed 100 characters.";
    }

    // Category validation
    if (!formData.category) errorMessage.category = "Category is required.";

    // Subcategory validation
    if (!formData.subcategory)
      errorMessage.subcategory = "Subcategory is required.";

    // Brand validation
    if (!formData.brand) errorMessage.brand = "Brand is required.";

    // Supplier validation
    if (!formData.supplier) errorMessage.supplier = "Supplier is required.";

    // Validate tags
    if (!formData.tags.length) {
      errorMessage.tags = "Tags are required.";
    }

    // Price validations
    if (!formData.originalPrice.trim() || isNaN(formData.originalPrice)) {
      errorMessage.originalPrice = "A valid original price is required.";
    }
    if (!formData.discountPrice.trim() || isNaN(formData.discountPrice)) {
      errorMessage.discountPrice = "A valid discount price is required.";
    } else if (
      parseFloat(formData.discountPrice) >= parseFloat(formData.originalPrice)
    ) {
      errorMessage.discountPrice =
        "Discount price must be less than the original price.";
    }

    // Ensure formData.images is an array
    if (!Array.isArray(formData.images) || formData.images.length === 0) {
      errorMessage.images = "At least one valid image is required.";
    } else if (formData.images.length > MAX_IMAGE_COUNT) {
      errorMessage.images = `A maximum of ${MAX_IMAGE_COUNT} images are allowed.`;
    } else {
      const invalidImage = formData.images.find(
        (image) =>
          !image ||
          !image.size || // Check if image object has a valid size
          image.size > MAX_IMAGE_SIZE ||
          !ALLOWED_IMAGE_TYPES.includes(image.type)
      );
      if (invalidImage) {
        errorMessage.images =
          "Each image must be a JPEG, PNG, or WebP file and not exceed 1MB.";
      }
    }

    // Ensure formData.stockLevels is an array
    if (
      !Array.isArray(formData.stockLevels) ||
      formData.stockLevels.length === 0
    ) {
      errorMessage.stockLevels = "Valid stock quantities are required.";
    } else if (formData.stockLevels.length !== formData.images.length) {
      errorMessage.stockLevels = `Stock levels count (${formData.stockLevels.length}) must match the number of images (${formData.images.length}).`;
    }

    // Size validation
    if (!formData.sizes.length) {
      errorMessage.sizes = "Valid size is required.";
    }

    // Color validation
    if (!formData.colors.length) {
      errorMessage.colors = "Valid color is required.";
    }

    // Date validation
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize 'now' to avoid time issues

    const startDate = formData.startDate;
    const endDate = formData.endDate;

    if (!startDate) {
      errorMessage.startDate = "Start date is required.";
    } else if (startDate < now) {
      errorMessage.startDate = "Start date must be in the future.";
    }

    if (!endDate) {
      errorMessage.endDate = "End date is required.";
    } else if (endDate < now) {
      errorMessage.endDate = "End date must be in the future.";
    } else if (endDate < startDate) {
      errorMessage.endDate = "End date must be after the start date.";
    }

    // Purpose validation
    if (!formData.purposes.length) {
      errorMessage.purposes = "At least one purpose is required.";
    } else if (formData.purposes.length > 5) {
      errorMessage.purposes = "A maximum of 5 purposes are allowed.";
    }

    // Description validation
    if (!formData.description.trim()) {
      errorMessage.description = "Description is required.";
    } else if (formData.description.length < 500) {
      errorMessage.description = "Description must be at least 500 characters.";
    } else if (formData.description.length > 1000) {
      errorMessage.description = "Description must not exceed 1000 characters.";
    }

    setErrors(errorMessage);
    return Object.keys(errorMessage).length === 0;
  };

  // Reset form
  const resetEventForm = () => {
    setFormData(initialState);
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEventForm()) return;

    // Upload images to Cloudinary
    const uploadPromises = formData.images.map(async (image) => {
      const imageData = new FormData();
      imageData.append("file", image);
      imageData.append("upload_preset", upload_preset);
      imageData.append("cloud_name", cloud_name);

      const response = await axios.post(cloud_URL, imageData);
      return response.data.url;
    });

    const imageUrls = await Promise.all(uploadPromises);

    // Prepare event data
    const newEvent = {
      ...formData,
      images: imageUrls,
      shop: currentSeller._id,
    };

    // Send data to API
    await dispatch(createNewEvent(newEvent));
    resetEventForm();
  };

  return (
    <section className="create-event-wrapper">
      <h5 className="create-event-title">Create Event</h5>
      {error && <p className="create-event-error">{error}</p>}
      <form onSubmit={handleSubmit} className="create-event-form">
        <div className="event-form-inputs-wrapper">
          {/* Event Name */}
          <div className="input-container">
            <MdEvent className="icon" />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={updateChange}
              placeholder="Enter Event Name"
              className="input-field"
            />
            {errors.title && (
              <span className="input-field-error">{errors.title}</span>
            )}
          </div>

          {/* Tags */}
          <div className="input-container">
            <MdLabel className="icon" />
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value.split(",").map((tag) => tag.trim()),
                })
              }
              placeholder="Enter Tags (comma separated)"
              className="input-field"
            />
            {errors.tags && (
              <span className="input-field-error">{errors.tags}</span>
            )}
          </div>

          {/* Image Upload */}
          <div className="file-container">
            <label htmlFor="images" className="file-label">
              <MdCloudUpload className="icon" /> Upload Images
            </label>
            <input
              type="file"
              name="images"
              multiple
              onChange={updateChange}
              className="input-file-field"
            />
            {errors.images && (
              <span className="input-field-error">{errors.images}</span>
            )}
          </div>

          {/* Stock Levels */}
          <div className="input-container">
            <Package className="icon" />
            <input
              type="text"
              name="stockLevels"
              value={formData.stockLevels}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stockLevels: e.target.value
                    .split(",")
                    .map((level) => level.trim()),
                })
              } // Convert to array of objects
              placeholder="Enter Stock Quantity (comma separated)"
              disabled={formData.images.length === 0}
              className={`input-field ${
                formData.images.length ? "" : "input-field-disabled"
              }`}
            />

            {errors.stockLevels && (
              <span className="input-field-error">{errors.stockLevels}</span>
            )}
          </div>

          {/* Sizes */}
          <div className="input-container">
            <Ruler className="icon" />
            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sizes: e.target.value.split(",").map((size) => size.trim()),
                })
              } // Convert to array of objects
              placeholder="Enter Sizes (comma separated)"
              disabled={
                formData.images.length === 0 &&
                formData.stockLevels.length === 0
              }
              className={`input-field ${
                formData.images.length && formData.stockLevels.length
                  ? ""
                  : "input-field-disabled"
              }`}
            />
            {errors.sizes && (
              <span className="input-field-error">{errors.sizes}</span>
            )}
          </div>

          {/* Colors */}
          <div className="input-container">
            <Palette className="icon" />
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  colors: e.target.value
                    .split(",")
                    .map((color) => color.trim()),
                })
              }
              placeholder="Enter Colors (comma separated)"
              disabled={
                formData.images.length === 0 &&
                formData.stockLevels.length === 0 &&
                formData.sizes.length === 0
              }
              className={`input-field ${
                formData.images.length &&
                formData.stockLevels.length &&
                formData.sizes.length
                  ? ""
                  : "input-field-disabled"
              }`}
            />

            {errors.colors && (
              <span className="input-field-error">{errors.colors}</span>
            )}
          </div>

          {/* Original Price */}
          <div className="input-container">
            <MdAttachMoney className="icon" />
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={updateChange}
              placeholder="Original Price"
              className="input-field"
            />
            {errors.originalPrice && (
              <span className="input-field-error">{errors.originalPrice}</span>
            )}
          </div>

          {/* Discount Price */}
          <div className="input-container">
            <MdAttachMoney className="icon" />
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={updateChange}
              placeholder="Discount Price"
              disabled={formData.originalPrice === ""}
              className={`input-field ${
                formData.originalPrice ? "" : "input-field-disabled"
              }`}
            />
            {errors.discountPrice && (
              <span className="input-field-error">{errors.discountPrice}</span>
            )}
          </div>

          {/* Start Date */}
          <div className="input-container">
            <MdEventAvailable className="icon" />
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleStartDateChange}
              className="input-field"
            />
            {errors.startDate && (
              <span className="input-field-error">{errors.startDate}</span>
            )}
          </div>

          {/* End Date */}
          <div className="input-container">
            <MdEventAvailable className="icon" />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleEndDateChange}
              ref={startingDateRef}
              disabled={formData.startDate === ""}
              className={`input-field ${
                formData.startDate ? "" : "input-field-disabled"
              }`}
            />
            {errors.endDate && (
              <span className="input-field-error">{errors.endDate}</span>
            )}
          </div>

          {/* Event purposes */}
          <div className="input-container">
            <MdCheckBox className="icon" />
            <div className="dropdown">
              {/* Clickable input area */}
              <div className="dropdown-input" onClick={toggleDropdown}>
                {formData.purposes.length > 0
                  ? formData.purposes.join(", ")
                  : "Select purposes"}
              </div>

              {/* Dropdown checkbox list */}
              {showDropdown && (
                <div className="dropdown-list">
                  {eventPurposeOptions.map((purpose, index) => (
                    <label key={index} className="dropdown-item">
                      <input
                        type="checkbox"
                        name="purposes"
                        checked={formData.purposes.includes(purpose)}
                        onChange={() => handlePurposeChange(purpose)}
                        className="checkbox-field"
                      />
                      {purpose}
                    </label>
                  ))}
                </div>
              )}
            </div>
            {errors.purposes && (
              <span className="input-field-error">{errors.purposes}</span>
            )}
          </div>

          {/* Category */}
          <div className="input-container">
            <MdCategory className="icon" />
            <select
              name="category"
              value={formData.category}
              onChange={updateChange}
              className="input-field"
            >
              <option value="">Choose Event Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="input-field-error">{errors.category}</span>
            )}
          </div>

          {/* Subcategory */}
          <div className="input-container">
            <MdCategory className="icon" />
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={updateChange}
              className="input-field"
            >
              <option value="">Choose Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.subcategoryName}
                </option>
              ))}
            </select>

            {errors.subcategory && (
              <span className="input-field-error">{errors.subcategory}</span>
            )}
          </div>

          {/* Brand */}
          <div className="input-container">
            <MdCategory className="icon" />
            <select
              name="brand"
              value={formData.brand}
              onChange={updateChange}
              className="input-field"
            >
              <option value="">Choose Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.brandName}
                </option>
              ))}
            </select>

            {errors.brand && (
              <span className="input-field-error">{errors.brand}</span>
            )}
          </div>

          {/* Supplier */}
          <div className="input-container">
            <MdCategory className="icon" />
            <select
              name="supplier"
              value={formData.supplier}
              onChange={updateChange}
              className="input-field"
            >
              <option value="">Choose Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.supplierName}
                </option>
              ))}
            </select>
            {errors.supplier && (
              <span className="input-field-error">{errors.supplier}</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="textarea-container">
          <MdDescription className="textarea-icon" />
          <textarea
            name="description"
            value={formData.description}
            rows={5}
            cols={50}
            onChange={updateChange}
            placeholder="Enter Event Description"
            className="textarea-input-field"
          />
          {errors.description && (
            <span className="input-field-error">{errors.description}</span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading} className="create-event-btn">
          Submit
        </button>
      </form>
    </section>
  );
};

export default CreateEvent;
