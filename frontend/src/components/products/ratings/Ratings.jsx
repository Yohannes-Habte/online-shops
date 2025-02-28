import './Ratings.scss';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { BsStarHalf } from 'react-icons/bs';

// Ratings Component is used to find average rating for a product and a shop
const Ratings = ({ ratings }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= ratings) {
      stars.push(<AiFillStar key={i} className="ratings-icon" />);
    } else if (
      i === Math.ceil(ratings) &&
      !Number.isInteger(ratings)
    ) {
      stars.push(<BsStarHalf key={i} className="ratings-icon" />);
    } else {
      stars.push(<AiOutlineStar key={i} className="ratings-icon" />);
    }
  }
  return stars;
};

export default Ratings;
