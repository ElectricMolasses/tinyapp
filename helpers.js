const generateRandomString = function() {
  const randomString = new Array(6).fill(0);

  const possibleCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  randomString.forEach((current, i) => {
    randomString[i] = possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)];
  });
  return randomString.join('');
};

const emailAlreadyExists = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return true;
    }
  }
  return false;
};

const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
};

const userIDExists = function(userID, database) {
  for (const user in database) {
    if (user === userID) return true;
  }
  return false;
};

const getUserID = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
  return false;
};

const urlsForUsers = function(userID, database) {
  const userURLs = {};

  for (const url in database) {
    if (database[url].userID === userID) {
      userURLs[url] = database[url];
    }
  }
  return userURLs;
};

module.exports = {
  generateRandomString,
  emailAlreadyExists,
  getUserByEmail,
  userIDExists,
  getUserID,
  urlsForUsers,
};