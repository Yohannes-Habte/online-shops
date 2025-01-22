import { useEffect, useState } from "react";
import "./Login.scss";
import axios from "axios";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validEmail, validPassword } from "../../../utils/validators/Validate";
import { toast } from "react-toastify";
import ButtonLoader from "../../../utils/loader/ButtonLoader";
import { API } from "../../../utils/security/secreteKey";
import GoogleSignupLogin from "../../../components/userLayout/googleRegisterLongin/GoogleSignupLogin";
import Cookies from "js-cookie";
import {
  clearErrors,
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../../redux/reducers/userReducer";

const initialState = {
  email: "",
  password: "",
  showPassword: false,
  rememberMe: false,
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const { email, password, showPassword, rememberMe } = formData;

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const resetHandler = () => {
    setFormData(initialState);
    setErrors({});
  };

  // Handle input changes
  const changeHandler = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear the associated error message, if any
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const formErrors = {};

    // Email validation
    if (!email) {
      formErrors.email = "Email is required.";
    } else if (!validEmail(email)) {
      formErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!password) {
      formErrors.password = "Password is required.";
    } else if (password.length < 8) {
      formErrors.password = "Password must be at least 8 characters long.";
    } else if (!validPassword(password)) {
      formErrors.password = "Please enter a valid password.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Return true if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      dispatch(loginStart());
      const loginUser = { email, password, rememberMe };
      const res = await axios.post(`${API}/auth/login`, loginUser, {
        withCredentials: true,
      });

      dispatch(loginSuccess(res.data.user));
      toast.success(res.data.message);

      const token = res.data?.token;
      Cookies.set("token", token, {
        expires: rememberMe ? 30 : 1,
        secure: true, // This should be true if served over HTTPS
        sameSite: "strict",
      });

      resetHandler();
      navigate("/");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  return (
    <section className="login-container">
      <h3 className="login-title">Login</h3>
      <form onSubmit={handleSubmit} className="login-form">
        {/* Email input container */}
        <div className="input-container">
          <MdEmail className="icon" />
          <input
            type="email"
            name="email"
            value={email}
            onChange={changeHandler}
            placeholder="Enter Email"
            className="input-field"
            aria-label="Email Address"
          />
          <label htmlFor="email" className="input-label">
            Email Address
          </label>
          <span className="input-highlight"></span>
          {errors.email && (
            <p className="input-error-message">{errors.email}</p>
          )}
        </div>

        {/* Password input container */}
        <div className="input-container">
          <RiLockPasswordFill className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={changeHandler}
            placeholder="Enter Password"
            className="input-field"
            aria-label="Password"
          />
          <label htmlFor="password" className="input-label">
            Password
          </label>
          <span className="input-highlight"></span>
          {errors.password && (
            <p className="input-error-message">{errors.password}</p>
          )}
        </div>

        {/* Show or hide Password input container */}
        <div className="show-password-container">
          <input
            type="checkbox"
            id="showPassword"
            name="showPassword"
            checked={showPassword}
            onChange={changeHandler}
            className="show-password-checkbox"
          />
          <label htmlFor="showPassword" className="show-password-label">
            Show Password
          </label>
        </div>

        {/* Log in remember me and forgot password */}
        <div className="login-checkbox-forgot-password-container">
          <div className="login-checkbox-keep-signed-in-wrapper">
            <input
              type="checkbox"
              name="rememberMe"
              checked={rememberMe}
              onChange={changeHandler}
              className="login-checkbox"
            />
            <span className="keep-me-sign-in">Keep me signed in</span>
          </div>
          <Link className="forgot-password" to={"/forgot-password"}>
            Forgot your password?
          </Link>
        </div>

        {/* Button for log in form */}
        <button className="login-button" disabled={loading}>
          {loading ? <ButtonLoader isLoading={loading} message="" /> : "Log In"}
        </button>

        <GoogleSignupLogin signup="login" />

        {/* Do not have an account, Sign Up */}
        <p className="have-no-account">
          {"Don't have an account?"}
          <Link className="sign-up" to="/signup">
            Sign Up
          </Link>
        </p>
        {error && <p className="error-message">{error}</p>}
      </form>
    </section>
  );
};
export default Login;
