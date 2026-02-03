import axios from 'axios';

module.exports = async function () {
  // Configure axios for tests to use.
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT || process.env.ADMIN_API_PORT ?? '3001';
  const prefix = 'api/admin';
  axios.defaults.baseURL = `http://${host}:${port}/${prefix}`;
};
