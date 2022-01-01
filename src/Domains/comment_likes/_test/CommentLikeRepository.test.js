const CommentLikeRepository = require('../CommentLikeRepository');

describe('CommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const commentLikeRepository = new CommentLikeRepository();

    await expect(commentLikeRepository.updateLikeDislikeCommentByUser('', '')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
