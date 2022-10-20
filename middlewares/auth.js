const jwt = require('jsonwebtoken');
const { AppError, appErrors } = require('../utils/app-error');

const { DEV_JWT_SECRET } = require('../utils/dev-key');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, DEV_JWT_SECRET);
  } catch (e) {
    const err = new AppError(appErrors.notAuthorized);
    next(err);
  }
  req.user = payload;
  next();
};
