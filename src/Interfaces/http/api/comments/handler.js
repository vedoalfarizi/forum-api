const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const addedComment = await commentUseCase.addCommentExec({
      ...request.payload,
      ...request.params,
      userId: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    await commentUseCase.deleteCommentExec({
      ...request.params,
      userId: request.auth.credentials.id,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
