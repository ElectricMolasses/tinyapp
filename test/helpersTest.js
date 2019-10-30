const { assert } = require('chai');

const {
  cleanURL,
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

describe('cleanURL', () => {
  it('should return a string if the site is valid, with or without a prefix', () => {
    assert.isString(cleanURL('facebook.com'));
  });

  it('should return false if he website does not exist, or cannot be accessed', () => {
    assert.isFalse(cleanURL('asldkfjasl'));
  });

  it('should add http:// to a url that is missing a prefix', () => {
    assert.equal(cleanURL('google.com'), 'http://google.com');
  });

  it('should not alter a URL that already has a prefix', () => {
    assert.equal(cleanURL('https://google.com'), 'https://google.com');
  });
});

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
  it('should return a random string', () => {
    const output = generateRandomString();

    assert.isString(output);
  });

  it('should have a length of 6', () => {
    const output = generateRandomString();

    assert.equal(output.length, 6);
  });
});

describe('emailAlreadyExists', () => {
  it('should return true if the email is in the database', () => {
    assert.isTrue(emailAlreadyExists('user2@example.com', testUsers));
  });

  it('should return false if the email is not in the database', () => {
    assert.isFalse(emailAlreadyExists('use1@example.com', testUsers));
  });
});

describe('userIDExists', () => {
  it('should return true if the user ID is in the database, when passed a cookie', () => {
    assert.isTrue(userIDExists({ user_id: 'user2RandomID' }, testUsers));
  });

  it('should return false if the user ID is not in the database, when passed a cookie', () => {
    assert.isFalse(userIDExists({ user_id: 'iamnotreal' }, testUsers));
  });
});

describe('getUserID', () => {
  it('should return a matching user id if email is in the database', () => {
    assert.deepEqual(getUserID('user@example.com', testUsers), 'userRandomID');
  });

  it('should return false if the user object is not in the database', () => {
    assert.isFalse(getUserID('dudemail@emails.bork'));
  });
});

describe('urlsForUsers', () => {
  
});