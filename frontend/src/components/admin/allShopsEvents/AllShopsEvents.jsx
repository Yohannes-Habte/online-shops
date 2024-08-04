import React, { useEffect, useState } from 'react';
import './AllShopsEvents.scss';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { HiOutlineEye } from 'react-icons/hi';
import { API } from '../../../utils/security/secreteKey';

const AllShopsEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const allEvents = async () => {
      try {
        const { data } = await axios.get(`${API}/events/all-events`);
        setEvents(data.events);
      } catch (error) {
        console.log(error);
      }
    };
    allEvents();
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
      field: 'Preview',
      flex: 0.8,
      minWidth: 100,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/product/${params.id}?isEvent=true`}>
            <button>
              <HiOutlineEye />
            </button>
          </Link>
        );
      },
    },
  ];

  const row = [];

  events &&
    events.forEach((event) => {
      row.push({
        id: event._id,
        name: event.name,
        price: '$ ' + event.discountPrice,
        Stock: event.stock,
        sold: event.sold_out,
      });
    });

  return (
    <section className="all-events-container">
      <h3 className="all-events-title">List of Events</h3>
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

export default AllShopsEvents;
