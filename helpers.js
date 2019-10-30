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
}

const userIDExists = function(userID) {
    for (const user in users) {
        if (user === userID) return true;
    }
    return false;
}

const getUserID = function(email) {
    for (const user in users) {
        if (users[user].email === email) {
            return user;
        }
    }
    return false;
}

const urlsForUsers = function(userID) {
    const userURLs = {};

    for (const url in urlDatabase) {
        if (urlDatabase[url].userID === userID) {
            userURLs[url] = urlDatabase[url];
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