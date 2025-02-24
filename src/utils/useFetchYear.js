
import { useState, useEffect } from 'react';
import BASE_URL from '../base/BaseUrl';

export const useFetchYear = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${BASE_URL}/api/panel-fetch-year-list`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch years');
        }

        const data = await response.json();
        if (data.code === 200 && Array.isArray(data.year)) {
          setYears(data.year);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  return { years, loading, error };
};