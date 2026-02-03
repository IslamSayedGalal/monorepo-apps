import axios from 'axios';
import { cleanupTestData } from '../support/test-helpers';

describe('Tags E2E', () => {
  const createdTagIds: number[] = [];

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData({
      tagIds: createdTagIds,
    });
  });

  describe('POST /tags', () => {
    it('should create tag with name', async () => {
      const createDto = {
        name: 'Summer',
      };

      const response = await axios.post('/tags', createDto);

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe(createDto.name);
      expect(response.data.slug).toBeDefined();
      expect(response.data.code).toBeDefined();
      expect(response.data.code).toMatch(/^TAG-/);
      expect(response.data.isActive).toBe(true);

      if (response.data.id) {
        createdTagIds.push(response.data.id);
      }
    });

    it('should auto-generate slug and code via database triggers', async () => {
      const createDto = {
        name: 'Winter Collection',
      };

      const response = await axios.post('/tags', createDto);

      expect(response.status).toBe(201);
      expect(response.data.slug).toBeDefined();
      expect(response.data.slug).toMatch(/^winter-collection/);
      expect(response.data.code).toBeDefined();
      expect(response.data.code).toMatch(/^TAG-/);

      if (response.data.id) {
        createdTagIds.push(response.data.id);
      }
    });

    it('should accept optional description and color', async () => {
      const createDto = {
        name: 'Jazz',
        description: 'Jazz music tag',
        color: '#FF5733',
      };

      const response = await axios.post('/tags', createDto);

      expect(response.status).toBe(201);
      expect(response.data.description).toBe(createDto.description);
      expect(response.data.color).toBe(createDto.color);

      if (response.data.id) {
        createdTagIds.push(response.data.id);
      }
    });

    it('should validate required fields (name)', async () => {
      try {
        await axios.post('/tags', {});
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number; data: { message: string } } }).response.status).toBe(400);
        expect((error as { response: { status: number; data: { message: string } } }).response.data.message).toBeDefined();
      }
    });

    it('should validate name length (max 50 chars)', async () => {
      const createDto = {
        name: 'a'.repeat(51), // 51 characters
      };

      try {
        await axios.post('/tags', createDto);
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number } }).response.status).toBe(400);
      }
    });

    it('should validate color format (hex code)', async () => {
      const createDto = {
        name: 'Test Tag',
        color: 'invalid-color',
      };

      try {
        await axios.post('/tags', createDto);
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number } }).response.status).toBe(400);
      }
    });

    it('should accept valid hex color codes', async () => {
      const createDto = {
        name: 'Color Tag',
        color: '#ABC123',
      };

      const response = await axios.post('/tags', createDto);

      expect(response.status).toBe(201);
      expect(response.data.color).toBe(createDto.color);

      if (response.data.id) {
        createdTagIds.push(response.data.id);
      }
    });
  });

  describe('GET /tags', () => {
    it('should return array of tags', async () => {
      const response = await axios.get('/tags');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should be ordered by createdAt DESC', async () => {
      // Create two tags with a small delay
      const tag1 = await axios.post('/tags', { name: 'First Tag' });
      await new Promise((resolve) => setTimeout(resolve, 100));
      const tag2 = await axios.post('/tags', { name: 'Second Tag' });

      if (tag1.data.id) createdTagIds.push(tag1.data.id);
      if (tag2.data.id) createdTagIds.push(tag2.data.id);

      const response = await axios.get('/tags');

      expect(response.status).toBe(200);
      const firstTag = response.data.find((t: { id: number }) => t.id === tag2.data.id);
      const secondTag = response.data.find((t: { id: number }) => t.id === tag1.data.id);

      if (firstTag && secondTag) {
        const firstIndex = response.data.indexOf(firstTag);
        const secondIndex = response.data.indexOf(secondTag);
        expect(firstIndex).toBeLessThan(secondIndex);
      }
    });
  });

  describe('GET /tags/:id', () => {
    let tagId: number;

    beforeAll(async () => {
      const response = await axios.post('/tags', {
        name: 'Get Test Tag',
        description: 'Test description',
      });
      tagId = response.data.id;
      if (tagId) createdTagIds.push(tagId);
    });

    it('should return tag by id', async () => {
      const response = await axios.get(`/tags/${tagId}`);

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(tagId);
      expect(response.data.name).toBe('Get Test Tag');
      expect(response.data.description).toBe('Test description');
    });

    it('should return 404 for non-existent tag', async () => {
      try {
        await axios.get('/tags/999999');
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number } }).response.status).toBe(404);
      }
    });
  });

  describe('PATCH /tags/:id', () => {
    let tagId: number;

    beforeAll(async () => {
      const response = await axios.post('/tags', {
        name: 'Update Test Tag',
      });
      tagId = response.data.id;
      if (tagId) createdTagIds.push(tagId);
    });

    it('should update tag name', async () => {
      const updateDto = {
        name: 'Updated Tag Name',
      };

      const response = await axios.patch(`/tags/${tagId}`, updateDto);

      expect(response.status).toBe(200);
      expect(response.data.name).toBe(updateDto.name);
    });

    it('should update tag description', async () => {
      const updateDto = {
        description: 'Updated description',
      };

      const response = await axios.patch(`/tags/${tagId}`, updateDto);

      expect(response.status).toBe(200);
      expect(response.data.description).toBe(updateDto.description);
    });

    it('should update tag color', async () => {
      const updateDto = {
        color: '#00FF00',
      };

      const response = await axios.patch(`/tags/${tagId}`, updateDto);

      expect(response.status).toBe(200);
      expect(response.data.color).toBe(updateDto.color);
    });

    it('should regenerate slug when name changes', async () => {
      const originalResponse = await axios.get(`/tags/${tagId}`);
      const originalSlug = originalResponse.data.slug;

      const updateDto = {
        name: 'Completely New Name',
      };

      const response = await axios.patch(`/tags/${tagId}`, updateDto);

      expect(response.status).toBe(200);
      expect(response.data.name).toBe(updateDto.name);
      expect(response.data.slug).toBeDefined();
      expect(response.data.slug).not.toBe(originalSlug);
      expect(response.data.slug).toMatch(/^completely-new-name/);
    });

    it('should return 404 for non-existent tag', async () => {
      try {
        await axios.patch('/tags/999999', { name: 'Test' });
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number } }).response.status).toBe(404);
      }
    });
  });

  describe('DELETE /tags/:id', () => {
    let tagId: number;

    beforeEach(async () => {
      const response = await axios.post('/tags', {
        name: 'Delete Test Tag',
      });
      tagId = response.data.id;
    });

    it('should delete tag', async () => {
      const response = await axios.delete(`/tags/${tagId}`);

      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Tag deleted successfully');

      // Verify it's deleted (should not be found)
      try {
        await axios.get(`/tags/${tagId}`);
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number } }).response.status).toBe(404);
      }
    });

    it('should return success message', async () => {
      const response = await axios.delete(`/tags/${tagId}`);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
      expect(response.data.message).toContain('deleted successfully');
    });

    it('should return 404 for non-existent tag', async () => {
      try {
        await axios.delete('/tags/999999');
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect((error as { response: { status: number } }).response.status).toBe(404);
      }
    });
  });
});
