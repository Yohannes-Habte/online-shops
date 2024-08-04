import React, { useEffect, useState } from 'react';
import './AllShopsUsers.scss';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AiFillDelete } from 'react-icons/ai';
import { API } from '../../../utils/security/secreteKey';
import { IoClose } from 'react-icons/io5';

const AllShopsUsers = () => {
  const dispatch = useDispatch();
  // const { users } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);

  // Get all users for all shops
  const allUsers = async () => {
    try {
      const { data } = await axios.get(`${API}/users`);
      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  };

  // Display users on the browser
  useEffect(() => {
    allUsers();
  }, []);

  // Delete a user
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${API}/users/delete-user/${id}`);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }

    allUsers();
  };

  const columns = [
    { field: 'id', headerName: 'User ID', minWidth: 250, flex: 0.7 },

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
      field: 'role',
      headerName: 'User Role',
      type: 'text',
      minWidth: 200,
      flex: 0.7,
    },

    {
      field: 'joinedAt',
      headerName: 'joinedAt',
      type: 'text',
      minWidth: 200,
      flex: 0.8,
    },

    {
      field: ' ',
      flex: 1,
      minWidth: 100,
      headerName: 'Delete User',
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
  users &&
    users.forEach((user) => {
      row.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt.slice(0, 10),
      });
    });

  return (
    <section className="all-users-wrapper">
      <h3 className="all-users-title">All Users</h3>

      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />

      {open && (
        <article className="user-delete-confirmation-wrapper">
          <IoClose className="delete-icon" onClick={() => setOpen(false)} />

          <h3 className="you-want-delete-user">
            Are you sure you want delete this user?
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

export default AllShopsUsers;
