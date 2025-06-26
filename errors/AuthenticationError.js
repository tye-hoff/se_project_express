class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

export default AuthenticationError;
