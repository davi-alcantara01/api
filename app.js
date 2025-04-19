const express = require("express");
const connection = module.require("./database/Conection.js");
const sequelize = require("sequelize");
const Games = module.require("./games/Games.js");
const cors = require("cors");
const User = module.require("./users/User.js");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth.js")

const app = express();

const secretKey = "misly";


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connection
  .authenticate()
  .then(() => {
    console.log("Conectado ao banco de dados!");
  })
  .catch((err) => {
    console.log("Erro ao se conectar com o banco de dados: " + err);
  });

app.get("/games", auth, (req, res) => {
  res.statusCode = 200;
  Games.findAll().then((games) => {
    res.json(games);
  });
});

app.get("/game/:id", auth, (req, res) => {
  let gameId = req.params.id;

  if (isNaN(gameId)) {
    res.sendStatus(400);
  } else {
    gameId = parseInt(gameId);

    Games.findByPk(gameId).then((game) => {
      if (game != undefined) {
        res.json(game);
      } else {
        res.sendStatus(400);
      }
    });
  }
});

app.post("/game", auth, (req, res) => {
  let { title, genre, price } = req.body;
  if (title == undefined || genre == undefined || isNaN(price)) {
    res.sendStatus(400);
  } else {
    Games.create({
      title: title,
      genre: genre,
      price: price,
    });
    res.sendStatus(200);
  }
});

app.delete("/game/:id", auth, (req, res) => {
  let gameId = req.params.id;

  if (isNaN(gameId)) {
    res.sendStatus(400);
  } else {
    gameId = parseInt(gameId);

    Games.findByPk(gameId).then((game) => {
      if (game != undefined) {
        Games.destroy({ where: { id: gameId } }).then(res.sendStatus(200));
      } else {
        res.sendStatus(404);
      }
    });
  }
});

app.put("/game/:id", auth, (req, res) => {
  let gameId = req.params.id;

  if (isNaN(gameId)) {
    res.sendStatus(400);
  } else {
    gameId = parseInt(gameId);

    let { title, genre, price } = req.body;

    Games.findByPk(gameId).then((game) => {

      if (title == undefined) {
        title = game.title;
      }
      if (genre == undefined) {
        genre = game.genre;
      }
      if (price == undefined) {
        price = game.price;
      }

      Games.update(
        {
          title: title,
          genre: genre,
          price: price,
        },
        {
          where: {
            id: gameId,
          },
        }
      ).then(() => {
        if (game != undefined) {
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
        
      });
    });
  }
});

app.post("/auth", (req, res) => {
  let { email, senha } = req.body;

  if (email != undefined) {
    User.findOne({ where: { email: email } }).then((user) => {
      if (user != undefined) {
        if (user.senha == senha) {
          jwt.sign(
            { id: user.id, email: user.email },
            secretKey,
            { expiresIn: "48h" },
            (err, token) => {
              if (err) {
                res.status(400);
                res.json({ error: "Falha interna" });
              } else {
                res.status = 200;
                res.json({ user: user, token: token });
              }
            }
          );
        } else {
          res.status(401).json({ error: "credenciais inválidas" });
        }
      } else {
        res.status(400);
        res.json({ error: "Email não encontrado na base de dados" });
      }
    });
  } else {
    res.status(400);
    res.json({ error: "Email inválido" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
