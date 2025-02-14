import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchSingleSeller } from "../redux/actions/seller";
import { clearShopErrors } from "../redux/reducers/sellerReducer";


const SellerProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { currentSeller, loading, error } = useSelector((state) => state.seller);

  useEffect(() => {
    // Only fetch seller info if it's not already available
    if (!currentSeller) {
    
      dispatch(fetchSingleSeller());
    }

    // Clear errors when the component unmounts
    return () => {
      dispatch(clearShopErrors());
    };
  }, [dispatch, currentSeller]);

  
  if (loading) {
    return <div>Loading...</div>; 
  }


  if (error) {
    return <div>Error: {error}</div>; 
  }


  if (!currentSeller && !loading) {
    return <Navigate to="/shop/login" />;
  }

 
  return children;
};

// Prop type validation for the children prop
SellerProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SellerProtectedRoute;
