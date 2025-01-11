const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
});

module.exports = Room;