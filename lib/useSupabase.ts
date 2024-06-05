import { View, Text, Alert } from 'react-native'
import React, { useState, useEffect} from 'react'


const useSupabase = (fn) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
   
    const fetchData = async () => {
        setLoading(true);
        try {
          const res = await fn();
          setData(res);
        } catch (error) {
          Alert.alert("Error");
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);
    
      const refetch = () => fetchData();
    
      return { data, loading, refetch };
    };

export default useSupabase;