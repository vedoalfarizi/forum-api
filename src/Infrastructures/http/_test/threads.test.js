const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const payload = {
        title: 'a title',
        body: 'a body that related to the title',
      };

      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 401 when auth not valid', async () => {
      const payload = {
        title: 'a title',
        body: 'a body that related to the title',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const payload = {
        title: 'a title',
      };

      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan thread karena title atau body kosong');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const payload = {
        title: ['a title'],
        body: true,
      };

      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan thread karena title atau body tidak valid');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const payload = {
        content: 'a content',
      };

      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({});

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 401 when auth not valid', async () => {
      const payload = {
        content: 'a content',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const payload = {
        invalid: 'a title',
      };

      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({});

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan komentar pada thread karena komentar kosong');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const payload = {
        content: true,
      };

      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({});

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan komentar pada thread karena komentar tidak valid');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and return success', async () => {
      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when auth not valid', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: 'Bearer invalid token',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 404 when thread or comment not found', async () => {
      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar pada thread tidak ditemukan');
    });

    it('should response 403 when user not the author of the comment', async () => {
      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'comentator' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ owner: 'user-234' });

      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Tidak dapat menghapus komentar yang bukan milik Anda');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and persisted detail thread with comments', async () => {
      const server = await createServer(container);

      await ServerTestHelper.addThreadComments();

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    it('should response 404 when thread not exists', async () => {
      const server = await createServer(container);

      await ServerTestHelper.addThreadComments();

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-234',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
