import React, { useEffect, useState } from 'react';
import './AllShopEvents.scss';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import {
  eventShopDeleteFailure,
  eventShopDeleteStart,
  eventShopDeleteSuccess,
  eventsShopFetchFailure,
  eventsShopFetchStart,
  eventsShopFetchSuccess,
} from '../../../redux/reducers/eventReducer';
import { toast } from 'react-toastify';
import { API } from '../../../utils/security/secreteKey';

const AllShopEvents = () => {
  // Global state variables
  const { events, loading } = useSelector((state) => state.event);
  const { currentSeller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  // Local state variable
  // local state variables
  const [shopEvents, setShopEvents] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Display products for a single shop
  useEffect(() => {
    const selamShopEvents = async () => {
      try {
        // dispatch(eventsShopFetchStart());
        const { data } = await axios.get(
          `${API}/events/${currentSeller._id}/shop-events`
        );
        // dispatch(eventsShopFetchSuccess(data));
        setShopEvents(data.events);
      } catch (error) {
        dispatch(eventsShopFetchFailure(error.response.data.message));
      }
    };
    selamShopEvents();
  }, [dispatch]);

  // Handle delete
  const handleEventDelete = async (eventID) => {
    try {
      //! Why delete from the redux does not work?
      // dispatch(eventShopDeleteStart());
      setSuccess(false);
      const { data } = await axios.delete(`${API}/events/${eventID}`);
      // dispatch(eventShopDeleteSuccess(data));
      setSuccess(true);
      toast.success(data.message);
      window.location.reload();
    } catch (error) {
      // dispatch(eventShopDeleteFailure(error.response.data.message));
      toast.error(error.response.data.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'Product Id', minWidth: 150, flex: 0.7 },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
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
      minWidth: 100,
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
            <Link to={`/product/${params.id}`}>
              <button>
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
            <button onClick={() => handleEventDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </button>
          </>
        );
      },
    },
  ];

  const row = [];

  shopEvents &&
    shopEvents.forEach((event) => {
      row.push({
        id: event._id,
        name: event.name,
        price: 'US$ ' + event.discountPrice,
        Stock: event.stock,
        sold: event.sold_out,
      });
    });

  return (
    <section className="all-shop-events-wrapper">
      <h1 className="title">{currentSeller.name} Event </h1>
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

export default AllShopEvents;
