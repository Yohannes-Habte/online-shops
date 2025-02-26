import { useEffect } from "react";
import "./AllShopsEvents.scss";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  clearEventErrorsAction,
  fetchAllEvents,
} from "../../../redux/actions/event";

const AllShopEvents = () => {
  const dispatch = useDispatch();

  // Global state variables
  const { loading, events, error } = useSelector((state) => state.event);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      dispatch(clearEventErrorsAction());
      dispatch(fetchAllEvents());
    }

    return () => {
      if (error) {
        dispatch(clearEventErrorsAction());
      }
    };
  }, [dispatch, currentUser, error]);

  const columns = [
    { field: "eventCode", headerName: "Event Code", minWidth: 400, flex: 0.8 },
    { field: "eventName", headerName: "Event Name", minWidth: 400, flex: 1.2 },
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
  ];

  const rows =
    events?.map((event) => ({
      id: event._id,
      eventCode: event.eventCode,
      eventName: event.eventName,
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
      <h1 className="title"> Entire Events</h1>

      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p className="error-message">Error fetching events: {error}</p>
      ) : (
        <DataGrid
          rows={rows}
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
