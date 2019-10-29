const express = require('express');
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const generateRandomString = function() {
    const randomString = new Array(6).fill(0);

    const possibleCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    randomString.forEach((current, i) => {
        randomString[i] = possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)];
    });
    return randomString.join('');
};

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/hello", (req, res) => {
    res.send("<html>")
});

app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
    res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    res.redirect(urlDatabase[req.params.shortURL]);
});

app.post("/urls", (req, res) => {
    const randoString = generateRandomString();
    urlDatabase[randoString] = req.body.longURL;
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
    console.log(req.body.username);
    res.cookie('username', req.body.username);
    res.redirect('/urls/');
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});