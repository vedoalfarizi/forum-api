const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
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

  async deleteComment(commentId) {
    await this._pool.query({
      text: 'UPDATE comments SET deleted_at = $1 WHERE id = $2',
      values: [new Date(), commentId],
    });
  }

  async verifyThreadComments(threadId, commentId) {
    const result = await this._pool.query({
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    });

    if (!result.rowCount) throw new NotFoundError('Komentar pada thread tidak ditemukan');
  }

  async verifyCommentOwner(commentId, owner) {
    const result = await this._pool.query({
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    });

    if (!result.rowCount) throw new AuthorizationError('Tidak dapat menghapus komentar yang bukan milik Anda');
  }
}

module.exports = CommentRepsitoryPostgres;
