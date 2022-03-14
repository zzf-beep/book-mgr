const auth = require('./auth/index');
const inviteCode = require('./invite-code/index');
const book = require('./book');

module.exports = (app) => {
  app.use(auth.routes());
  app.use(inviteCode.routes());
  app.use(book.routes());
}