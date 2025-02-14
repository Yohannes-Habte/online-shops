import { useEffect, useState } from "react";
import { handleError } from "../utils/errorHandler/ErrorMessage";
import axios from "axios";
import { API } from "../utils/security/secreteKey";

const ShopProducts = () => {
  const [shopProducts, setShopProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/shops/shop/products`, {
          withCredentials: true,
        });
        // Check API response structure
        setShopProducts(res.data.shopProducts);
        setLoading(false);
      } catch (error) {
        const { message } = handleError(error);
        setError(message);
      }
    };
    fetchShopProducts();
  }, []);
  return { shopProducts, error, loading };
};

export default ShopProducts;
