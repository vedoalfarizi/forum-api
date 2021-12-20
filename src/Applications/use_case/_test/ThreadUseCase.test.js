const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
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
});
