import axios from 'axios';

describe('Admin Panel API E2E - Basic Connectivity', () => {
  it('should be able to reach the API', async () => {
    // Test basic connectivity by checking if playlists endpoint is accessible
    const res = await axios.get('/playlists');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('should be able to reach tags endpoint', async () => {
    // Test basic connectivity by checking if tags endpoint is accessible
    const res = await axios.get('/tags');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });
});
