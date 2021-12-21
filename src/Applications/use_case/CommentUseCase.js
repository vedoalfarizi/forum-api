const AddComment = require('../../Domains/comments/entities/AddComment');

class CommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addCommentExec(useCasePayload) {
    const addComment = new AddComment(useCasePayload);

    await this._threadRepository.verifyId(addComment.threadId);

    return this._commentRepository.addComment(addComment);
  }
}

module.exports = CommentUseCase;
