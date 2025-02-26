import { useState, useRef, useEffect } from "react";
import "./CreateEvent.scss";
import {
  MdEvent,
  MdDescription,
  MdLabel,
  MdCloudUpload,
  MdAttachMoney,
  MdEventAvailable,
  MdInventory,
  MdCheckBox,
  MdCategory,
} from "react-icons/md";

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
  eventName: "",
  description: "",
  tags: [],
  images: [],
  originalPrice: "",
  discountPrice: "",
  startDate: "",
  endDate: "",
  stock: "",
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
  };

  // Handle selection
  const handlePurposeChange = (purpose) => {
    setFormData((prevData) => {
      const updatedPurposes = prevData.purposes.includes(purpose)
        ? prevData.purposes.filter((p) => p !== purpose) // Remove if already selected
        : [...prevData.purposes, purpose]; // Add if not selected

      return { ...prevData, purposes: updatedPurposes };
    });
  };

  // Handle date changes
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    const minEndDate = new Date(newStartDate);
    minEndDate.setDate(minEndDate.getDate() + 3); // Enforce min 3-day gap

    setFormData((prevData) => ({
      ...prevData,
      startDate: newStartDate,
      endDate: "", // Reset endDate when startDate changes
    }));

    startingDateRef.current.min = minEndDate.toISOString(); // Ensure correct format
  };

  const handleEndDateChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      endDate: e.target.value, // Store as string
    }));
  };

  // Validate input fields
  const validate = () => {
    let tempErrors = {};

    if (!formData.eventName) tempErrors.eventName = "Event name is required";
    if (!formData.category) tempErrors.category = "Category is required";
    if (!formData.originalPrice || isNaN(formData.originalPrice))
      tempErrors.originalPrice = "Valid original price is required";
    if (!formData.discountPrice || isNaN(formData.discountPrice))
      tempErrors.discountPrice = "Valid discount price is required";
    if (!formData.startDate) tempErrors.startDate = "Start date is required";
    if (!formData.endDate) tempErrors.endDate = "End date is required";
    if (!formData.stock || isNaN(formData.stock))
      tempErrors.stock = "Valid stock quantity is required";
    if (!formData.purposes) tempErrors.purposes = "Purpose is required";
    if (!formData.description)
      tempErrors.description = "Description is required";
    if (formData.images.length === 0)
      tempErrors.images = "At least one image is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Reset form
  const resetEventForm = () => {
    setFormData(initialState);
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

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
      <h5 className="title">Create Event</h5>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        {/* Event Name */}
        <div className="input-container">
          <MdEvent className="icon" />
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={updateChange}
            placeholder="Enter Event Name"
            className="input-field"
          />
          {errors.eventName && (
            <span className="error">{errors.eventName}</span>
          )}
        </div>

        {/* Description */}
        <div className="input-container">
          <MdDescription className="icon" />
          <textarea
            name="description"
            value={formData.description}
            onChange={updateChange}
            placeholder="Enter Event Description"
            className="input-field"
          />
          {errors.description && (
            <span className="error">{errors.description}</span>
          )}
        </div>

        {/* Tags */}
        <div className="input-container">
          <MdLabel className="icon" />
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={updateChange}
            placeholder="Enter Tags (comma separated)"
            className="input-field"
          />
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
          {errors.images && <span className="error">{errors.images}</span>}
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
            <span className="error">{errors.originalPrice}</span>
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
            className="input-field"
          />
          {errors.discountPrice && (
            <span className="error">{errors.discountPrice}</span>
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
            <span className="error">{errors.startDate}</span>
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
            className="input-field"
          />
          {errors.endDate && <span className="error">{errors.endDate}</span>}
        </div>

        {/* Stock */}
        <div className="input-container">
          <MdInventory className="icon" />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={updateChange}
            placeholder="Available Stock"
            className="input-field"
          />
          {errors.stock && <span className="error">{errors.stock}</span>}
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
          {errors.purposes && <span className="error">{errors.category}</span>}
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
          {errors.category && <span className="error">{errors.category}</span>}
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
