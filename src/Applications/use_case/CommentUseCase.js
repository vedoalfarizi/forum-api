const AddComment = require('../../Domains/comments/entities/AddComment');
const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

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

  async deleteCommentExec(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);

    await this._commentRepository.verifyThreadComments(
      deleteComment.threadId,
      deleteComment.commentId,
    );

    await this._commentRepository.verifyCommentOwner(deleteComment.commentId, deleteComment.userId);

    await this._commentRepository.deleteComment(deleteComment.commentId);
  }
}

module.exports = CommentUseCase;
