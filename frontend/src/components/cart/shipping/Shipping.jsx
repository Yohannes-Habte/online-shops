import React from 'react';
import './Shipping.scss';
import { Country, State, City } from 'country-state-city';
import { FaAddressCard, FaPhoneSquareAlt, FaUserTie } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiFileZipFill } from 'react-icons/ri';
import { toast } from 'react-toastify';

const Shipping = ({
  user,
  country,
  setCountry,
  state,
  setState,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address,
  setAddress,
  zipCode,
  setZipCode,
  updateChange,
}) => {
  return (
    <section className="shipping-wrapper">
      <h3 className="subTitle">Shipping Address</h3>

      <form className="shipping-form">
        {/*  name */}
        <div className="input-container">
          <FaUserTie className="icon" />
          <input
            type="text"
            value={user && user.name}
            required
            className="input-field"
          />
          <label htmlFor="name" className="input-label">
            Full Name
          </label>
          <span className="input-highlight"></span>
        </div>

        {/*  email */}
        <div className="input-container">
          <MdEmail className="icon" />
          <input
            type="email"
            value={user && user.email}
            required
            className="input-field"
          />
          <label htmlFor="email" className="input-label">
            Email Address
          </label>
          <span className="input-highlight"></span>
        </div>

        {/*  phone */}
        <div className="input-container">
          <FaPhoneSquareAlt className="icon" />
          <input
            type="number"
            required
            value={user && user.phone}
            className="input-field"
          />
          <label htmlFor="phone" className="input-label">
            Phone Number
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Zip Code */}
        <div className="input-container">
          <RiFileZipFill className="icon" />
          <input
            type="number"
            name={zipCode}
            id={zipCode}
            autoComplete="zipCode"
            required
            value={zipCode}
            onChange={updateChange}
            placeholder="Enter Zip Code"
            className="input-field"
          />

          <label htmlFor={zipCode} className="input-label">
            Zip Code
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Address */}
        <div className="input-container">
          <FaAddressCard className="icon" />
          <input
            type="text"
            name={'address'}
            id={'address'}
            autoComplete="address1"
            required
            value={address}
            onChange={updateChange}
            placeholder="Address 1"
            className="input-field"
          />

          <label htmlFor={'address'} className="input-label">
            Address
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Choose Country using select */}
        <div className="select-container">
          <select
            name="country"
            id="country"
            value={country}
            onChange={updateChange}
            className="select-options"
          >
            <option value=""> Choose your country </option>
            {Country &&
              Country.getAllCountries().map((country) => (
                <option
                  className="option"
                  key={country.isoCode}
                  value={country.isoCode}
                >
                  {country.name}
                </option>
              ))}
          </select>
        </div>

        {/* Choose State using select */}
        <div className="select-container">
          <select
            name="state"
            id="state"
            value={state}
            onChange={updateChange}
            className="select-options"
          >
            <option value=""> Choose your state </option>
            {State &&
              State.getStatesOfCountry(country).map((item) => (
                <option
                  className="option"
                  key={item.isoCode}
                  value={item.isoCode}
                >
                  {item.name}
                </option>
              ))}
          </select>
        </div>

        {/* Choose City using select */}
        <div className="select-container">
          <select
            name="city"
            id="city"
            value={city}
            onChange={updateChange}
            className="select-options"
          >
            <option value=""> Choose your city </option>
            {City &&
              City.getCitiesOfCountry(country).map((item) => (
                <option
                  className="option"
                  key={item.isoCode}
                  value={item.isoCode}
                >
                  {item.name}
                </option>
              ))}
          </select>
        </div>
      </form>

      <h3 className="saved-address" onClick={() => setUserInfo(!userInfo)}>
        Choose From saved address{' '}
      </h3>

      {userInfo && (
        <div className="user-infos-wrapper">
          {user &&
            user.addresses.map((item) => (
              <article className="address-info">
                <input
                  type="checkbox"
                  className="input-checkbox"
                  value={item.addressType}
                  onClick={() =>
                    setAddress(item.address) ||
                    setZipCode(item.zipCode) ||
                    setCountry(item.country) ||
                    setState(item.state) ||
                    setCity(item.city) ||
                    setZipCode(item.zipCode)
                  }
                />

                <h3 className="address-type">{item.addressType}</h3>
              </article>
            ))}
        </div>
      )}
    </section>
  );
};

export default Shipping;
