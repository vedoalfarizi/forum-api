const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

const ReplyUseCase = require('../ReplyUseCase');

describe('ReplyUseCase', () => {
  describe('addReply function', () => {
    it('should orchestrating the add reply action correctly', async () => {
      const useCasePayload = {
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'a reply to the comment',
      };

      const expectedResponse = new AddedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      });

      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      mockCommentRepository.verifyThreadComments = jest.fn(() => Promise.resolve());
      mockReplyRepository.addReply = jest.fn(() => Promise.resolve(expectedResponse));

      const replyUseCase = new ReplyUseCase({
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      const addedReply = await replyUseCase.addReplyExec(useCasePayload);
      expect(addedReply).toStrictEqual(expectedResponse);
      expect(mockCommentRepository.verifyThreadComments)
        .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
      expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
        userId: useCasePayload.userId,
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        content: useCasePayload.content,
      }));
    });
  });
});
