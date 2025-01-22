import "./ServiceInformation.scss";
import { MdLocalShipping, MdLocalOffer } from "react-icons/md";
import { RiPriceTagFill, RiSecurePaymentLine } from "react-icons/ri";

const categoriesData = [
  {
    icon: <MdLocalShipping className="icon" />,
    title: "Free Shipping",
    description: "On all orders over $100",
  },
  {
    icon: <MdLocalOffer className="icon" />,
    title: "Daily Surprise Offers",
    description: "Save up to 20% every day",
  },
  {
    icon: <RiPriceTagFill className="icon" />,
    title: "Affordable Prices",
    description: "Factory-direct pricing for everyone",
  },
  {
    icon: <RiSecurePaymentLine className="icon" />,
    title: "Secure Payments",
    description: "100% payment protection guaranteed",
  },
];

const ServiceInformation = () => {
  return (
    <section className="categories">
      {categoriesData.map((category, index) => (
        <article className="category-wrapper" key={index}>
          <div className="icon-container">{category.icon}</div>
          <div className="text-content">
            <h3 className="category-title">{category.title}</h3>
            <p className="category-description">{category.description}</p>
          </div>
        </article>
      ))}
    </section>
  );
};

export default ServiceInformation;
