const CustomerRouter = require("./Customer");
const EmployeeRouter = require("./Employee");
const AppointmentRouter = require("./Appointment");

function route(app) {
  app.use("/api/customer", CustomerRouter);
  app.use("/api/employee", EmployeeRouter);
  app.use("/api/appointment", AppointmentRouter);
}

module.exports = route;
