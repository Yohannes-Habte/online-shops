import { useState, useEffect } from "react";
import "./UserProfile.scss";
import axios from "axios";
import { FaUser, FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  cloud_URL,
  cloud_name,
  upload_preset,
} from "../../../utils/security/secreteKey.js";
import { updateUserProfile } from "../../../redux/actions/user.js";
import { validPassword } from "../../../utils/validators/Validate.js";
import Loader from "../../loader/Loader.jsx";

const UserProfile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [updateUser, setUpdateUser] = useState({
    name: currentUser?.name || "",
    image: null,
    confirmEmail: currentUser?.email || "",
    confirmPassword: "",
    showPassword: false,
    agree: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      setUpdateUser((prev) => ({
        ...prev,
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        confirmEmail: currentUser.email || "",
      }));
    }
  }, [currentUser]);

  const { name, image, confirmEmail, confirmPassword, showPassword, agree } =
    updateUser;

  // Update input data
  const updateChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setUpdateUser((prev) => ({
      ...prev,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setUpdateUser((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  // Reset form state
  const resetVariables = () => {
    setUpdateUser({
      name: currentUser?.name || "",
      image: null,
      confirmEmail: currentUser?.email || "",
      confirmPassword: "",
      showPassword: false,
      agree: false,
    });
    setErrors({});
  };

  // Validate form fields
  const validateForm = () => {
    let validationErrors = {};
    if (!name.trim()) validationErrors.name = "Name is required.";
    if (!confirmEmail.trim())
      validationErrors.confirmEmail = "Email is required.";
    if (!confirmPassword.trim()) {
      validationErrors.confirmPassword =
        "Password is required for confirmation.";
    } else if (!validPassword(confirmPassword)) {
      validationErrors.password = "Invalid password.";
    }

    if (!agree)
      validationErrors.agree = "Please agree to the terms and conditions.";

    return validationErrors;
  };

  // Handle form submission
  const submitUpdatedUserProfile = async (event) => {
    event.preventDefault();

    // Validate input fields
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let imageUrl = currentUser.image;
    if (image) {
      const userPhoto = new FormData();
      userPhoto.append("file", image);
      userPhoto.append("upload_preset", upload_preset);
      userPhoto.append("cloud_name", cloud_name);

      // Upload image to Cloudinary
      const { data } = await axios.post(cloud_URL, userPhoto);
      imageUrl = data.url;
    }

    const newUser = {
      name,
      image: imageUrl,
      confirmEmail,
      confirmPassword, // Used for confirmation but NOT updated
      agree,
    };

    dispatch(updateUserProfile(newUser));
    resetVariables();
  };

  return (
    <section className="profile-form-container">
      <h1 className="profile-form-title">Update Your Profile</h1>

      <figure className="image-container">
        {currentUser?.image ? (
          <img
            className="image"
            src={currentUser.image}
            alt={currentUser.name}
          />
        ) : (
          <FaUser className="image" />
        )}
      </figure>

      <fieldset className="profile-fieldset">
        <legend className="profile-legend">
          {currentUser?.name || "User Profile"}
        </legend>

        <form onSubmit={submitUpdatedUserProfile} className="profile-form">
          {/* Name Field */}
          <div className="input-container">
            <FaUserAlt className="icon" />
            <input
              type="text"
              name="name"
              value={name}
              onChange={updateChange}
              placeholder="Enter Full Name"
              className="input-field"
            />
            {errors.name && (
              <span className="input-field-error">{errors.name}</span>
            )}
          </div>

          {/* Profile Picture Upload */}
          <div className="input-container file-container">
            <FaCloudUploadAlt className="icon" />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={updateChange}
              className="input-field"
            />
            {errors.image && (
              <span className="input-field-error">{errors.image}</span>
            )}
          </div>

          {/* Email Confirmation */}
          <div className="input-container">
            <MdEmail className="icon" />
            <input
              type="email"
              name="confirmEmail"
              value={confirmEmail}
              readOnly
              className="input-field"
            />
            {errors.confirmEmail && (
              <span className="input-field-error">{errors.confirmEmail}</span>
            )}
          </div>

          {/* Password Confirmation */}
          <div className="input-container">
            <RiLockPasswordFill className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={updateChange}
              placeholder="Enter Password for Confirmation"
              className="input-field"
            />
            <span
              onClick={togglePasswordVisibility}
              className="password-display"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
            {errors.confirmPassword && (
              <span className="input-field-error">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="input-consent">
            <input
              type="checkbox"
              id="consent"
              name="agree"
              checked={agree}
              onChange={updateChange}
              className="profile-input-checkbox"
            />
            <label htmlFor="consent">
              I consent to the processing of my data in accordance with the
              privacy policy.
            </label>
          </div>
          {errors.agree && (
            <span className="input-field-error">{errors.agree}</span>
          )}

          {/* Submit Button */}
          <button type="submit" className="update-profile-btn">
            {loading ? (
              <Loader isLoading={loading} message="" size={20} />
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </fieldset>
    </section>
  );
};

export default UserProfile;
