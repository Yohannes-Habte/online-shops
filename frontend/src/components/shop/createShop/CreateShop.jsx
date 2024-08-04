import { React, useState } from 'react';
import './ShopCreate.scss';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RxAvatar } from 'react-icons/rx';
import { HiOutlineEye } from 'react-icons/hi';
import { FaAddressCard, FaPhoneVolume, FaUserTie } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { MdDescription } from 'react-icons/md';
import {
  validEmail,
  validPassword,
} from '../../../utils/validators/Validate.js';
import {
  API,
  cloud_URL,
  cloud_name,
  upload_preset,
} from '../../../utils/security/secreteKey.js';
import ButtonLoader from '../../../utils/loader/ButtonLoader.jsx';

const ShopCreate = () => {
  const navigate = useNavigate();

  // Local state variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [image, setImage] = useState();
  const [description, setDescription] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Function to show/hide password
  const displayPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Update image
  const updateImage = (e) => {
    setImage(e.target.files[0]);
  };

  // Update input data
  const updateChange = (e) => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value);
        break;

      case 'email':
        setEmail(e.target.value);
        break;

      case 'password':
        setPassword(e.target.value);
        break;

      case 'phoneNumber':
        setPhoneNumber(e.target.value);
        break;

      case 'shopAddress':
        setShopAddress(e.target.value);
        break;

      case 'description':
        setDescription(e.target.value);
        break;

      case 'agree':
        setAgree(e.target.checked);
        break;

      default:
        break;
    }
  };

  // Reset input data
  const reset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setShopAddress('');
    setDescription('');
    setAgree(false);
  };

  // Submit created shop
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validEmail(email)) {
      return toast.error('Please enter a valid email');
    }

    if (!validPassword(password)) {
      return toast.error(
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
      );
    }
    setLoading(true);
    try {
      // Image validation
      const userPhoto = new FormData();
      userPhoto.append('file', image);
      userPhoto.append('cloud_name', cloud_name);
      userPhoto.append('upload_preset', upload_preset);

      // Save image to cloudinary
      const response = await axios.post(cloud_URL, userPhoto);
      const { url } = response.data;
      // The body
      const newUser = {
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        shopAddress: shopAddress,
        description: description,
        agree: agree,
        image: url,
      };

      const { data } = await axios.post(`${API}/shops/create-shop`, newUser);
      reset();
      navigate('/login-shop');
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <section className="create-shop-wrapper">
      <h1 className="title">Create Your Own Shop</h1>

      <form className="seller-signup-form" onSubmit={handleSubmit}>
        <figure className="image-container">
          <img
            className="image"
            src={
              image
                ? URL.createObjectURL(image)
                : 'https://i.ibb.co/4pDNDk1/avatar.png'
            }
            alt="Profile"
          />
        </figure>
        <p className="seller-profile"> Shop Profile </p>
        {/* name */}
        <div className="wrapper">
          <div className="input-container">
            <FaUserTie className="icon" />
            <input
              type="name"
              name="name"
              id="name"
              required
              value={name}
              onChange={updateChange}
              placeholder="Enter Shop name"
              className="input-field"
            />
            <label htmlFor="name" className="input-label">
              Shop Name
            </label>
            <span className="input-highlight"></span>
          </div>

          {/* email */}
          <div className="input-container">
            <MdEmail className="icon" />
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              value={email}
              onChange={updateChange}
              placeholder="Enter Email"
              className="input-field"
            />
            <label htmlFor="email" className="input-label">
              Email address
            </label>
            <span className="input-highlight"></span>
          </div>

          {/* password */}
          <div className="input-container">
            <RiLockPasswordFill className="icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={updateChange}
              placeholder="Enter Password"
              className="input-field"
            />
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <span className="input-highlight"></span>
            <span onClick={displayPassword} className="password-display">
              {showPassword ? <AiFillEyeInvisible /> : <HiOutlineEye />}
            </span>
          </div>

          {/* phone */}
          <div className="input-container">
            <FaPhoneVolume className="icon" />
            <input
              type="number"
              name="phoneNumber"
              id="phoneNumber"
              required
              value={phoneNumber}
              onChange={updateChange}
              placeholder="Enter Phone Number"
              className="input-field"
            />
            <label htmlFor="phoneNumber" className="input-label">
              Phone Number
            </label>
            <span className="input-highlight"></span>
          </div>

          {/* Shop address */}
          <div className="input-container">
            <FaAddressCard className="icon" />
            <input
              type="text"
              name="shopAddress"
              id="shopAddress"
              required
              value={shopAddress}
              onChange={updateChange}
              placeholder="Enter Address"
              className="input-field"
            />
            <label htmlFor="shopAddress" className="input-label">
              Shop Address
            </label>
            <span className="input-highlight"></span>
          </div>

          {/* image */}
          <div className="file-container">
            <label htmlFor="file-input" className="input-label">
              <label htmlFor="image" className="image-label">
                <RxAvatar className="icon" />
                Upload Photo
              </label>
              <input
                type="file"
                name="image"
                id="image"
                onChange={updateImage}
                className="input-field"
              />
            </label>
          </div>
        </div>

        <div className="input-container">
          <MdDescription className="icon" />
          <textarea
            name="description"
            id="description"
            cols="20"
            rows="6"
            value={description}
            onChange={updateChange}
            className="input-field"
          ></textarea>

          <label htmlFor="description" className="input-label">
            Shop Description
          </label>
          <span className="input-highlight"></span>
        </div>

        <div className="shop-register-consent">
          <input
            type="checkbox"
            name="agree"
            id="agree"
            checked={agree}
            onChange={updateChange}
            className="register-consent-input"
          />
          <span className="accept">I accept</span>
          <Link to={'/'} className={'terms-of-user'}>
            Terms of Use
          </Link>
        </div>

        <button type="submit" disabled={loading} className="create-shop-btn">
          {loading && <ButtonLoader />}
          {loading && <span>Loading...</span>}
          {!loading && <span>Submit</span>}
        </button>

        <article className={`already-have-account-wrapper`}>
          <p className="already-have-account">Already have an account?</p>
          <h3 className="sign-in">
            <Link to="/login-shop" className="link">
              Sign in
            </Link>
          </h3>
        </article>
      </form>
    </section>
  );
};

export default ShopCreate;
