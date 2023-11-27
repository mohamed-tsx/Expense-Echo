// @description Register new User
// @Route POST /users
// @access public
const register = (req, res) => {
  res.send("This is user registering routes!");
};

// @description Login user
// @Route POST /users/login
// @access public
const login = (req, res) => {
  res.send("This user is logged in!");
};
module.exports = {
  register,
  login,
};
