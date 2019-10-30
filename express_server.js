const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-session');

const bcrypt = require('bcrypt');

const {
  generateRandomString,
  emailAlreadyExists,
  getUserByEmail,
  userIDExists,
  getUserID,
  urlsForUsers
} = require('./helpers');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser({
  name: 'session',
  keys: ['J:AOSD89wqht98qfupjqwe9dfpja9pyh(SA*uJAISLOFASDRJWEAFH893WAHUAWLFDJ.LJK:asojd:oISDHF9QIWEHF9IQW'],
}));
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "" }
};

const users = {};

app.get("/", (req, res) => {
  if (userIDExists(req.session, users)) {
    console.log(req.session.user_id);
    res.redirect("/urls");
  }
  res.redirect("/login");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: {}};

  if (userIDExists(req.session, users)) {
    templateVars.urls = urlsForUsers(req.session.user_id);
    templateVars.user = users[req.session.user_id];
  } else templateVars.user = undefined;

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {};

  if (userIDExists(req.session, users)) {
    templateVars.user = users[req.session.user_id];
  } else {
    res.redirect("/login");
  }

  res.render("urls_new", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {};

  if (userIDExists(req.session, users)) {
    res.redirect("/urls");
  } else templateVars.user = undefined;

  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {};

  if (userIDExists(req.session, users)) {
    templateVars.user = users[req.session.user_id];
  } else templateVars.user = undefined;

  res.render("urls_register", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] };

  if (userIDExists(req.session, users) &&
        urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    templateVars.user = users[req.session.user_id];
  } else {
    templateVars.user = undefined;
    res.redirect("/urls");
  }

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

app.post("/urls", (req, res) => {
  const randoString = generateRandomString();

  if (userIDExists(req.session, users)) {
    urlDatabase[randoString] = {
      userID: req.session.user_id,
      longURL: req.body.longURL,
    };
    res.redirect(`/urls/${randoString}`);
  } else {
    res.send(403);
    res.redirect('/urls');
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {

  if (userIDExists(req.session, users) &&
        urlDatabase[req.params.shortURL] &&
        urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls/`);
  } else {
    res.send(403);
    res.redirect('/urls');
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {

  if (userIDExists(req.session, users) &&
        urlDatabase[req.params.shortURL] &&
        urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    urlDatabase[req.params.shortURL] = req.body.longURL;
    res.redirect(`/urls/`);
  } else {
    res.send(403);
    res.redirect('/urls');
  }
});

app.post("/login", (req, res) => {
  const userID = getUserID(req.body.email, users);
  if (!emailAlreadyExists(req.body.email, users) ||
        !bcrypt.compareSync(req.body.password, users[userID].password)) {
    res.send(403);
  }

  req.session.user_id = userID;
  res.redirect('/urls/');
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  const userID = generateRandomString();

  if (!req.body.email || !req.body.password ||
        emailAlreadyExists(req.body.email, users)) {
    res.send(400);
  }

  users[userID] = {
    id: userID,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };
  console.log(users[userID]);
  req.session.user_id = userID;

  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});