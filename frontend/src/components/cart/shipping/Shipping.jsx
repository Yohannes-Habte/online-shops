import "./Shipping.scss";
import { Country, State, City } from "country-state-city";
import { FaAddressCard, FaPhoneSquareAlt, FaUserTie } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiFileZipFill } from "react-icons/ri";

const Shipping = ({
  user,
  formData,
  handleInputChange,
  errors,
  proceedToPayment,
  loading,
}) => {
  const { address, zipCode, country, state, city, phoneNumber } = formData;

  return (
    <section className="shipping-address-wrapper">
      <h3 className="shopping-address-title">Shipping Address</h3>

      <form className="shipping-address-form">
        {/* Name */}
        <div className="input-container">
          <FaUserTie className="icon" />
          <input
            type="text"
            value={user && user?.name}
            readOnly
            className="input-field"
          />
          <label className="input-label">Full Name</label>
        </div>

        {/* Email */}
        <div className="input-container">
          <MdEmail className="icon" />
          <input
            type="email"
            value={user && user?.email}
            readOnly
            className="input-field"
          />
          <label className="input-label">Email Address</label>
        </div>

        {/* Phone */}
        <div className={`input-container ${errors.phoneNumber && "error"}`}>
          <FaPhoneSquareAlt className="icon" />
          <input
            type="number"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter Phone Number"
            className="input-field"
          />
          {errors.phoneNumber && <small>{errors.phoneNumber}</small>}
        </div>

        {/* Zip Code */}
        <div className={`input-container ${errors.zipCode && "error"}`}>
          <RiFileZipFill className="icon" />
          <input
            type="number"
            name="zipCode"
            value={zipCode}
            onChange={handleInputChange}
            placeholder="Enter Zip Code"
            className="input-field"
          />
          {errors.zipCode && <small>{errors.zipCode}</small>}
        </div>

        {/* Address */}
        <div className={`input-container ${errors.address && "error"}`}>
          <FaAddressCard className="icon" />
          <input
            type="text"
            name="address"
            value={address}
            onChange={handleInputChange}
            placeholder="Address"
            className="input-field"
          />
          {errors.address && <small>{errors.address}</small>}
        </div>

        {/* Country */}
        <div className="select-container">
          <select
            name="country"
            value={country}
            onChange={handleInputChange}
            className="select-options"
          >
            <option value="">Choose your country</option>
            {Country.getAllCountries().map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.country && <small>{errors.country}</small>}
        </div>

        {/* State */}
        <div className="select-container">
          <select
            name="state"
            value={state}
            onChange={handleInputChange}
            className="select-options"
          >
            <option value="">Choose your state</option>
            {State.getStatesOfCountry(country).map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.state && <small>{errors.state}</small>}
        </div>

        {/* City */}
        <div className="select-container">
          <select
            name="city"
            value={city}
            onChange={handleInputChange}
            className="select-options"
          >
            <option value="">Choose your city</option>
            {City.getCitiesOfCountry(country).map((ci) => (
              <option key={ci.isoCode} value={ci.name}>
                {ci.name}
              </option>
            ))}
          </select>
          {errors.city && <small>{errors.city}</small>}
        </div>
      </form>
      <button
        onClick={proceedToPayment}
        className="proceed-payment-btn"
        disabled={loading} // Disable button if loading
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </section>
  );
};

export default Shipping;
