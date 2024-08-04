import React, { useEffect, useState } from 'react';
import './AllShopProducts.scss';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import {
  productShopDeleteFailure,
  productShopDeleteStart,
  productShopDeleteSuccess,
  productsShopFetchFailure,
  productsShopFetchStart,
  productsShopFetchSuccess,
} from '../../../redux/reducers/productReducer';
import { API } from '../../../utils/security/secreteKey';

const AllShopProducts = () => {
  // Global state variables
  const { products, loading } = useSelector((state) => state.product);
  const { currentSeller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  // local state variables
  const [shopProducts, setShopProducts] = useState([]);

  // Display products for a single shop
  useEffect(() => {
    const shopProducts = async () => {
      try {
        // dispatch(productsShopFetchStart());
        const { data } = await axios.get(
          `${API}/products/${currentSeller._id}/shop-products`
        );
        // dispatch(productsShopFetchSuccess(data));
        setShopProducts(data.products);
      } catch (error) {
        dispatch(productsShopFetchFailure(error.response.data.message));
      }
    };
    shopProducts();
  }, [dispatch]);

  // Handle delete
  const handleProductDelete = async (productID) => {
    try {
      dispatch(productShopDeleteStart());
      const { data } = await axios.delete(`${API}/products/${productID}`);
      dispatch(productShopDeleteSuccess(data));
      window.location.reload();
    } catch (error) {
      dispatch(productShopDeleteFailure(error.response.data.message));
    }
  };

  const columns = [
    { field: 'id', headerName: 'Product Id', minWidth: 150, flex: 0.7 },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: 'price',
      headerName: 'Price',
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: 'Stock',
      headerName: 'Stock',
      type: 'number',
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: 'sold',
      headerName: 'Sold out',
      type: 'number',
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: 'Preview',
      flex: 0.8,
      minWidth: 100,
      headerName: 'Preview',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/products/${params.id}`}>
              <button className="product-icon-btn">
                <AiOutlineEye size={20} />
              </button>
            </Link>
          </>
        );
      },
    },
    {
      field: 'Delete',
      flex: 0.8,
      minWidth: 120,
      headerName: 'Delete',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleProductDelete(params.id)}
              className="delete-icon-btn"
            >
              <AiOutlineDelete size={20} />
            </button>
          </>
        );
      },
    },
  ];

  const row = [];

  shopProducts &&
    shopProducts?.map((product) => {
      return row.push({
        id: product._id,
        name: product.name,
        price: 'US$ ' + product.discountPrice,
        Stock: product.stock,
        sold: product?.sold_out,
      });
    });

  return (
    <section className="all-shop-products-wrapper">
      <h1 className="title">{currentSeller.name} Shop </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      )}
    </section>
  );
};

export default AllShopProducts;
