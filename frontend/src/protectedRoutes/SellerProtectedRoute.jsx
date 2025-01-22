import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchSingleSeller } from "../redux/actions/seller";

const SellerProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();

  const { currentSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(fetchSingleSeller());
  }, [dispatch]);

 

  if (!currentSeller) {
    return <Navigate to="/shop/login" />;
  }

  // Render the child components if the seller is authenticated
  return children;
};

export default SellerProtectedRoute;
