import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FetchData = (url) => {
  // Global state variables for fetching comments from the backend
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Display data on the brower
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(url);
        setData(data);
        setLoading(false);
      } catch (err) {
        setError(toast.error(err.response.data.message));
        setLoading(false);
      }
    };

    fetch();
  }, [url]);

  // Function to refetch data
  const reFetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(url);
      setData(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { data, loading, error, reFetch };
};

export default FetchData;
