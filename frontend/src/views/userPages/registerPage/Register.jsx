import React, { useEffect, useState } from 'react';
import './Register.scss';
import axios from 'axios';
import { FaUser, FaUserAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { HiOutlineEye } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import ButtonLoader from '../../../utils/loader/ButtonLoader.jsx';
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
import GoogleSignupLogin from '../../../components/userLayout/googleRegisterLongin/GoogleSignupLogin.jsx';

const Register = () => {
  const navigate = useNavigate();
  // Global state variables
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // If user is logged in, uer will not access the sign up page
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [navigate, currentUser]);

  // Local State variables
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  console.log('Image=', image);

  // Update image
  const updateImage = (e) => {
    setImage(e.target.files[0]);
  };

  // Deleting uploading image
  const deleteUploadingImage = () => {
    setImage(image.name === '');
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
      case 'phone':
        setPhone(e.target.value);
        break;
      case 'agree':
        setAgree(e.target.checked);
        break;
      default:
        break;
    }
  };

  // Reset input values
  const reset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setAgree(false);
    setError(false);
  };

  // Function to show/hide password
  const displayPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Submit logged in user Function
  const submitregisterUser = async (event) => {
    event.preventDefault();

    if (!validEmail(email)) {
      return toast.error('Please enter a valid email');
    }

    if (!validPassword(password)) {
      return toast.error(
        'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
      );
    }

    try {
      setLoading(true);
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
        phone: phone,
        image: url,
        agree: agree,
      };

      const { data } = await axios.post(`${API}/auths/register`, newUser);

      reset();
      navigate('/login');
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err.response.data.message);
    }
  };

  return (
    <main className="register-page">
      <Helmet>
        <title> Sign Up</title>
      </Helmet>

      <section className="register-container">
        {error ? <p className="error-message"> {error} </p> : null}
        <h1 className="register-title"> Create Free Account </h1>

        <figure className="image-container">
          {image ? (
            <img
              className="image"
              src={URL.createObjectURL(image)}
              alt={image}
            />
          ) : (
            <FaUser className="image" />
          )}
        </figure>

        <fieldset className="register-fieldset">
          <legend className="register-legend">Sign Up </legend>
          <form
            onSubmit={submitregisterUser}
            encType="multipart/form-data"
            className="register-form"
          >
            <div className="input-container">
              <FaUserAlt className="icon" />
              <input
                type="text"
                name={'name'}
                id={'name'}
                autoComplete="name"
                required
                value={name}
                onChange={updateChange}
                placeholder="Enter First Name and Last Name"
                className="input-field"
              />

              <label htmlFor={'firstName'} className="input-label">
                First Name
              </label>
              <span className="input-highlight"></span>
            </div>

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
                Email Address
              </label>
              <span className="input-highlight"></span>
            </div>

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
                //onBlur={checkPasswordFormat}
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

            {/* Phone number */}
            <div className="input-container">
              <MdEmail className="icon" />
              <input
                type="number"
                name="phone"
                id="phone"
                autoComplete="phone"
                required
                value={phone}
                onChange={updateChange}
                placeholder="Enter Phone Number"
                className="input-field"
              />
              <label htmlFor="phone" className="input-label">
                Phone Number
              </label>
              <span className="input-highlight"></span>
            </div>

            <div className="file-container">
              <RiLockPasswordFill className="icon" />
              <input
                type="file"
                name="image"
                id="image"
                onChange={updateImage}
                className="input-field"
              />
              <label htmlFor="image" className="file-label">
                {image ? (
                  <span className="uploading-image">
                    {image.name}{' '}
                    <IoClose
                      onClick={deleteUploadingImage}
                      className="image-close-icon"
                    />
                  </span>
                ) : (
                  'Upload Photo'
                )}
              </label>
            </div>

            <div className="register-consent">
              <input
                type="checkbox"
                name="agree"
                id="agree"
                checked={agree}
                onChange={updateChange}
                className="register-consent-checkbox"
              />
              <span className="accept">I accept</span>
              <NavLink className={'terms-of-user'}> Terms of Use</NavLink>
            </div>

            <button
              // onClick={handleClick}
              type="submit"
              disabled={loading}
              className="register-button"
            >
              {loading && <ButtonLoader />}
              {loading && <span> Loading...</span>}
              {!loading && <span>Sign Up</span>}
            </button>

            <GoogleSignupLogin signup={'signup'} />

            <p className="haveAccount">
              Already have an account?
              <NavLink to="/login" className={'link-to'}>
                Log In
              </NavLink>
            </p>
          </form>
        </fieldset>
      </section>
    </main>
  );
};

export default Register;
