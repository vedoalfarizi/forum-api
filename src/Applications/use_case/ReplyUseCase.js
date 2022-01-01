const AddReply = require('../../Domains/replies/entities/AddReply');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async addReplyExec(useCasePayload) {
    const addReply = new AddReply(useCasePayload);

    await this._commentRepository.verifyThreadComments(
      useCasePayload.threadId,
      useCasePayload.commentId,
    );

    return this._replyRepository.addReply(addReply);
  }
}

module.exports = ReplyUseCase;
