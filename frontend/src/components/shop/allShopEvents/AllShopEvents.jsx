import { useEffect, useState } from "react";
import "./AllShopEvents.scss";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  clearEventErrorsAction,
  deleteEvent,
  fetchShopEvents,
} from "../../../redux/actions/event";

const AllShopEvents = () => {
  const dispatch = useDispatch();

  // Global state variables
  const { loading, shopEvents, error } = useSelector((state) => state.event);
  const { currentSeller } = useSelector((state) => state.seller);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (currentSeller) {
      dispatch(clearEventErrorsAction());
      dispatch(fetchShopEvents());
    }

    return () => {
      if (error) {
        dispatch(clearEventErrorsAction());
      }
    };
  }, [dispatch, currentSeller, error]);

  // Handle event deletion
  const handleEventDelete = async (eventID) => {
    setDeleting(true);
    try {
      await dispatch(deleteEvent(eventID));
    } catch (err) {
      console.error("Event deletion failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { field: "eventCode", headerName: "Event Code", minWidth: 400, flex: 0.8 },
    { field: "title", headerName: "Event Name", minWidth: 400, flex: 1.2 },
    {
      field: "originalPrice",
      headerName: "Original Price",
      minWidth: 120,
      flex: 0.8,
    },
    {
      field: "discountPrice",
      headerName: "Discount Price",
      minWidth: 120,
      flex: 0.8,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "soldOut",
      headerName: "Sold Out",
      type: "number",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "endDate",
      headerName: "End Date",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: "eventStatus", headerName: "Status", minWidth: 120, flex: 0.8 },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Preview",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/event/${params.id}`} aria-label="View event">
          <button className="preview-btn">
            <AiOutlineEye size={20} />
          </button>
        </Link>
      ),
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Delete",
      sortable: false,
      renderCell: (params) => (
        <button
          className="delete-btn"
          onClick={() => handleEventDelete(params.id)}
          disabled={deleting}
          aria-label="Delete event"
        >
          <AiOutlineDelete size={20} />
        </button>
      ),
    },
  ];

  const rows =
    shopEvents?.map((event) => ({
      id: event._id,
      eventCode: event.eventCode,
      title: event.title,
      originalPrice: `$ ${event.originalPrice}`,
      discountPrice: `$ ${event.discountPrice}`,
      stock: event.stock,
      soldOut: event.soldOut,
      startDate: event.startDate,
      endDate: event.endDate,
      eventStatus: event.eventStatus,
    })) || [];

  return (
    <section className="shop-events-wrapper">
      <h1 className="title">{currentSeller?.name} Events</h1>

      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p className="error-message">Error fetching events: {error}</p>
      ) : (
        <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
      )}
    </section>
  );
};

export default AllShopEvents;
