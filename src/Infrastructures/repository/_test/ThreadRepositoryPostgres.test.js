const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const fakeIdGenerator = () => '123';

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      const addThread = new AddThread({
        userId: 'user-123',
        title: 'a title',
        body: 'a body that related to the title',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(addThread);

      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const addThread = new AddThread({
        userId: 'user-123',
        title: 'a title',
        body: 'a body that related to the title',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: addThread.title,
        owner: addThread.userId,
      }));
    });
  });

  describe('verifyId function', () => {
    const threadId = 'thread-123';

    it('should throw NotFoundError if not valid id', async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await expect(threadRepository.verifyId(threadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if valid id', async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await ThreadsTableTestHelper.addThread({});

      await expect(threadRepository.verifyId(threadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
