import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api',
});

export const fetchProperties = async () => {
  const res = await API.get('/properties');
  return res.data;
};

export const createProperty = async (propertyFormData) => {
  // propertyFormData should be a FormData object from your React form
  const res = await API.post('/properties', propertyFormData, {
    headers: {
      'Content-Type': 'multipart/form-data', // important for file uploads
    },
  });
  return res.data;
};

export const deleteProperty = async (id) => {
  const res = await API.delete(`/properties/${id}`);
  return res.data;
};
