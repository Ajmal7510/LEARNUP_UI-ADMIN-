


import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your API base URL
  timeout: 300000,
});

// Add a request interceptor
API.interceptors.request.use(
  (config) => {
    // Retrieve token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Attach token to Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      window.alert('token is not available')
      // No token, redirect to login
      window.location.href = '/login'; // Replace with your login route
    }
    return config;
  },
  (error) => {
    // Request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
API.interceptors.response.use(
  (response) => {
    // Handle successful responses
    if (response.status === 200 || response.status === 201) {
      console.log('Response Success:', response.data);
    }
    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
        window.alert('something woring ')
      if (error.response.status === 401) {
        console.error('Unauthorized! Redirecting to login...');
        localStorage.removeItem('token'); 
        window.alert('somthing woring unotherize')// Clear token
        window.location.href = '/login'; // Redirect to login page
      } else if (error.response.status === 400 || error.response.status === 500) {
        console.error('Error Response:', error.response.data);
        // Handle other specific error cases
      }
    }
    return Promise.reject(error);
  }
);

export default API;
