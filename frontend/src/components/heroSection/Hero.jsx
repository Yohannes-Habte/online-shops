import { useState } from "react";
import Loader from "../loader/Loader";
import "./Hero.scss";
import { Link } from "react-router-dom";

const Hero = () => {
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <section className="hero-container">
      <h1 className="hero-title">
        Effortless Online Store Creation for Your Business Success
      </h1>
      <p className="hero-paragraph">
        Launch Your Online Store with Ease! Empower your business with a
        seamless, user-friendly platform designed to help you create, manage,
        and grow your online shop. From showcasing your products beautifully to
        reaching customers worldwide, we provide the tools you need to succeed
        in the digital marketplace. Start selling online today—effortlessly and
        efficiently!
      </p>
      <Link to="/shop/create" className="link">
        <button
          className="hero-btn"
          onClick={handleButtonClick}
          disabled={loading}
        >
          {loading ? (
            <Loader isLoading={loading} message="" size={20} />
          ) : (
            <span> Create Shop Now</span>
          )}
        </button>
      </Link>
    </section>
  );
};

export default Hero;
