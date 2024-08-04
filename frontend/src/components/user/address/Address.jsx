import React, { useState } from 'react';
import './Address.scss';
import axios from 'axios';
import { FaAddressCard } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { Country, State, City } from 'country-state-city';
import { toast } from 'react-toastify';
import { RiFileZipFill } from 'react-icons/ri';
import { MdLocationPin } from 'react-icons/md';
import {
  deleteUserAddressFilure,
  deleteUserAddressStart,
  deleteUserAddressSuccess,
  updateUserAddressFilure,
  updateUserAddressStart,
  updateUserAddressSuccess,
} from '../../../redux/reducers/userReducer';
import { MdDelete } from 'react-icons/md';
import { API } from '../../../utils/security/secreteKey';

const Address = () => {
  // Global state variables
  const { currentUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Local state variables
  const [open, setOpen] = useState(false);
  const [addressType, setAddressType] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState();
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  // Address type
  const addressTypeData = [
    {
      name: 'Default',
    },
    {
      name: 'Home',
    },
    {
      name: 'Office',
    },
  ];

  // updateChange
  const updateChange = (e) => {
    switch (e.target.name) {
      case 'addressType':
        setAddressType(e.target.value);
        break;

      case 'address':
        setAddress(e.target.value);
        break;

      case 'zipCode':
        setZipCode(e.target.value);
        break;

      case 'city':
        setCity(e.target.value);
        break;

      case 'state':
        setState(e.target.value);
        break;

      case 'country':
        setCountry(e.target.value);
        break;

      default:
        break;
    }
  };

  // Reset variables
  const reset = () => {
    setOpen(false);
    setCountry('');
    setState('');
    setCity('');
    setAddress('');
    setZipCode(null);
    setAddressType('');
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (addressType === '' || country === '' || city === '') {
        toast.error('Please fill all the fields!');
      } else {
        dispatch(updateUserAddressStart());
        const newAddress = {
          country: country,
          state: state,
          city: city,
          address: address,
          zipCode: zipCode,
          addressType: addressType,
        };
        const { data } = await axios.put(
          `${API}/users/${currentUser._id}/update-user-address`,
          newAddress
        );

        dispatch(updateUserAddressSuccess(data.user));
        reset();
      }
    } catch (error) {
      dispatch(updateUserAddressFilure(error.response.data.message));
    }
  };

  // Delete user address
  const handleDelete = async (address) => {
    try {
      dispatch(deleteUserAddressStart());
      const { data } = await axios.delete(
        `${API}/users/delete-user-address/${address._id}`,

        { withCredentials: true }
      );
      dispatch(deleteUserAddressSuccess(data));
    } catch (error) {
      dispatch(deleteUserAddressFilure(error.response.data.message));
    }
  };

  return (
    <div className="addresses-wrapper">
      <div className="modal">
        {open && (
          <section className="new-address">
            <RxCross1
              className="address-close-icon"
              onClick={() => setOpen(false)}
            />
            <h2 className="new-address-title"> Add New Address </h2>

            <form onSubmit={handleSubmit} action="" className="form-address">
              {/* Choose Country using select */}
              <div className="select-container">
                <MdLocationPin className="select-icon" />
                <div className="select-label-wrapper">
                  <label htmlFor={'country'} className="label">
                    Country:
                  </label>
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
              </div>

              {/* Choose State using select */}
              <div className="select-container">
                <MdLocationPin className="select-icon" />
                <div className="select-label-wrapper">
                  <label htmlFor={'state'} className="label">
                    State:
                  </label>
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
              </div>

              {/* Choose City using select */}
              <div className="select-container">
                <MdLocationPin className="select-icon" />
                <div className="select-label-wrapper">
                  <label htmlFor={'city'} className="label">
                    City:
                  </label>
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
              </div>

              {/* Address type using select */}
              <div className="select-container">
                <MdLocationPin className="select-icon" />
                <div className="select-label-wrapper">
                  <label htmlFor={'addressType'} className="label">
                    Address Type:
                  </label>
                  <select
                    name="addressType"
                    id="addressType"
                    value={addressType}
                    onChange={updateChange}
                    className="select-options"
                  >
                    <option value=""> Choose Address Type </option>
                    {addressTypeData &&
                      addressTypeData.map((address) => (
                        <option
                          className="option"
                          key={address.name}
                          value={address.name}
                        >
                          {address.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Address 1 */}
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
                  placeholder="Address"
                  className="input-field"
                />

                <label htmlFor={'address'} className="input-label">
                  Address
                </label>
                <span className="input-highlight"></span>
              </div>

              {/* Zip Code */}
              <div className="input-container">
                <RiFileZipFill className="icon" />
                <input
                  type="number"
                  name={'zipCode'}
                  id={'zipCode'}
                  autoComplete="zipCode"
                  required
                  value={zipCode}
                  onChange={updateChange}
                  placeholder="Enter Zip Code"
                  className="input-field"
                />

                <label htmlFor={'zipCode'} className="input-label">
                  Zip Code
                </label>
                <span className="input-highlight"></span>
              </div>

              <button className="address-btn">Submit</button>
            </form>
          </section>
        )}
      </div>

      <section className="previous-address">
        {error && <h2 className="error"> {error} </h2>}
        <article className="title-add-new-address-wrapper">
          <h2 className="address-title">My Addresses</h2>
          <button onClick={() => setOpen(true)} className="add-new-address-btn">
            Add New Address
          </button>
        </article>

        {/* Table addresses */}

        <table className="table-address">
          <thead className="table-head">
            <tr className="head-row">
              <th className="head-cell"> Address Type</th>
              <th className="head-cell"> Address 1 </th>
              <th className="head-cell"> Address 2 </th>
              <th className="head-cell"> Phone </th>
              <th className="head-cell"> Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {currentUser &&
              currentUser.addresses &&
              currentUser.addresses.map((address) => {
                return (
                  <tr key={address._id} className="body-row">
                    <td className="body-cell"> {address.addressType} </td>
                    <td className="body-cell">
                      {address.address1} {address.zipCode}
                    </td>
                    <td className="body-cell">
                      {address.address2} {address.zipCode}
                    </td>
                    <td className="body-cell"> {currentUser.phone} </td>
                    <td className="body-cell">
                      <MdDelete
                        className="delete-icon"
                        onClick={() => handleDelete(address)}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {currentUser && currentUser.addresses.length === 0 && (
          <h5 className="subTitle">You do not have any saved address!</h5>
        )}
      </section>
    </div>
  );
};

export default Address;
