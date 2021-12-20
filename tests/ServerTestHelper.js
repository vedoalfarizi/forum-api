/* istanbul ignore file */

const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
  async getAccessToken() {
    const userPayload = {
      id: 'user-id',
      username: 'dicoding',
    };
    await UsersTableTestHelper.addUser(userPayload);

    return Jwt.token.generate(userPayload, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = ServerTestHelper;
