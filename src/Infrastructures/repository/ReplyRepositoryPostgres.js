const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailedReply = require('../../Domains/replies/entities/DetailedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const {
      userId,
      commentId,
      content,
    } = addReply;

    const id = `reply-${this._idGenerator()}`;

    const result = await this._pool.query({
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $5) RETURNING id, content, owner',
      values: [id, commentId, userId, content, new Date()],
    });

    return new AddedReply({ ...result.rows[0] });
  }

  async getAllCommentReplies() {
    const result = await this._pool.query({
      text: `SELECT replies.id, users.username, replies.inserted_at, replies.content, replies.deleted_at,
      replies.comment_id
      FROM replies
      INNER JOIN users ON users.id = replies.owner
      ORDER BY replies.inserted_at ASC`,
      values: [],
    });

    return result.rows.map((comment) => new DetailedReply(comment));
  }
}

module.exports = ReplyRepositoryPostgres;
