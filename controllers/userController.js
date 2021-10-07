const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.create_user = async (request, response) => {
  const body = request.body;
  if (body.password === undefined) {
    return response.status(400).json({ error: 'password missing' });
  } else if (body.password.split('').length < 3) {
    return response
      .status(400)
      .json({ error: 'password must have a length of at least 3' });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = {
    username: body.username,
    passwordHash,
  };

  const savedUser = await User.createUser(user);

  response.json(savedUser);
};
