const connection = module.require("../database/Conection.js");
const { Sequelize, STRING, NUMBER, INTEGER } = require("sequelize");


const Games = connection.define("games", {
  title: {
    type: STRING,
    allowNull: false
  },
  genre: {
    type: STRING,
    allowNull: false
  },
  price: {
    type: INTEGER,
    allowNull: false
  }
});


module.exports = Games;