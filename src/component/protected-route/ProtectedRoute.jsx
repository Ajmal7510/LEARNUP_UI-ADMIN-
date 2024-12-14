import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/auth/authSlice';
import API from '../../axis/axiosConfig';

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const validateToken = async () => {
    

      try {
        const response = await API.get('/admin/getUser');

        console.log('Token validated, user:', response.data.user);

        dispatch(login(response.data.user));
      } catch (error) {
        console.error('Token validation failed:', error.message);
        alert('Session expired. Please log in again.');


        window.location.href = '/login';
      }
    };

    validateToken();
  }, [dispatch]);

  if (!auth) {
    return <div>Loading...</div>; 
  }

  return children; 
};

export default ProtectedRoute;
