import { useEffect, useMemo, useState } from "react";
import "./OrderChart.scss";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../loader/Loader";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { fetchSellerOrders } from "../../../../redux/actions/order";
import { clearOrderErrors } from "../../../../redux/reducers/orderReducer";
import { toast } from "react-toastify";

// Map for months (for cleaner readability)
const monthsMap = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const OrderChart = () => {
  const dispatch = useDispatch();
  const { sellerOrders } = useSelector((state) => state.order);
  const {
    data: { monthlyOrderCount = [] },
    loading,
    error,
  } = sellerOrders || {};

  // Local state variables
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [year, setYear] = useState(currentYear);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchSellerOrders());
    return () => {
      dispatch(clearOrderErrors());
    };
  }, [dispatch]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Filter monthlyOrderCount data for the selected year
  const monthlyData = monthlyOrderCount.filter((item) => item.year === year);

  // Process the monthly data and include orderCount, totalItemsOrdered, and grandTotal
  const row = useMemo(
    () =>
      monthlyData.map((item) => ({
        monthName: monthsMap[item.month] || item.month,
        orderCount: item.orderCount,
        totalItemsOrdered: item.totalItemsOrdered,
        grandTotal: item.grandTotal
          ? (item.grandTotal / 500).toFixed(2)
          : "0.00",
      })),
    [monthlyData, year]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputYear = Number(e.target.elements.year.value.trim());
    const selectedYear = Number(inputYear);

    const currentYear = new Date().getFullYear();
    if (selectedYear < 2022 || selectedYear > currentYear) {
      toast.error(`Please enter a valid year between 2022 and ${currentYear}`);
      return;
    }

    setButtonLoading(true);
    setYear(selectedYear);
    setButtonLoading(false);
  };

  return (
    <section className="order-chart-container">
      <h3 className="annual-report-chart-title">
        Comprehensive Monthly Order and Net Income Report – {year}
      </h3>

      <form
        aria-label="Order year selection"
        onSubmit={handleSubmit}
        className="order-year-form"
      >
        <input
          type="number"
          id="year"
          name="year"
          defaultValue={year}
          placeholder="Enter Year"
          className="order-input-field"
          aria-label="Order input field"
        />
        <button
          className="order-year-form-btn"
          aria-label="Search financial reports"
          disabled={buttonLoading}
        >
          {buttonLoading ? (
            <Loader isLoading={buttonLoading} message="" size={20} />
          ) : (
            "Search"
          )}
        </button>
      </form>

      {loading && (
        <Loader isLoading={loading} message="Loading chart..." size={80} />
      )}
      {!loading && error && <p className="error-message">Error: {error}</p>}

      {!loading && !error && row.length > 0 ? (
        <ResponsiveContainer width="100%" aspect={2 / 1}>
          <LineChart
            width={730}
            height={250}
            data={row}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="chart-Grid" />
            <XAxis dataKey="monthName" stroke="gray" />
            <YAxis />
            <Tooltip />

            {/* Legend to display the names of the lines */}
            <Legend />

            {/* Line for Order Count */}
            <Line
              type="monotone"
              dataKey="orderCount"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
              name="Order Count" // Label for the line
            />

            {/* Line for Total Items Ordered */}
            <Line
              type="monotone"
              dataKey="totalItemsOrdered"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Total Items Ordered" // Label for the line
            />

            {/* Line for Grand Total */}
            <Line
              type="monotone"
              dataKey="grandTotal"
              stroke="#ff7300"
              activeDot={{ r: 8 }}
              name="Grand Total (Grand Total / 500)" // Label for the line
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        !loading && (
          <h3 className="no-reports-message">
            No orders found for the year {year}
          </h3>
        )
      )}
    </section>
  );
};

export default OrderChart;
