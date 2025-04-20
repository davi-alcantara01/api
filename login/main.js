const express = require("express");
const connection = require("../database/Conection");
const User = require("../users/User");
const session = require("express-session");


const app = express();

function checkAcess(req, res, next) {
  if (req.session.user != undefined) {
    if (req.session.user.email != undefined) {
      User.findOne({ where: { email: req.session.user.email } }).then(
        (user) => {
          if (user != undefined) {
            next();
          } else {
            res.redirect("/login");
          }
        }
      );
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
}

connection
  .authenticate()
  .then(() => {
    console.log("Conectado ao banco de dados (8080)");
  })
  .catch(err => {
    console.log(err);
  })

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
  secret: "mily",
  cookie: {maxAge: 30000000}
}));


app.get("/login", (req, res) => {
  res.render("./login.ejs");
});

app.get("/apiGames", checkAcess, (req, res) => {
  console.log(req.session.user)
    res.render("./index.ejs", {
      email: req.session.user.email,
      senha: req.session.user.senha
    });
});

app.post("/login/verify", (req, res) => {
  //console.log(req.body)
  let email = req.body.email;
  let senha = req.body.senha;

  User.findOne({where: {email: email}}).then(user => {
    if (user != undefined && user.senha == senha) {

      req.session.user = {
        email: user.email,
        senha: user.senha
      };

      res.redirect("/apiGames");

    } else {
      res.redirect("/login");
    }
  })

});

app.listen(8080, () => {
  console.log("Front end de acesso à API rodando na porta 8080.");
});