import "./WishList.scss";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../../redux/reducers/wishListReducer";
import { addToCart } from "../../../redux/reducers/cartReducer";
import { RxCross1 } from "react-icons/rx";
import CartSingle from "../singleWishList/CartSingle";
import { useState } from "react";
import { toast } from "react-toastify";

const WishList = ({ setOpenWishList }) => {
  // Global state variables
  const dispatch = useDispatch();
  const { wishList } = useSelector((state) => state.wishList);

  const [selectedVariant, setSelectedVariant] = useState(null);

  // Total price calculation
  const totalPrice = wishList.reduce(
    (acc, itemPrice) => acc + itemPrice.discountPrice,
    0
  );

  // Add to cart handler
  const addToCartHandler = (data) => {
    if (!selectedVariant) {
      toast.error("Please select a variant!");
      return;
    }

    const newData = {
      ...data,
      qty: 1,
      variant: selectedVariant,
      productImage: selectedVariant?.productImage,
    };

    console.log("Adding to Cart:", newData);
    dispatch(addToCart(newData));
    setOpenWishList(false);
  };

  // Remove from wishlist handler
  const removeFromWishlistHandler = (id) => {
    dispatch(removeFromWishlist(id));
  };

  // Handle variant selection (size/color)
  const handleVariantSelection = (variant) => {
    setSelectedVariant(variant);
  };

  return (
    <main className="whilist">
      <article className="wishlist-container">
        {wishList && wishList.length === 0 ? (
          <section className="empty-wishlist-wrapper">
            <RxCross1
              className="close-empty-icon"
              onClick={() => setOpenWishList(false)}
            />
            <h2 className="empty-cart">Wishlist is empty!</h2>
          </section>
        ) : (
          <section className="wishlist-order-wrapper">
            <RxCross1
              className="close-order-icon"
              onClick={() => setOpenWishList(false)}
            />

            {/* Wishlist Item Count */}
            <AiOutlineHeart size={25} style={{ color: "red" }} />
            <h5 className="wishlist-items">
              {wishList.length === 1
                ? `There is ${wishList.length} Item in the Wishlist`
                : `There are ${wishList.length} Items in the Wishlist`}
            </h5>

            {/* Cart Single Items */}
            <div className="single-cart-wrapper">
              {wishList &&
                wishList.map((product) => (
                  <CartSingle
                    key={product._id}
                    data={product}
                    addToCartHandler={addToCartHandler}
                    removeFromWishlistHandler={removeFromWishlistHandler}
                    handleVariantSelection={handleVariantSelection} // Pass handler to CartSingle
                    selectedVariant={selectedVariant || product?.variants[0]} // Pass default variant if none selected
                  />
                ))}
            </div>
          </section>
        )}
        <h3>Total Price: ${totalPrice}</h3>
      </article>
    </main>
  );
};

export default WishList;
