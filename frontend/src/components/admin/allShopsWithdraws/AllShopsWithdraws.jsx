import React, { useEffect, useState } from 'react';
import './AllShopsWithdraws.scss';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { BsPencil } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { API } from '../../../utils/security/secreteKey';
import { IoClose } from 'react-icons/io5';

const AllShopsWithdraws = () => {
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState('Processing');
  const [withdraws, setWithdraws] = useState([]);

  // Get all shops withdraws
  useEffect(() => {
    const allWithdraws = async () => {
      try {
        const { data } = await axios.get(`${API}/wthdraws`);
        setWithdraws(data.withdraws);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    allWithdraws();
  }, []);

  // Delete a single shop withdraw
  const handleSubmit = async () => {
    try {
      const withdrawRequest = {
        sellerId: withdrawData.shopId,
      };
      const { data } = await axios.put(
        `${API}/wthdraws/update/${withdrawData.id}`,
        withdrawRequest
      );
      toast.success('Withdraw request updated successfully!');
      setWithdraws(data.withdraws);
      setOpen(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'Withdraw Id', minWidth: 150, flex: 0.7 },
    {
      field: 'name',
      headerName: 'Shop Name',
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: 'shopId',
      headerName: 'Shop Id',
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: 'status',
      headerName: 'status',
      type: 'text',
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: 'createdAt',
      headerName: 'Request given at',
      type: 'number',
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: ' ',
      headerName: 'Update Status',
      type: 'number',
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => {
        return (
          <BsPencil
            size={20}
            className={params.row.status !== 'Processing' ? 'hidden' : ''}
            onClick={() => setOpen(true) || setWithdrawData(params.row)}
          />
        );
      },
    },
  ];

  const row = [];

  console.log('withdraws =', withdraws);

  withdraws &&
    withdraws.forEach((withdraw) => {
      row.push({
        id: withdraw._id,
        shopId: withdraw.seller._id,
        name: withdraw.seller.name,
        amount: '$ ' + withdraw.amount,
        status: withdraw.status,
        createdAt: withdraw.createdAt.slice(0, 10),
      });
    });
  return (
    <article className="admin-withdraws-container">
      <h2 className="admin-withdraws-title"> Shops Withdraws</h2>
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />

      {open && (
        <section className="admin-update-withdraw-status-wrapper">
          <IoClose className="close-icon" onClick={() => setOpen(false)} />

          <h3 className="update-withdraw-status">Update Withdraw status</h3>

          <section
            name=""
            id=""
            onChange={(e) => setWithdrawStatus(e.target.value)}
            className="section-field"
          >
            <option value={withdrawStatus}>{withdrawData.status}</option>
            <option value={withdrawStatus}>Succeed</option>
          </section>

          <button
            type="submit"
            className={`admin-update-withdraw-btn`}
            onClick={handleSubmit}
          >
            Update
          </button>
        </section>
      )}
    </article>
  );
};

export default AllShopsWithdraws;
