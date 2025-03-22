import { useState, useEffect } from "react";
import "./ShopLogin.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { validEmail, validPassword } from "../../../utils/validators/Validate";
import {
  clearSellerErrors,
  loginShopOwner,
} from "../../../redux/actions/seller";
import Loader from "../../loader/Loader";

// Initial form state
const initialState = {
  email: "",
  password: "",
};

const ShopLogin = () => {
  const navigate = useNavigate();

  // Global state variables
  const { loading, error, currentSeller } = useSelector(
    (state) => state.seller
  );
  const dispatch = useDispatch();

  // Form data state
  const [formData, setFormData] = useState(initialState);
  const { email, password } = formData;

  // Error state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Redirect user if already logged in
  useEffect(() => {
    if (currentSeller) {
      navigate(`/shop/${currentSeller._id}`);
    }
  }, [currentSeller, navigate]);

  // Update input fields
  const updateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error for the specific field when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialState);
    setErrors({ email: "", password: "" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors before new login attempt
    dispatch(clearSellerErrors());

    // Validate fields and set errors
    let formIsValid = true;
    let newErrors = { email: "", password: "" };

    if (!validEmail(email)) {
      formIsValid = false;
      newErrors.email = "Please enter a valid email";
    }

    if (!validPassword(password)) {
      formIsValid = false;
      newErrors.password =
        "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    // If there are validation errors, set them and return
    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }

    // Prepare credentials
    const credentials = { email, password };

    // Dispatch login action
    dispatch(loginShopOwner(credentials));

    // Reset form after submission
    resetForm();

    // Redirect to user shop
    navigate(`/shop/${currentSeller._id}`);
  };

  useEffect(() => {
    dispatch(clearSellerErrors());
    return () => {
      dispatch(clearSellerErrors());
    };
  }, [dispatch]);

  return (
    <section className="shop-login-wrapper">
      <h2 className="title">Log in to your shop</h2>

      {/* Display error message if exists */}
      {error && <p className="error-message">{error}</p>}

      <form className="seller-login-form" onSubmit={handleSubmit}>
        {/* Profile Image */}
        <figure className="image-container">
          <img
            className="image"
            src={
              currentSeller
                ? currentSeller.image
                : "https://i.ibb.co/4pDNDk1/avatar.png"
            }
            alt="Profile"
          />
        </figure>
        <p className="seller-name">
          {currentSeller ? currentSeller.name : "Shop Profile"}
        </p>

        {/* Email Input */}
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
            aria-label="Email"
            autoFocus
          />
          <label htmlFor="email" className="input-label">
            Email address
          </label>
          <span className="input-highlight"></span>
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        {/* Password Input */}
        <div className="input-container">
          <RiLockPasswordFill className="icon" />
          <input
            type="password" // Always 'password' type for security
            name="password"
            id="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={updateChange}
            placeholder="Enter Password"
            className="input-field"
            aria-label="Password"
          />
          <label htmlFor="password" className="input-label">
            Password
          </label>
          <span className="input-highlight"></span>
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        {/* "Keep me logged in" and Forgot Password */}
        <div className="keep-me-login--and-forgot-password-wrapper">
          <div className="keep-me-login-wrapper">
            <input type="checkbox" name="login" className="login-checkbox" />
            <span className="keep-me-login">Keep me logged in</span>
          </div>

          <div className="forgot-password-wrapper">
            <Link className="link" to="/shop-forgot-password">
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading} className="shop-login-button">
          {loading && <Loader isLoading={loading} message="" size={20} />}
          {loading && <span>Logging in...</span>}
          {!loading && <span>Log In</span>}
        </button>

        {/* Sign Up Redirect */}
        <p className="haveNoAccount">
          Do not have an account?{" "}
          <NavLink to="/shop/create" className="link">
            Create Shop
          </NavLink>
        </p>
      </form>
    </section>
  );
};

export default ShopLogin;
