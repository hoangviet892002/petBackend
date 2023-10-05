const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Employee = sequelize.define(
  "Employee",
  {
    role: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "employee", 
  }
);

module.exports = Employee;
