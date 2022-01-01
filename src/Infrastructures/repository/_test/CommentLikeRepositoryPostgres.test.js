const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');

const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('updateLikeDislikeCommentByUser', () => {
    it('should add like comment to database', async () => {
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool);
      const payload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };

      await commentLikeRepository.updateLikeDislikeCommentByUser(
        payload.commentId,
        payload.userId,
      );

      const like = await CommentLikesTableTestHelper.findUserCommentLike(
        payload.commentId,
        payload.userId,
      );
      expect(like).toHaveLength(1);
    });

    it('should delete like comment from database', async () => {
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool);
      const payload = {
        commentId: 'comment-123',
        userId: 'user-123',
      };

      await CommentLikesTableTestHelper.addLike({});

      await commentLikeRepository.updateLikeDislikeCommentByUser(
        payload.commentId,
        payload.userId,
      );

      const like = await CommentLikesTableTestHelper.findUserCommentLike(
        payload.commentId,
        payload.userId,
      );
      expect(like).toHaveLength(0);
    });
  });
});
