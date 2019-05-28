const userModel = require('../models/user.model');
/**
 * GET /me
 * Get my profile (when connected)
 */
exports.getMe = (req, res, next) => {
  req.assert('token', 'Token is not valid');
  // if (!req.user) res.status(404).send({ error: 'Not connected or session timeout' })

  const { token } = req.body;

  userModel.findOne({ password: token }, (error, user) => {
    if (error) next(error);
    res.status(200).send({
      status: 200,
      user: user
    })
  })
}


exports.updateMe = (req, res, next) => {
  req.assert('name', 'Name is required');

  const { name, id } = req.body;

  userModel.findByIdAndUpdate(id, {
    $set: {
      name: name
    }
  }, (error, user) => {
    if (error) next(error);

    res.status(200).send({
      status: 200,
      user: user
    })
  })
}