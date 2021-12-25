const AddThread = require('../../Domains/threads/entities/AddThread');
const DetailedThreadComments = require('../../Domains/threads/entities/DetailedThreadComments');

class ThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addThreadExec(useCasePayload) {
    const addThread = new AddThread(useCasePayload);

    return this._threadRepository.addThread(addThread);
  }

  _verifyThreadDetailPayload({ threadId }) {
    if (!threadId) throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof threadId !== 'string') throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }

  async getThreadDetailExec(useCasePayload) {
    this._verifyThreadDetailPayload(useCasePayload);
    const thread = await this._threadRepository.getDetailById(useCasePayload.threadId);
    const comments = await this._commentRepository.getAllCommentByThreadId(useCasePayload.threadId);

    const threadComments = new DetailedThreadComments(thread, comments);

    return threadComments;
  }
}

module.exports = ThreadUseCase;
