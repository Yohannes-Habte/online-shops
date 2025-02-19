import { useState, useCallback } from "react";
import { FaAddressCard } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { Country, State, City } from "country-state-city";
import { RiFileZipFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { updateUserAddress } from "../../../redux/actions/user";
import "./NewAddress.scss";

// Initial state for form inputs
const initialState = {
  country: "",
  state: "",
  city: "",
  streetName: "",
  houseNumber: "",
  zipCode: "",
  addressType: "",
};

const NewAddress = ({ setOpenNewAddress }) => {
  const dispatch = useDispatch();
  const [newAddress, setNewAddress] = useState(initialState);
  const [errors, setErrors] = useState({});

  const {
    country,
    state,
    city,
    streetName,
    houseNumber,
    zipCode,
    addressType,
  } = newAddress;

  // Handle Input Change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setNewAddress((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  // Form Validation
  const validateAddressForm = () => {
    const validationErrors = {};
    if (!country) validationErrors.country = "Country is required";
    if (!state) validationErrors.state = "State is required";
    if (!city) validationErrors.city = "City is required";
    if (!streetName) validationErrors.streetName = "Street name is required";
    if (!houseNumber) validationErrors.houseNumber = "House number is required";
    if (!zipCode || isNaN(zipCode))
      validationErrors.zipCode = "Valid zip code is required";
    if (!addressType) validationErrors.addressType = "Address type is required";
    return validationErrors;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    const validationErrors = validateAddressForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      dispatch(updateUserAddress(newAddress));
      setNewAddress(initialState);
      setOpenNewAddress(false);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  return (
    <div className="user-address-modal">
      <section className="add-new-address-popup">
        {/* Close Button */}
        <RxCross1
          className="address-close-icon"
          onClick={() => setOpenNewAddress(false)}
        />

        <h2 className="new-address-title">Add New Address</h2>

        <form onSubmit={handleSubmit} className="form-address">
          {/* Country Selection */}
          <div className="select-container">
            <label htmlFor="country" className="label">
              Country:
            </label>
            <select
              name="country"
              id="country"
              value={country}
              onChange={handleChange}
              className="select-options"
            >
              <option value="">Choose your country</option>
              {Country.getAllCountries().map(({ isoCode, name }) => (
                <option key={isoCode} value={isoCode}>
                  {name}
                </option>
              ))}
            </select>
            {errors.country && (
              <span className="input-field-error">{errors.country}</span>
            )}
          </div>

          {/* State Selection */}
          <div className="select-container">
            <label htmlFor="state" className="label">
              State:
            </label>
            <select
              name="state"
              id="state"
              value={state}
              onChange={handleChange}
              className="select-options"
            >
              <option value="">Choose your state</option>
              {State.getStatesOfCountry(country).map(({ isoCode, name }) => (
                <option key={isoCode} value={isoCode}>
                  {name}
                </option>
              ))}
            </select>
            {errors.state && (
              <span className="input-field-error">{errors.state}</span>
            )}
          </div>

          {/* City Selection */}
          <div className="select-container">
            <label htmlFor="city" className="label">
              City:
            </label>
            <select
              name="city"
              id="city"
              value={city}
              onChange={handleChange}
              className="select-options"
            >
              <option value="">Choose your city</option>
              {City.getCitiesOfState(country, state).map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {errors.city && (
              <span className="input-field-error">{errors.city}</span>
            )}
          </div>

          {/* Address Type */}
          <div className="select-container">
            <label htmlFor="addressType" className="label">
              Address Type:
            </label>
            <select
              name="addressType"
              id="addressType"
              value={addressType}
              onChange={handleChange}
              className="select-options"
            >
              <option value="">Choose Address Type</option>
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Business">Business</option>
            </select>
            {errors.addressType && (
              <span className="input-field-error">{errors.addressType}</span>
            )}
          </div>

          {/* Street Name */}
          <div className="input-container">
            <FaAddressCard className="icon" />
            <input
              type="text"
              name="streetName"
              id="streetName"
              value={streetName}
              onChange={handleChange}
              placeholder="Street Name"
              className="input-field"
            />
            {errors.streetName && (
              <span className="input-field-error">{errors.streetName}</span>
            )}
          </div>

          {/* House Number */}
          <div className="input-container">
            <FaAddressCard className="icon" />
            <input
              type="number"
              name="houseNumber"
              id="houseNumber"
              value={houseNumber}
              onChange={handleChange}
              placeholder="House Number"
              className="input-field"
            />
            {errors.houseNumber && (
              <span className="input-field-error">{errors.houseNumber}</span>
            )}
          </div>

          {/* Zip Code */}
          <div className="input-container">
            <RiFileZipFill className="icon" />
            <input
              type="number"
              name="zipCode"
              id="zipCode"
              value={zipCode}
              onChange={handleChange}
              placeholder="Enter Zip Code"
              className="input-field"
            />
            {errors.zipCode && (
              <span className="input-field-error">{errors.zipCode}</span>
            )}
          </div>

          <button type="submit" className="address-btn">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default NewAddress;
