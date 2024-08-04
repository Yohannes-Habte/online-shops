import React, { useEffect, useState } from 'react';
import './ContactForm.scss';
import { FaUserAlt } from 'react-icons/fa';
import { BiSolidMessageDetail } from 'react-icons/bi';
import axios from 'axios';
import { API } from '../../../utils/security/secreteKey.js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ButtonLoader from '../../../utils/loader/ButtonLoader.jsx';

// Initial State
const initialSate = {
  firstName: '',
  lastName: '',
  message: '',
  error: '',
};
const ContactForm = () => {
  const navigate = useNavigate();
  // Global state variables
  const { currentUser } = useSelector((state) => state.user);

  // Local state variables
  const [testimonies, setTestimonies] = useState(initialSate);
  const [loading, setLoading] = useState(false);

  // Distructure the initial values
  const { firstName, lastName, message, error } = testimonies;

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  });

  // Function that handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTestimonies({ ...testimonies, [name]: value });
  };

  // reste the variables into initial state
  const resetToInitialState = () => {
    setTestimonies({ firstName: '', lastName: '', message: '' });
  };
  // Submit user testimonial or comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // new comment
      const newComment = {
        firstName: firstName,
        lastName: lastName,
        message: message,
      };

      const { data } = await axios.post(
        `${API}/comments/new-comment/${currentUser._id}`,
        newComment
      );

      // Reset
      resetToInitialState();
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <article className="form-container">
      <h3 className="sub-title"> Drop us a message below </h3>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="user-data">
          <div className="input-container">
            <FaUserAlt className="input-icon" />
            <input
              type="text"
              required
              name={'firstName'}
              id={'firstName'}
              value={firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="input-field"
            />

            <label htmlFor={'firstName'} className="input-label">
              First Name
            </label>
            <span className="input-highlight"></span>
          </div>

          <div className="input-container">
            <FaUserAlt className="input-icon" />
            <input
              type="text"
              name={'lastName'}
              id={'lastName'}
              required
              value={lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="input-field"
            />

            <label htmlFor={'lastName'} className="input-label">
              Last Name
            </label>
            <span className="input-highlight"></span>
          </div>
        </div>

        <div className="text-message-container">
          <BiSolidMessageDetail className="input-icon" />
          <textarea
            name="message"
            id="message"
            value={message}
            onChange={handleInputChange}
            rows="7"
            placeholder="We value your message"
            className="text-area-input-field"
          />

          <label htmlFor={'message'} className="input-label">
            Text Message
          </label>
          <span className="input-highlight"></span>
        </div>

        <button disabled={loading} className="contact-form-btn">
          {loading && <ButtonLoader />}
          {loading && <span> Loading...</span>}
          {!loading && <span>Submit</span>}
        </button>
      </form>
    </article>
  );
};

export default ContactForm;
