const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

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
}

module.exports = ReplyRepositoryPostgres;
