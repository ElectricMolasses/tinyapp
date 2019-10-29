const express = require('express');
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

const generateRandomString = function() {
    const randomString = new Array(6).fill(0);

    const possibleCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    randomString.forEach((current, i) => {
        randomString[i] = possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)];
    });
    return randomString.join('');
};

const emailAlreadyExists = function(email) {
    for (const user in users) {
        if (users[user].email === email) {
            return true;
        }
    }
    return false;
};

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

const urlDatabase = {
    "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "" },
    "9sm5xK": { longURL: "http://www.google.com", userID: "" }
};

const users = {};

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/hello", (req, res) => {
    res.send("<html>")
});

app.get("/urls", (req, res) => {
    const templateVars = { urls: {}};
    // req.cookies does provide an empty object if there are no cookies,
    // but it is MISSING hasOwnProperty.
    if (req.cookies && req.cookies.user_id) {
        templateVars.urls = urlsForUsers(req.cookies.user_id);
        templateVars.user = users[req.cookies.user_id];
    } else templateVars.user = undefined;

    res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
    let templateVars = {};

    if (req.cookies && req.cookies.user_id &&
        userIDExists(req.cookies.user_id)) { 
        templateVars.user = users[req.cookies.user_id];
    } else {
        res.redirect("/login");
    }

    res.render("urls_new", templateVars);
});

app.get("/login", (req, res) => {
    let templateVars = {};

    if (req.cookies && req.cookies.user_id) { 
        templateVars.user = users[req.cookies.user_id];
    } else templateVars.user = undefined;

    res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
    let templateVars = {};

    if (req.cookies && req.cookies.user_id) { 
        templateVars.user = users[req.cookies.user_id];
    } else templateVars.user = undefined;

    res.render("urls_register", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, 
        longURL: urlDatabase[req.params.shortURL] };

    if (req.cookies && req.cookies.user_id) { 
        templateVars.user = users[req.cookies.user_id];
    } else templateVars.user = undefined;

    res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    res.redirect(urlDatabase[req.params.shortURL]);
});

app.post("/urls", (req, res) => {
    const randoString = generateRandomString();
    urlDatabase[randoString] = {
        userID: req.cookies.user_id,
        longURL: req.body.longURL,
    };
    res.redirect(`/urls/${randoString}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls/`);
});

app.post("/urls/:shortURL/edit", (req, res) => {
    urlDatabase[req.params.shortURL] = req.body.longURL;
    res.redirect(`/urls/`);
});

app.post("/login", (req, res) => {
    const userID = getUserID(req.body.email);
    if (!emailAlreadyExists(req.body.email) ||
        users[userID].password !== req.body.password) {
        res.send(403);
    }

    res.cookie('user_id', userID);
    res.redirect('/urls/');
});

app.post("/logout", (req, res) => {
    res.clearCookie('user_id');
    res.redirect('/urls/');
});

app.post("/register", (req, res) => {
    const userID = generateRandomString();

    if (!req.body.email || !req.body.password ||
        emailAlreadyExists(req.body.email)) {
        res.send(400);
    }

    users[userID] = {
        id: userID,
        email: req.body.email,
        password: req.body.password,
    };
    res.cookie('user_id', userID);

    res.redirect('/urls');
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});