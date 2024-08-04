import React, { useEffect, useState } from 'react';
import './AllShopsProducts.scss';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HiOutlineEye } from 'react-icons/hi';
import { API } from '../../../utils/security/secreteKey';

const AllShopsProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const allWithdraws = async () => {
      try {
        const { data } = await axios.get(`${API}/products/shops/products`);
        setProducts(data.products);
      } catch (error) {
        console.log(error);
      }
    };
    allWithdraws();
  }, []);

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
      field: 'preview',
      flex: 0.8,
      minWidth: 100,
      headerName: 'Preview',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/product/${params.id}`}>
            <button>
              <HiOutlineEye />
            </button>
          </Link>
        );
      },
    },
  ];

  const row = [];

  products &&
    products.forEach((product) => {
      row.push({
        id: product._id,
        name: product.name,
        price: '$ ' + product.discountPrice,
        Stock: product.stock,
        sold: product?.sold_out,
      });
    });

  return (
    <section className="all-products-container">
      <h3 className="all-products-title">List of Products</h3>
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </section>
  );
};

export default AllShopsProducts;
