const CustomerRouter = require("./Users/Customer");
const EmployeeRouter = require("./Users/Employee");
const AppointmentRouter = require("./Shop/Appointment");

function route(app) {
  app.use("/api/customer", CustomerRouter);
  app.use("/api/employee", EmployeeRouter);
  app.use("/api/appointment", AppointmentRouter);
}

module.exports = route;
