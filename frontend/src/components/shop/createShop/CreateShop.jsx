import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ShopCreate.scss";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaAddressCard, FaPhoneVolume, FaUserTie } from "react-icons/fa";
import { MdEmail, MdDescription } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import {
  validEmail,
  validPassword,
} from "../../../utils/validators/Validate.js";
import {
  cloud_URL,
  cloud_name,
  upload_preset,
} from "../../../utils/security/secreteKey.js";
import {
  clearSellerErrors,
  createNewShop,
} from "../../../redux/actions/seller.js";
import Loader from "../../loader/Loader.jsx";

const initialState = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  description: "",
  shopAddress: "",
  LogoImage: null,
  agree: false,
};

const ShopCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.seller);

  // Handle input change and image file upload
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear any existing error for the field being changed
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Shop name is required.";

    if (!validEmail(formData.email)) newErrors.email = "Invalid email.";

    if (!validPassword(formData.password))
      newErrors.password = "Invalid password";

    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required.";

    if (!formData.description)
      newErrors.description = "Description is required.";

    if (!formData.shopAddress.trim())
      newErrors.shopAddress = "Shop address is required.";

    if (!formData.LogoImage) newErrors.LogoImage = "Shop logo is required.";

    if (!formData.agree) newErrors.agree = "You must accept the Terms of Use.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let imageUrl = "";
      if (formData.LogoImage) {
        const formDataImage = new FormData();
        formDataImage.append("file", formData.LogoImage);
        formDataImage.append("upload_preset", upload_preset);
        formDataImage.append("cloud_name", cloud_name);

        const response = await fetch(cloud_URL, {
          method: "POST",
          body: formDataImage,
        });
        const data = await response.json();
        imageUrl = data.url;
      }

      const newShop = {
        ...formData,
        LogoImage: imageUrl,
      };

      // Dispatch the Redux action to create the shop
      dispatch(createNewShop(newShop));

      // Redirect to the shop login page on successful shop creation
      navigate("/shop/login");
    } catch (error) {
      toast.error("Failed to upload image or create shop.");
    }
  };

  // Clear errors on successful form submission or when the component unmounts
  useEffect(() => {
    // Clear errors when the form component is mounted
    dispatch(clearSellerErrors());

    return () => {
      // Optionally clear errors when the component unmounts (important for state resets)
      dispatch(clearSellerErrors());
    };
  }, [dispatch]);

  const {
    name,
    email,
    password,
    phoneNumber,
    shopAddress,
    description,
    LogoImage,
    agree,
  } = formData;

  return (
    <section className="create-shop-wrapper">
      <h1 className="title">Create Your Own Shop</h1>

      {/* Display error message from Redux state */}
      {error && <p className="error-message">{error}</p>}

      <form className="seller-signup-form" onSubmit={handleSubmit}>
        <figure className="image-container">
          <img
            className="image"
            src={
              LogoImage
                ? URL.createObjectURL(LogoImage)
                : "https://i.ibb.co/4pDNDk1/avatar.png"
            }
            alt="Profile"
          />
        </figure>
        <p className="seller-profile">Shop Profile</p>
        <div className="inputs-wrapper">
          <div className="input-container">
            <FaUserTie className="icon" />
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Shop Name"
              className="input-field"
              aria-label="Shop Name"
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="input-container">
            <MdEmail className="icon" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email"
              className="input-field"
              aria-label="Email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-container">
            <RiLockPasswordFill className="icon" />
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
              className="input-field"
              aria-label="Password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="input-container">
            <FaPhoneVolume className="icon" />
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="input-field"
              aria-label="Phone Number"
            />
            {errors.phoneNumber && (
              <p className="error">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="input-container">
            <FaAddressCard className="icon" />
            <input
              type="text"
              name="shopAddress"
              value={shopAddress}
              onChange={handleChange}
              placeholder="Shop Address"
              className="input-field"
              aria-label="Shop Address"
            />
            {errors.shopAddress && (
              <p className="error">{errors.shopAddress}</p>
            )}
          </div>

          <div className="file-container">
            <label htmlFor="LogoImage" className="image-label">
              <FaCloudUploadAlt className="icon" /> Upload Logo
            </label>
            <input
              className="file-input"
              type="file"
              name="LogoImage"
              id="LogoImage"
              onChange={handleChange}
            />
            {errors.LogoImage && <p className="error">{errors.LogoImage}</p>}
          </div>
        </div>

        <div className="input-container">
          <MdDescription className="icon" />
          <textarea
            name="description"
            rows={5}
            cols={30}
            value={description}
            onChange={handleChange}
            placeholder="Shop Description"
            className="input-field"
            aria-label="Shop Description"
          ></textarea>
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <div className="shop-register-consent">
          <input
            type="checkbox"
            name="agree"
            checked={agree}
            onChange={handleChange}
          />
          <span>
            I accept <Link to={"/"}>Terms of Use</Link>
          </span>
        </div>
        {errors.agree && <span className="error">{errors.agree}</span>}

        <div className="shop-button-wrapper">
          <button type="submit" disabled={loading} className="create-shop-btn">
            {loading ? (
              <Loader isLoading={loading} message="" size={20} />
            ) : (
              "Submit"
            )}
          </button>
        </div>

        <p className="already-have-shop">
          Already have a shop?{" "}
          <Link to={"/shop/login"} className="redirect-login">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default ShopCreate;
