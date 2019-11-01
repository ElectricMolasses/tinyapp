const express = require('express');
const app = express();
const methodOverride = require('method-override');
const PORT = 8080;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-session');

const bcrypt = require('bcrypt');

const {
  generateRandomString,
  emailAlreadyExists,
  userIDExists,
  getUserID,
  urlsForUsers,
  cleanURL
} = require('./helpers');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser({
  name: 'session',
  keys: ['J:AOSD89wqht98qfupjqwe9dfpja9pyh(SA*uJAISLOFASDRJWEAFH893WAHUAWLFDJ.LJK:asojd:oISDHF9QIWEHF9IQW'],
}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

const urlDatabase = {};

const users = {};

// Redirects logged in users to the urls page, otherwise,
// redirects directly to login.
app.get("/", (req, res) => {
  if (userIDExists(req.session, users)) {
    res.redirect("/urls");
  }
  res.redirect("/login");
});
// Endpoint for index page with all owned URLs.
app.get("/urls", (req, res) => {
  const templateVars = { urls: {}};

  if (userIDExists(req.session, users)) {
    templateVars.urls = urlsForUsers(req.session.user_id, urlDatabase);
    templateVars.user = users[req.session.user_id];
  } else templateVars.user = undefined;

  res.render("urls_index", templateVars);
});
// Endpoint for create URL page.
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
  // Immediately bounces user to url index if they're already signed in.
  if (userIDExists(req.session, users)) {
    res.redirect("/urls");
  } else templateVars.user = undefined;

  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {};
  // Immediately bounces user to url index if they're already signed in.
  if (userIDExists(req.session, users)) {
    templateVars.user = users[req.session.user_id];
    res.redirect("/urls");
    return;
  } else templateVars.user = undefined;

  res.render("urls_register", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  // Confirms the shortURL actually exists, and then passes neccesary
  // information to the page template to display URL information.
  if (userIDExists(req.session, users) && urlDatabase[req.params.shortURL] &&
      urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    let templateVars = {
      user: users[req.session.user_id],
      shortURL: req.params.shortURL,
      url: urlDatabase[req.params.shortURL],
    };
    res.render("urls_show", templateVars);
  } else {
    // Bounce user to index if it's not a valid URL.
    res.redirect("/urls");
  }
});

app.get("/u/:shortURL", (req, res) => {
  // Redirect endpoint, just increments counter for that URL each
  // time someone uses it.
  urlDatabase[req.params.shortURL].timesVisited++;
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

app.post("/urls", (req, res) => {
  const randoString = generateRandomString(urlDatabase);
  // Confirms the user is logged into a valid account before
  // creating a new shortURL object.
  if (userIDExists(req.session, users)) {
    urlDatabase[randoString] = {
      userID: req.session.user_id,
      longURL: cleanURL(req.body.longURL),
      dateCreated: Date.now(),
      timesVisited: 0
    };
    res.redirect(`/urls/${randoString}`);
  } else {
    res.send(403);
    res.redirect('/urls');
  }
});

app.delete("/urls/:shortURL", (req, res) => {
  // Confirms user is signed in and owns that URL before
  // allowing the deletion to pass.
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

app.put("/urls/:shortURL", (req, res) => {
  // Confirms user is signed in and owns that URL before
  // allowing the edit to pass.
  if (userIDExists(req.session, users) &&
        urlDatabase[req.params.shortURL] &&
        urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    urlDatabase[req.params.shortURL].longURL = cleanURL(req.body.longURL);
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
    return;
  }

  req.session.user_id = userID;
  res.redirect('/urls/');
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  // Users are stored under unique, randomly generated keys.
  const userID = generateRandomString(users);

  if (!req.body.email || !req.body.password ||
        emailAlreadyExists(req.body.email, users)) {
    res.send(400);
    return;
  }

  users[userID] = {
    id: userID,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };

  req.session.user_id = userID;

  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});