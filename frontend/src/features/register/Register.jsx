import { useEffect, useState } from "react";
import "./Register.scss";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible } from "react-icons/ai";
import { HiOutlineEye } from "react-icons/hi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { validEmail, validPassword } from "../../utils/validators/Validate.js";
import { API } from "../../utils/security/secreteKey.js";
import Cookies from "js-cookie";
import {
  userSignUpFailure,
  userSignUpStart,
  userSignUpSuccess,
} from "../../redux/reducers/userReducer.js";
import { handleError } from "../../utils/errorHandler/ErrorMessage.jsx";
import ButtonLoader from "../../utils/loader/ButtonLoader.jsx";
import GoogleSignupLogin from "../../components/layouts/googleRegisterLongin/GoogleSignupLogin.jsx";

const initialState = {
  name: "",
  email: "",
  password: "",
  showPassword: false,
  agree: false,
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Global state variables
  const { currentUser, loading } = useSelector((state) => state.user);

  // Local state variables
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const { name, email, password, showPassword, agree } = formData;

  // Redirect user if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Validate inputs// Validate inputs
  const validateInputs = () => {
    const newErrors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validEmail(email)) {
      newErrors.email = "Invalid email address.";
    }

    // Validate password
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (!validPassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.";
    }

    // Validate agreement
    if (!agree) {
      newErrors.agree = "You must agree to the terms of use.";
    }

    // Set errors in state
    setErrors(newErrors);

    // Return validation status
    return Object.keys(newErrors).length === 0;
  };

  // Reset form variables
  const resetVariables = () => {
    setFormData(initialState);
    setErrors({});
  };

  // Submit user registration
  const submitRegisterUser = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      dispatch(userSignUpStart());

      const newUser = { name, email, password, agree };

      const { data } = await axios.post(`${API}/auth/register`, newUser, {
        withCredentials: true,
      });

      dispatch(userSignUpSuccess(data.user));

      // Store token in cookies
      Cookies.set("token", data.token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });

      toast.success("Account created successfully!");
      resetVariables();
      navigate("/login");
    } catch (err) {
      const { message } = handleError(err);
      dispatch(userSignUpFailure(message));
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={submitRegisterUser}
      encType="multipart/form-data"
      className="register-form"
    >
      <div className="input-container">
        <FaUserAlt className="icon" />
        <input
          type="text"
          name="name"
          id="name"
          autoComplete="name"
          value={name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="input-field"
        />
        <label htmlFor="name" className="input-label">
          Full Name
        </label>
      </div>
      {errors.name && <small className="error-text">{errors.name}</small>}

      <div className="input-container">
        <MdEmail className="icon" />
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="input-field"
        />
        <label htmlFor="email" className="input-label">
          Email Address
        </label>
      </div>
      {errors.email && <small className="error-text">{errors.email}</small>}

      <div className="input-container">
        <RiLockPasswordFill className="icon" />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="input-field"
        />
        <label htmlFor="password" className="input-label">
          Password
        </label>
        <span
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              showPassword: !prev.showPassword,
            }))
          }
          className="password-display"
        >
          {showPassword ? <AiFillEyeInvisible /> : <HiOutlineEye />}
        </span>
      </div>
      {errors.password && (
        <small className="error-text">{errors.password}</small>
      )}

      <div className="register-consent-container">
        <div className="register-consent">
          <input
            type="checkbox"
            name="agree"
            id="agree"
            checked={agree}
            onChange={handleChange}
            className="register-consent-checkbox"
          />
          <span className="accept">I accept</span>
          <NavLink to="/terms" className="terms-of-use">
            Terms of Use
          </NavLink>
        </div>

        {errors.agree && <small className="error-text">{errors.agree}</small>}
      </div>

      <div className="register-button-container">
        <button type="submit" disabled={loading} className="register-button">
          {loading ? <ButtonLoader /> : "Sign Up"}
        </button>
      </div>

      <GoogleSignupLogin signup="signup" />

      <p className="have-account">
        Already have an account?{" "}
        <NavLink to="/login" className="link-to-login">
          Log In
        </NavLink>
      </p>
    </form>
  );
};

export default Register;
