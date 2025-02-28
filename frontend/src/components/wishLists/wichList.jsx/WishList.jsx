import { AiOutlineHeart } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import WishlistCart from "../singleWishList/WishlistCart";
import "./WishList.scss";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../../redux/reducers/wishListReducer";

const WishList = ({ setOpenWishList }) => {
  const { wishList } = useSelector((state) => state.wishList);
  const dispatch = useDispatch();

  const totalPrice = wishList.reduce(
    (acc, item) => acc + (item.discountPrice || 0),
    0
  );

  // Remove from wishlist handler
  const removeFromWishlistHandler = (productId) => {
    console.log("productId =", productId);
    dispatch(removeFromWishlist(productId));
  };

  return (
    <main className="wishlist-page">
      <article className="wishlist-page-container">
        {wishList.length === 0 ? (
          <section className="empty-wishlist-section">
            <RxCross1
              className="close-empty-icon"
              onClick={() => setOpenWishList(false)}
            />
            <h2 className="empty-wishlist-title">Your Wishlist is empty!</h2>
          </section>
        ) : (
          <section className="wishlist-items-wrapper">
            <RxCross1
              className="close-order-icon"
              onClick={() => setOpenWishList(false)}
            />
            <AiOutlineHeart size={25} color="red" />
            <h5 className="wishlist-items-count">{`You have ${wishList.length} item(s) in your wishlist`}</h5>
            <div className="single-wishlist-cart-container">
              {wishList.map((product) => {
                const variant = product.variant || {
                  productColor: "Unknown",
                  size: "N/A",
                };

                return (
                  <WishlistCart
                    key={`${product._id}-${variant.productColor}-${variant.size}`}
                    data={product}
                    removeFromWishlistHandler={() =>
                      removeFromWishlistHandler(
                        product._id,
                        variant.productColor,
                        variant.size
                      )
                    }
                    setOpenWishList={setOpenWishList}
                  />
                );
              })}
            </div>
          </section>
        )}

        <div className="wishlist-horizontal-line"></div>

        <h3 className="wishlist-items-total-price">
          Total Price: <strong className="total-price-amount">${totalPrice.toFixed(2)}</strong>
        </h3>
      </article>
    </main>
  );
};

export default WishList;
