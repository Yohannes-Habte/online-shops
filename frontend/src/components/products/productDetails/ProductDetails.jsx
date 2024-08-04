import React, { useEffect, useState } from 'react';
import './ProductDtails.scss';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { MdAddBox } from 'react-icons/md';
import { TbSquareMinusFilled } from 'react-icons/tb';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import RelatedProducts from '../relatedProducts/RelatedProducts';
import ProductInfos from '../productInfos/ProductInfos';
import { addToCart } from '../../../redux/reducers/cartReducer';
import {
  addToWishlist,
  removeFromWishlist,
} from '../../../redux/reducers/wishListReducer';
import { API } from '../../../utils/security/secreteKey';

/**
 1. ProductDetails component receive data from SinglePage.jsx page
 2. The date received by ProductDetails from SinglePage.jsx further transfered to ProductInfos.jsx component
 3. Data is further used for the Ratings.jx component
 */
//
const ProductDetails = ({ data }) => {
  const navigate = useNavigate();

  // Global state variables
  const { currentSeller } = useSelector((state) => state.seller);
  const { currentUser } = useSelector((state) => state.user);
  const { wishList } = useSelector((state) => state.wishList);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Local variables
  const [quantity, setQuantity] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const bestdealtProducts = async () => {
      try {
        // dispatch(productsShopFetchStart());
        const { data } = await axios.get(
          `${API}/products/${currentSeller._id}/shop-products`
        );
        // dispatch(productsShopFetchSuccess(data));
        setProducts(data.products);
      } catch (error) {
        console.log(error);
        // dispatch(productsShopFetchFailure(error.response.data.message));
      }
    };
    bestdealtProducts();
  }, []);

  // Display all products for a shop
  // useEffect(() => {
  //   dispatch(productsShopFetchSuccess(data && data._id));
  //   if (wishList && wishList.find((i) => i._id === data?._id)) {
  //     setClick(true);
  //   } else {
  //     setClick(false);
  //   }
  // }, [data, wishList]);

  // Increasing count by one
  const incrementCount = () => {
    if (data.stock > quantity) {
      setQuantity(quantity + 1);
    } else {
      toast.error(
        'The maximum available in the stock is reached! If you want more, please send us message!'
      );
    }
  };

  // Decreasing count by one
  const decrementCount = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Add wishlist
  const addToWishlistHandler = (id) => {
    setClick(!click);
    dispatch(addToWishlist(id));
  };

  // Remove wishlist
  const removeFromWishlistHandler = (id) => {
    setClick(!click);
    dispatch(removeFromWishlist(id));
  };

  // Add to cart
  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error('Item already in cart!');
    } else if (data.stock < quantity) {
      toast.error('Product is out of stock!');
    } else {
      const cartData = { ...data, qty: quantity };
      dispatch(addToCart(cartData));
      toast.success('Item added to cart successfully!');
    }
  };

  // How many times a particular product is reviewed
  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  // The total sum of rating done by users
  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const average = totalRatings / totalReviewsLength || 0;

  const averageRating = average.toFixed(2);

  // =========================================================
  // Handle conversation Submit Function
  // =========================================================
  const handleMessageSubmit = async () => {
    if (currentUser) {
      // body
      const newConversation = {
        groupTitle: data._id + currentUser._id,
        userId: currentUser._id,
        sellerId: data.shopId,
      };

      try {
        const { data } = await axios.post(
          `${API}/conversations/create-conversation`,
          newConversation
        );
        navigate(`/inbox?${data.conversation._id}`);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      toast.error('Please login to create a conversation');
    }
  };

  return (
    <section className="single-product-details">
      <article className="product-details">
        {/* Product image */}
        <figure className="image-container">
          <img className="image" src={data.images} alt={data.name} />
        </figure>

        {/* Product Description and add to cart */}
        <section className="product-description">
          <h3 className={'subTitle'}> {data.name} </h3>
          <p className="description">{data.description}</p>

          {/* Add to cart aside */}
          <article className="quantity-add-to-cart-wishlist">
            <section className="quantity-wrapper">
              <TbSquareMinusFilled
                onClick={decrementCount}
                className="icon-add-to-cart"
              />

              <h3 className="amount-subTitle"> {quantity} </h3>

              <MdAddBox onClick={incrementCount} className="icon-add-to-cart" />
            </section>

            <h3
              onClick={() => addToCartHandler(data)}
              className="add-to-cart-btn"
            >
              Add to Cart
            </h3>

            {click ? (
              <AiFillHeart
                className={click ? 'active-wishlist' : 'passive-wishlist'}
                onClick={() => removeFromWishlistHandler(data._id)}
                color={click ? 'red' : 'black'}
                title="Remove from wishlist"
              />
            ) : (
              <AiOutlineHeart
                className={click ? 'active-wishlist' : 'passive-wishlist'}
                onClick={() => addToWishlistHandler(data)}
                color={click ? 'active' : 'passive'}
                title="Add to wishlist"
              />
            )}
          </article>

          {/* Product rating message */}
          <aside className="product-rating">
            <img src="" alt="" />
            <h3 className="product-name">
              <Link to={`/shop/${data._id}`}>{data.name} </Link>
            </h3>
            <p className="rating"> Rating: {averageRating} </p>
            <span onClick={handleMessageSubmit} className="send-message">
              Send Message <AiOutlineMessage />
            </span>
          </aside>
        </section>
      </article>

      <ProductInfos
        data={data}
        products={products}
        totalReviewsLength={totalReviewsLength}
        averageRating={averageRating}
      />

      {/* Include related Products */}
      <RelatedProducts />
    </section>
  );
};

export default ProductDetails;
