const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Appointment = sequelize.define(
  "Appointment",
  {
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Khách hàng có thể là null
      references: {
        model: "Customer",
        key: "id",
      },
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Employee",
        key: "id",
      },
    },
  },
  {
    tableName: "appointment",
  }
);

module.exports = Appointment;
