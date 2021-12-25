class DetailedComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, inserted_at, content, deleted_at,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = inserted_at;
    this.content = deleted_at === null ? content : '**komentar telah dihapus**';
  }

  _verifyPayload({
    id, username, content, inserted_at,
  }) {
    if (!id || !username || !content || !inserted_at) {
      throw new Error('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if ([typeof id, typeof username, typeof content, typeof inserted_at]
      .some((type) => type !== 'string')) {
      throw new Error('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailedComment;
