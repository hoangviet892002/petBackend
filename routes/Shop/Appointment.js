const express = require('express');
const router = express.Router();
const AppointmentControllers = require('../../Controllers/Shop/Appointment');

router.get("/getByEmployeeId/:id", AppointmentControllers.getAppointmentsByEmployeeId);
router.post("/checkslot", AppointmentControllers.checkSlot)

module.exports = router;