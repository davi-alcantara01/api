const express = require("express");
const connection = module.require("./database/Conection.js");
const sequelize = require("sequelize");
const Games = module.require("./games/Games.js");
const cors = require("cors");

const app = express();


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

app.get("/games", (req, res) => {
  res.statusCode = 200;
  Games.findAll().then((games) => {
    res.json(games);
  });
});

app.get("/game/:id", (req, res) => {
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

app.post("/game", (req, res) => {
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

app.delete("/game/:id", (req, res) => {
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

app.put("/game/:id", (req, res) => {
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
