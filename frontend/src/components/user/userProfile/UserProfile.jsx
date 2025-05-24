import { useState, useEffect } from "react";
import "./UserProfile.scss";
import axios from "axios";
import { FaUser, FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
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
import {
  CheckboxField,
  FileUploadField,
  InputField,
  PasswordField,
} from "../../forms/formFields/FormFields.jsx";

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
    <section className="user-profile-form-container">
      <h1 className="user-profile-form-title">Update Your Profile</h1>

      <figure className="user-profile-image-container">
        {currentUser?.image ? (
          <img
            className="user-profile-image"
            src={currentUser.image}
            alt={currentUser.name}
          />
        ) : (
          <FaUser className="user-profile-image" />
        )}
      </figure>

      <fieldset className="user-profile-fieldset">
        <legend className="user-profile-legend">
          {currentUser?.name || "User Profile"}
        </legend>

        <form onSubmit={submitUpdatedUserProfile} className="user-profile-update-form ">

          
          {/* Name Field */}
          <InputField
            type="text"
            name="name"
            value={name}
            onChange={updateChange}
            placeholder="Enter Full Name"
            icon={<FaUserAlt />}
            errors={errors}
            className="input-container"
          />

          {/* Profile Picture Upload */}
          <FileUploadField
            name="image"
            accept="image/*"
            value={image}
            onChange={updateChange}
            icon={<FaCloudUploadAlt />}
            errors={errors}
            className="input-container file-container"
          />

          {/* Email Confirmation */}
          <InputField
            type="email"
            name="confirmEmail"
            value={confirmEmail}
            onChange={updateChange}
            placeholder="Enter Email for Confirmation"
            icon={<MdEmail />}
            errors={errors}
            className="input-container"
          />

          {/* Password Confirmation */}
          <PasswordField
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={updateChange}
            placeholder="Enter Password for Confirmation"
            icon={<RiLockPasswordFill />}
            errors={errors}
            className="input-container"
            togglePasswordVisibility={togglePasswordVisibility}
          />

          {/* Agree or consent Confirmation */}
          <CheckboxField
            type="checkbox"
            name="agree"
            checked={agree}
            onChange={updateChange}
            className="input-container"
            errors={errors}
            label="I consent to the processing of my data in accordance with the privacy policy."
          />

          {/* Submit Button */}
          <button type="submit" className="update-user-profile-btn">
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
