import axios from "axios";
import { API } from "../../utils/security/secreteKey";
import { handleError } from "../../utils/errorHandler/ErrorMessage";
import { toast } from "react-toastify";
import {
  productPostStart,
  productPostSuccess,
  productPostFailure,
  productFetchStart,
  productFetchSuccess,
  productFetchFailure,
  productUpdateStart,
  productUpdateSuccess,
  productUpdateFailure,
  productShopDeleteStart,
  productShopDeleteSuccess,
  productShopDeleteFailure,
  allProductsFetchStart,
  allProductsFetchSuccess,
  allProductsFetchFailure,
  customerCategoryProductsFetchStart,
  customerCategoryProductsFetchSuccess,
  customerCategoryProductsFetchFailure,
  shopProductFetchStart,
  shopProductFetchSuccess,
  shopProductFetchFailure,
} from "../reducers/productReducer";

//==============================================================================
// Action to create a new product
//==============================================================================

export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch(productPostStart());

    const res = await axios.post(`${API}/products/create`, productData, {
      withCredentials: true,
    });

    const newProduct = res.data.product;
    dispatch(productPostSuccess(newProduct));
    toast.success("Product created successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(productPostFailure(message));
  }
};

//==============================================================================
// Action to fetch a single product
//==============================================================================

export const fetchProduct = (productId) => async (dispatch) => {
  try {
    dispatch(productFetchStart());

    const res = await axios.get(`${API}/products/${productId}`);

    const product = res.data.product;
    dispatch(productFetchSuccess(product));
  } catch (error) {
    const { message } = handleError(error);
    dispatch(productFetchFailure(message));
  }
};

//==============================================================================
// Action to update a product
//==============================================================================

export const updateProduct = (productId, updatedData) => async (dispatch) => {
  try {
    dispatch(productUpdateStart());

    const res = await axios.put(`${API}/products/${productId}`, updatedData, {
      withCredentials: true,
    });

    const updatedProduct = res.data.product;
    dispatch(productUpdateSuccess(updatedProduct));
    toast.success("Product updated successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(productUpdateFailure(message));
  }
};

//==============================================================================
// Action to delete a product from a specific shop
//==============================================================================

export const deleteProductFromAll = (productId) => async (dispatch) => {
  try {
    dispatch(productShopDeleteStart());

    await axios.delete(`${API}/products/${productId}`, {
      withCredentials: true,
    });

    dispatch(productShopDeleteSuccess());
    toast.success("Product deleted successfully!");
  } catch (error) {
    const { message } = handleError(error);
    dispatch(productShopDeleteFailure(message));
  }
};

//=========================================================================
// Action to fetch all products for a shop
//=========================================================================

export const fetchProductsByShop = () => async (dispatch) => {
  try {
    dispatch(shopProductFetchStart());
    
    const res = await axios.get(`${API}/shops/shop/products`, {
      withCredentials: true,
    });

    console.log('API response:', res.data);  // Check API response structure

    const products = res.data.shopProducts;
    dispatch(shopProductFetchSuccess({ shopProducts: products }));  
  } catch (error) {
    const { message } = handleError(error); 
    dispatch(shopProductFetchFailure(message));
  }
};



//=========================================================================
// Action to fetch all products for all shops
//=========================================================================
export const fetchAllProductsForAllShops =
  (queryParams) => async (dispatch) => {
    try {
      dispatch(allProductsFetchStart());

      // Build the query string
      const queryString = new URLSearchParams(queryParams).toString();
      const res = await axios.get(`${API}/products?${queryString}`);

      const { products, totalCount, currentPage, totalPages } = res.data;

      dispatch(
        allProductsFetchSuccess({
          products,
          totalCount,
          currentPage,
          totalPages,
        })
      );
    } catch (error) {
      const { message } = handleError(error);
      dispatch(allProductsFetchFailure(message));
    }
  };

//==============================================================================
// Action to fetch all products for a specific customer category
//==============================================================================export const fetchCustomerCategoryProducts = (customerCategory) => async (dispatch) => {
export const fetchCustomerCategoryProducts =
  (customerCategory) => async (dispatch) => {
    try {
      dispatch(customerCategoryProductsFetchStart());

      const res = await axios.get(
        `${API}/products/category/customer/${customerCategory}`
      );

      const products = res.data.customerProducts;
      dispatch(
        customerCategoryProductsFetchSuccess({
          customerCategory,
          customerProducts: products,
        })
      );
    } catch (error) {
      const { message } = handleError(error);
      dispatch(customerCategoryProductsFetchFailure(message));
    }
  };
