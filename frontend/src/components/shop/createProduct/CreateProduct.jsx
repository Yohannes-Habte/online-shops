import React, { useState } from 'react';
import './CreateProduct.scss';
import { AiFillTags } from 'react-icons/ai';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { FaAudioDescription, FaProductHunt, FaUpload } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdMedicalServices, MdPriceChange } from 'react-icons/md';
import axios from 'axios';
import {
  productPostFailure,
  productPostStart,
  productPostSuccess,
} from '../../../redux/reducers/productReducer';
import {
  API,
  cloud_URL,
  cloud_name,
  upload_preset,
} from '../../../utils/security/secreteKey';

const CreateProduct = () => {
  const navigate = useNavigate();
  // Global state variables
  const { currentSeller } = useSelector((state) => state.seller);
  const { loading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [images, setImages] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();

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

  const reset = () => {
    setImages('');
    setName('');
    setDescription('');
    setCategory('');
    setTags('');
    setOriginalPrice('');
    setDiscountPrice('');
    setStock('');
  };

  //& Handle multiple image changes
  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);

  //   setImages([]);

  //   files.forEach((file) => {
  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       if (reader.readyState === 2) {
  //         setImages((old) => [...old, reader.result]);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(productPostStart());

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
        //& For more images upload
        // images: images.forEach((image) => {productImages.append('images', image)}),
      };

      const { data } = await axios.post(
        `${API}/products/create-product`,
        newProduct
      );

      dispatch(productPostSuccess(data.product));
      reset();
    } catch (error) {
      console.log(error);
      dispatch(productPostFailure(error.response.data.message));
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="create-product-wrapper">
      <h5 className="subTitle">Create Product</h5>

      <p className="error"> {error} </p>

      {/* create product form */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="form"
      >
        {/* Product name */}
        <div className="input-container">
          <FaProductHunt className="icon" />
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="name"
            required
            value={name}
            onChange={updateChange}
            placeholder="Enter Product Name"
            className="input-field"
          />
          <label htmlFor="name" className="input-label">
            Product Name
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Product category */}
        <div className="input-container">
          <BiSolidCategoryAlt className="icon" />
          <label htmlFor="category" className="input-label">
            Product Category <span className="mark">*</span>
          </label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={updateChange}
            className="input-field"
          >
            <option value="default">Choose Product Category</option>
            <option value="phone"> Phone </option>
            <option value="laptop"> Laptop </option>
            <option value="shoes"> Shoes </option>
            <option value="clothes"> Clothes </option>
            <option value="others"> Others </option>
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
            placeholder="Enter Product tags"
            className="input-field"
          />
          <label htmlFor="tags" className="input-label">
            Product tags
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Product Original Price */}
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
            placeholder="Enter Product Original Price"
            className="input-field"
          />
          <label htmlFor="originalPrice" className="input-label">
            Product Original Price
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Product discount Price */}
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
            placeholder="Enter Product Discount Price"
            className="input-field"
          />
          <label htmlFor="discountPrice" className="input-label">
            Product Discount Price
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Product stock */}
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
            placeholder="Enter Product Stock"
            className="input-field"
          />
          <label htmlFor="stock" className="input-label">
            Product Stock
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
            // multiple
            onChange={(e) => setImages(e.target.files[0])}
            className="input-field"
          />
        </div>

        {/* display products upload images on the browser */}
        {/* <figure className="image-container">
          {images && <img src={images} alt="Product" className="image" />}
        </figure> */}

        {/* Product Description */}
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
            placeholder="Enter Product Description"
            className="input-field"
          ></textarea>
          <label htmlFor="description" className="input-label">
            Product Description
          </label>
          <span className="input-highlight"></span>
        </div>

        <button className="create-product-btn">Submit</button>
      </form>
    </section>
  );
};

export default CreateProduct;
