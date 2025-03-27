import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../../loader/Loader";
import "./RefundChart.scss";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Map for months (for cleaner readability)
const monthsMap = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const RefundChart = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  // Local state variables
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [year, setYear] = useState(currentYear);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    // dispatch(fetchAllFinancialReports());
    // return () => {
    //   dispatch(clearFinancialReportErrors());
    // };
  }, [dispatch]);

  const row = useMemo(() => {}, [orders]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputYear = e.target.elements.year.value.trim();

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    if (!inputYear || inputYear < 2022 || inputYear > currentYear) {
      alert(`Please enter a valid year between 2022 and ${currentYear}`);
      return;
    }

    setButtonLoading(true);

    setYear(inputYear);

    // await dispatch(fetchAllFinancialReports());
    setButtonLoading(false);
  };
  return (
    <section className="order-chart-container">
      <h3 className="annual-report-chart-title">
        Monthly Financial Report for the Year {year}
      </h3>

      <form
        aria-label="Financial year selection"
        onSubmit={handleSubmit}
        className="financial-year-form"
      >
        <input
          type="number"
          id="year"
          name="year"
          defaultValue={year}
          placeholder="Enter Year"
          className="input-field"
          aria-label="Year input field"
        />
        <button
          className="year-form-btn"
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

      {loading && <Loader isLoading={loading} message="" size={80} />}
      {error && <p className="error-message">Error: {error}</p>}
      {!loading && !error && row.length > 0 ? (
        <ResponsiveContainer width="100%" aspect={2 / 1}>
          <AreaChart
            width={730}
            height={250}
            data={row}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="gray" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" className="chart-Grid" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#total)"
            />
          </AreaChart>
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
}

export default RefundChart
