import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { handleError } from "../errorHandler/ErrorMessage";
import { API } from "../security/secreteKey";

const useFetchSuppliers = (url) => {
  // State variables
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const response = await axios.get(`${API}/${url}`);
      setData(response.data);
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Fetch data on mount and when URL changes
  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchData();

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted components
    };
  }, [fetchData]);

  return { data, loading, error };
};

export default useFetchSuppliers;
