import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShopCreate from "../../../components/shop/createShop/CreateShop";

const CreateNewShop = () => {
  const { currentSeller } = useSelector((state) => state.seller);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentSeller) {
      alert(
        "You have already created a shop! Redirecting to your shop dashboard..."
      );
      navigate("/shop/dashboard");
    }
  }, [currentSeller, navigate]);

  return (
    <main className="shop-create-page">{!currentSeller && <ShopCreate />}</main>
  );
};

export default CreateNewShop;
