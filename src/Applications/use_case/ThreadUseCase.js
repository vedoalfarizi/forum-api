const AddThread = require('../../Domains/threads/entities/AddThread');

class ThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async addThreadExec(useCasePayload) {
    const addThread = new AddThread(useCasePayload);

    return this._threadRepository.addThread(addThread);
  }
}

module.exports = ThreadUseCase;
