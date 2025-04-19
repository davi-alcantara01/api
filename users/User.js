const connection = require("../database/Conection");
const { STRING } = require("sequelize");

const User = connection.define("users", {
  user: {
    type: STRING,
    allowNull: false
  },
  email: {
    type: STRING,
    allowNull: false
  },
  senha: {
    type: STRING,
    allowNull: false
  }
});

module.exports = User;