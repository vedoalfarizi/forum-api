const pool = require('../../database/postgres/pool');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const fakeIdGenerator = () => '123';

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      const addReply = new AddReply({
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'a reply to the comment',
      });

      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepository.addReply(addReply);
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');

      expect(reply).toHaveLength(1);
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: addedReply.content,
        owner: addedReply.owner,
      }));
    });
  });
});
