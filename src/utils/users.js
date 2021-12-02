const users = [];
// { id, username, channel }
// addUser, removeUser, getUser, getUserListInChannel

const addUser = (id, username, channel) => {

  // id username ve channel gerekli
  if (!username || !id || !channel) {
    return {
      error: 'Kullanici adi ve kanal bilgisi gerekli.'
    }
  }

  // username kontrolu
  const existingUser = users.find(user =>
          user.channel === channel && user.username === username)

  if (existingUser) {
    return {
      error: 'Kullanici adi kullaniliyor.'
    }
  }

  const user = { id, username, channel };
  users.push(user);
  return {
    user
  };
}

const getUser = (id) => {
  return users.find(user => user.id === id);
}

const removeUser = (id) => {
  const userIndex = users.findIndex(user => user.id === id);
  return userIndex !== -1 ? users.splice(userIndex, 1)[0] : -1;
}

const getUserListInChannel = (channel) => {
  return users.filter(user => user.channel === channel);
}

module.exports = {
  addUser,
  getUser,
  removeUser,
  getUserListInChannel
}
