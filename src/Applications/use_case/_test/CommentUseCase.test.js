const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');

const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

const CommentUseCase = require('../CommentUseCase');

describe('CommentUseCase', () => {
  describe('addComment function', () => {
    it('should orchestrating the add comment action correctly', async () => {
      const useCasePayload = {
        userId: 'user-123',
        threadId: 'thread-123',
        content: 'a content',
      };

      const expectedResponse = new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      });

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      mockThreadRepository.verifyId = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.addComment = jest.fn()
        .mockImplementation(() => Promise.resolve(expectedResponse));

      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      const addedComment = await commentUseCase.addCommentExec(useCasePayload);
      expect(addedComment).toStrictEqual(expectedResponse);
      expect(mockThreadRepository.verifyId).toBeCalledWith(useCasePayload.threadId);
      expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
        userId: useCasePayload.userId,
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should orchestrating the add comment action correctly', async () => {
      const useCasePayload = {
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };

      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockCommentRepository.verifyCommentOwner = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyThreadComments = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.deleteComment = jest.fn()
        .mockImplementation(() => Promise.resolve());

      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      await commentUseCase.deleteCommentExec(useCasePayload);
      expect(mockCommentRepository.verifyCommentOwner)
        .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
      expect(mockCommentRepository.verifyThreadComments)
        .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
      expect(mockCommentRepository.deleteComment)
        .toBeCalledWith(new DeleteComment({
          userId: useCasePayload.userId,
          threadId: useCasePayload.threadId,
          commentId: useCasePayload.commentId,
        }));
    });
  });
});
