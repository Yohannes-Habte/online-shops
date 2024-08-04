import React, { useEffect, useState } from 'react';
import './AllShops.scss';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { HiOutlineEye } from 'react-icons/hi';
import { AiFillDelete } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import { API } from '../../../utils/security/secreteKey';

const AllShops = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');

  const [shops, setShops] = useState([]);

  // Get all shops
  const allShops = async () => {
    try {
      const { data } = await axios.get(`${API}/shops`);
      setShops(data.shops);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    allShops();
  }, []);

  // Delete a shop
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${API}/shops/delete-shop/${id}`);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    allShops();
  };

  const columns = [
    { field: 'id', headerName: 'Seller ID', minWidth: 150, flex: 0.7 },

    {
      field: 'name',
      headerName: 'name',
      minWidth: 200,
      flex: 0.7,
    },
    {
      field: 'email',
      headerName: 'Email',
      type: 'text',
      minWidth: 200,
      flex: 0.7,
    },
    {
      field: 'shopAddress',
      headerName: 'Shop Address',
      type: 'text',
      minWidth: 200,
      flex: 0.7,
    },

    {
      field: 'joinedAt',
      headerName: 'joinedAt',
      type: 'text',
      minWidth: 100,
      flex: 0.8,
    },
    {
      field: '  ',
      flex: 1,
      minWidth: 100,
      headerName: 'Preview Shop',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/shop/preview/${params.id}`}>
            <HiOutlineEye size={20} />
          </Link>
        );
      },
    },
    {
      field: ' ',
      flex: 1,
      minWidth: 100,
      headerName: 'Delete Seller',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <button onClick={() => setUserId(params.id) || setOpen(true)}>
            <AiFillDelete />
          </button>
        );
      },
    },
  ];

  const row = [];
  shops &&
    shops.forEach((shop) => {
      row.push({
        id: shop._id,
        name: shop?.name,
        email: shop?.email,
        joinedAt: shop.createdAt.slice(0, 10),
        shopAddress: shop.shopAddress,
      });
    });

  return (
    <section className="all-shops-wrapper">
      <h3 className="all-shops-title">List of Shops</h3>

      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />

      {open && (
        <article className="shop-delete-confirmation-wrapper">
          <IoClose className="delete-icon" onClick={() => setOpen(false)} />

          <h3 className="you-want-delete-shop">
            Are you sure you want delete this shop?
          </h3>
          <aside className="cancel-or-confirm-delete">
            <p className={`cancel-delete`} onClick={() => setOpen(false)}>
              cancel
            </p>
            <h3
              className={`confirm-delete`}
              onClick={() => setOpen(false) || handleDelete(userId)}
            >
              confirm
            </h3>
          </aside>
        </article>
      )}
    </section>
  );
};

export default AllShops;
