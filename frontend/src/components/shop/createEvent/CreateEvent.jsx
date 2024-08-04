import React, { useState, useRef } from 'react';
import './CreateEvent.scss';
import { AiFillTags } from 'react-icons/ai';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { FaAudioDescription, FaUpload } from 'react-icons/fa';
import { MdEmojiEvents, MdMedicalServices } from 'react-icons/md';
import { MdOutlineDateRange, MdPriceChange } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  eventShopPostFailure,
  eventShopPostStart,
  eventShopPostSuccess,
} from '../../../redux/reducers/eventReducer';

import {
  API,
  cloud_URL,
  cloud_name,
  upload_preset,
} from '../../../utils/security/secreteKey';

const CreateEvent = () => {
  const navigate = useNavigate();
  const startingDateRef = useRef();

  // Global state variables
  const { currentSeller } = useSelector((state) => state.seller);
  const { events } = useSelector((state) => state.event);
  const dispatch = useDispatch();

  // Local state variables
  const [images, setImages] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Handle start date change
  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    const minEndDateISO = minEndDate.toISOString().slice(0, 10);
    setStartDate(startDate);
    setEndDate(null);
    startingDateRef.current.name = minEndDateISO;
  };

  // Handle end date change
  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  // Minimum start date will be today
  const today = new Date().toISOString().slice(0, 10);

  // Minimum end date will be three days from today
  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : '';

  // Update input data
  const updateChange = (e) => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value);
        break;

      case 'description':
        setDescription(e.target.value);
        break;

      case 'category':
        setCategory(e.target.value);
        break;

      case 'tags':
        setTags(e.target.value);
        break;

      case 'originalPrice':
        setOriginalPrice(e.target.value);
        break;

      case 'discountPrice':
        setDiscountPrice(e.target.value);
        break;

      case 'stock':
        setStock(e.target.value);
        break;

      default:
        break;
    }
  };

  // Reset
  const reset = () => {
    setImages('');
    setName('');
    setDescription('');
    setCategory('');
    setTags('');
    setOriginalPrice('');
    setDiscountPrice('');
    setStock('');
    setStartDate('');
    setEndDate('');
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(eventShopPostStart());

      const productImages = new FormData();
      productImages.append('file', images);
      productImages.append('cloud_name', cloud_name);
      productImages.append('upload_preset', upload_preset);

      // Save image to cloudinary
      const response = await axios.post(cloud_URL, productImages);
      const { url } = response.data;

      // The body
      const newProduct = {
        shopId: currentSeller._id,
        name: name,
        description: description,
        category: category,
        tags: tags,
        originalPrice: originalPrice,
        discountPrice: discountPrice,
        stock: stock,
        images: url,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      };

      const { data } = await axios.post(
        `${API}/events/create-event`,
        newProduct
      );

      dispatch(eventShopPostSuccess(data.event));
      reset();
    } catch (error) {
      console.log(error);
      dispatch(eventShopPostFailure(error.response.data.message));
    }
  };

  return (
    <section className="create-event-wrapper">
      <h5 className="title">Create Event</h5>
      {/* create event form */}
      <form onSubmit={handleSubmit} className="form">
        {/* Event name */}
        <div className="input-container">
          <MdEmojiEvents className="icon" />
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="name"
            required
            value={name}
            onChange={updateChange}
            placeholder="Enter Event Name"
            className="input-field"
          />
          <label htmlFor="name" className="input-label">
            Event Name
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Product category */}
        <div className="input-container">
          <BiSolidCategoryAlt className="icon" />
          <label htmlFor="category" className="input-label">
            Event Category <span className="mark">*</span>
          </label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={updateChange}
            className="input-field"
          >
            <option value="default">Choose Event Category</option>
            <option value="phone"> Phone </option>
            <option value="laptop"> Laptop </option>
            <option value="shoes"> Shoes </option>
            <option value="clothes"> Clothes </option>
            <option value="accesseries"> Accesseries </option>
          </select>
        </div>

        {/* Product tags */}
        <div className="input-container">
          <AiFillTags className="icon" />
          <input
            type="text"
            name="tags"
            id="tags"
            autoComplete="tags"
            required
            value={tags}
            onChange={updateChange}
            placeholder="Enter Event tags"
            className="input-field"
          />
          <label htmlFor="tags" className="input-label">
            Event tags
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Event Original Price */}
        <div className="input-container">
          <MdPriceChange className="icon" />
          <input
            type="number"
            name="originalPrice"
            id="originalPrice"
            autoComplete="originalPrice"
            required
            value={originalPrice}
            onChange={updateChange}
            placeholder="Enter Event Original Price"
            className="input-field"
          />
          <label htmlFor="originalPrice" className="input-label">
            Event Original Price
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Event discount Price */}
        <div className="input-container">
          <MdPriceChange className="icon" />
          <input
            type="number"
            name="discountPrice"
            id="discountPrice"
            autoComplete="discountPrice"
            required
            value={discountPrice}
            onChange={updateChange}
            placeholder="Enter Event Discount Price"
            className="input-field"
          />
          <label htmlFor="discountPrice" className="input-label">
            Event Discount Price
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Event stock */}
        <div className="input-container">
          <MdMedicalServices className="icon" />
          <input
            type="number"
            name="stock"
            id="stock"
            autoComplete="stock"
            required
            value={stock}
            onChange={updateChange}
            placeholder="Enter Event Stock"
            className="input-field"
          />
          <label htmlFor="stock" className="input-label">
            Event Stock
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Event Starting date */}
        <div className="input-container">
          <MdOutlineDateRange className="icon" />
          <input
            type="date"
            name="startDate"
            id="startDate"
            ref={startingDateRef}
            value={startDate ? startDate.toISOString().slice(0, 10) : ''}
            onChange={handleStartDateChange}
            min={today}
            placeholder="Enter  Event Start Date"
            className="input-field"
          />
          <label htmlFor="startDate" className="input-label">
            Event Start Date
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Event Ending date */}
        <div className="input-container">
          <MdOutlineDateRange className="icon" />
          <input
            type="date"
            name="endDate"
            id="endDate"
            required
            value={endDate ? endDate.toISOString().slice(0, 10) : ''}
            onChange={handleEndDateChange}
            min={minEndDate}
            placeholder="Enter Event End Date"
            className="input-field"
          />
          <label htmlFor="endDate" className="input-label">
            Event Start Date
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Images of products */}
        <div className="file-container">
          <label htmlFor="images" className="image-label">
            <FaUpload className="icon" />
            Upload Images <span className="mark">*</span>
          </label>
          <input
            type="file"
            name="images"
            id="images"
            multiple
            onChange={(e) => setImages(e.target.files[0])}
            className="input-field"
          />
        </div>

        {/* Event Description */}
        <div className="input-container">
          <FaAudioDescription className="icon" />
          <textarea
            type="text"
            name="description"
            id="description"
            cols="30"
            rows="7"
            autoComplete="description"
            required
            value={description}
            onChange={updateChange}
            placeholder="Enter Even Description"
            className="input-field"
          ></textarea>
          <label htmlFor="description" className="input-label">
            Event Description
          </label>
          <span className="input-highlight"></span>
        </div>

        <button className="create-event-btn">Submit</button>
      </form>
    </section>
  );
};

export default CreateEvent;
