const { assert } = require('chai');

const {
  generateRandomString,
  emailAlreadyExists,
  getUserByEmail,
  userIDExists,
  getUserID,
  urlsForUsers
} = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";

    assert.equal(user, expectedOutput);
  });

  it('should return undefined if the users email does not exist', () => {
    const user = getUserByEmail("asdf@fakeemail.com", testUsers);
    assert.isUndefined(user);
  });
});

describe('generateRandomString', () => {

});

describe('emailAlreadyExists', () => {

});

describe('userIDExists', () => {

});

describe('getUserID', () => {

});

describe('urlsForUsers', () => {

});