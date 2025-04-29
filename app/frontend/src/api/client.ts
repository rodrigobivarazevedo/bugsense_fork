// src/api/client.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // ← your Django host:port
  timeout: 5000,
});

// automatically attach the JWT access token to each request
api.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
