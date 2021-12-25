const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailedThreadComments = require('../../../Domains/threads/entities/DetailedThreadComments');

const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

const ThreadUseCase = require('../ThreadUseCase');

describe('ThreadUseCase', () => {
  describe('addThread function', () => {
    it('should orchestrating the add thread action correctly', async () => {
      const useCasePayload = {
        userId: 'user-id',
        title: 'a title',
        body: 'a body that related to the title',
      };

      const expectedResponse = new AddedThread({
        id: 'thread-id',
        title: useCasePayload.title,
        owner: useCasePayload.userId,
      });

      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.addThread = jest.fn()
        .mockImplementation(() => Promise.resolve(expectedResponse));

      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
      });

      const addedThread = await threadUseCase.addThreadExec(useCasePayload);

      expect(addedThread).toStrictEqual(expectedResponse);
      expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
        userId: useCasePayload.userId,
        title: useCasePayload.title,
        body: useCasePayload.body,
      }));
    });
  });

  describe('getThreadDetails function', () => {
    it('should orchestrating the get thread details action correctly', async () => {
      const useCasePayload = {
        threadId: 'thread-123',
      };

      const expectedThreadResponse = {
        id: useCasePayload.threadId,
        title: 'a title',
        body: 'a body that related to the title',
        inserted_at: '2021-12-22T22:42:08.179+07:00',
        username: 'dicoding',
      };

      const expectedCommentResponse = [
        {
          id: 'comment-123',
          username: 'vedoalfarizi',
          inserted_at: '2021-12-22T22:42:14.859+07:00',
          content: 'a comment',
          deleted_at: '2021-12-22T22:44:14.859+07:00',
        },
        {
          id: 'comment-456',
          username: 'vedoalfarizi',
          inserted_at: '2021-12-22T22:50:14.859+07:00',
          content: 'a second comment',
          deleted_at: null,
        },
      ];

      const expectedResponse = new DetailedThreadComments(
        expectedThreadResponse,
        expectedCommentResponse,
      );

      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      mockThreadRepository.getDetailById = jest.fn()
        .mockImplementation(() => Promise.resolve(expectedThreadResponse));
      mockCommentRepository.getAllCommentByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(expectedCommentResponse));

      const threadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      const detailedThread = await threadUseCase.getThreadDetailExec(useCasePayload);

      expect(detailedThread).toStrictEqual(expectedResponse);
      expect(mockThreadRepository.getDetailById).toBeCalledWith(useCasePayload.threadId);
      expect(mockCommentRepository.getAllCommentByThreadId)
        .toBeCalledWith(useCasePayload.threadId);
    });

    it('shoud return error cause not contrain needed property', async () => {
      const useCasePayload = {
        inValid: '',
      };

      const threadUseCase = new ThreadUseCase({
        threadRepository: {},
        commentRepository: {},
      });

      await expect(threadUseCase.getThreadDetailExec(useCasePayload)).rejects.toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('shoud return error cause not meet data type spec', async () => {
      const useCasePayload = {
        threadId: true,
      };

      const threadUseCase = new ThreadUseCase({
        threadRepository: null,
        commentRepository: null,
      });

      await expect(threadUseCase.getThreadDetailExec(useCasePayload)).rejects.toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });
});
