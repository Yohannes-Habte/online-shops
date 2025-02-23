import "./UserSingleOrderItemReview.scss";

const UserSingleOrderItemReview = ({
  reviewHandler,
  ratings,
  handleChange,
  resetForm,
}) => {
  return (
    <div className="review-modal">
      <h2>Write a Review</h2>
      <form onSubmit={reviewHandler}>
        <label>Rating:</label>
        <select
          name="rating"
          id="rating"
          value={ratings.rating}
          onChange={handleChange}
        >
          <option value="default">Select Rating</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <label>Comment:</label>
        <textarea
          name="comment"
          id="comment"
          value={ratings.comment}
          onChange={handleChange}
        />

        <button type="submit">Submit Review</button>
        <button type="button" onClick={resetForm}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UserSingleOrderItemReview;
