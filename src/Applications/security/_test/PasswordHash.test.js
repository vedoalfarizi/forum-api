const EncryptionHelper = require('../PasswordHash');

describe('EncryptionHelper interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const encryptionHelper = new EncryptionHelper();

    await expect(encryptionHelper.hash('')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
    await expect(encryptionHelper.comparePassword('', '')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });
});
