function getUserInfo(user) {
    return {
      email: user.email,
      name: user.name,
      id: user.id || user._id,
    };
  }
  
  module.exports = getUserInfo;