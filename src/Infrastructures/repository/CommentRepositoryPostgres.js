const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepsitoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { userId, content, threadId } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const dateNow = new Date();

    const result = await this._pool.query({
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $5) RETURNING id, content, owner',
      values: [id, threadId, userId, content, dateNow],
    });

    return new AddedComment({ ...result.rows[0] });
  }
}

module.exports = CommentRepsitoryPostgres;
