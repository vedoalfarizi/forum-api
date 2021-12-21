const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    const fakeIdGenerator = () => '123';

    it('should persist add thread and return added thread correctly', async () => {
      const addComment = new AddComment({
        userId: 'user-123',
        content: 'a content',
        threadId: 'thread-123',
      });

      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepository.addComment(addComment);

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      const addComment = new AddComment({
        userId: 'user-123',
        content: 'a content',
        threadId: 'thread-123',
      });

      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const addedComment = await commentRepository.addComment(addComment);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: addComment.userId,
      }));
    });
  });
});
