const express = require('express');
const router = express.Router();
const AppointmentControllers = require('../Controllers/Shop/Appointment'); // Thay đổi đường dẫn đến controller của bạn

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The ID of the appointment.
 *         start:
 *           type: string
 *           format: date-time
 *           description: The start date and time of the appointment (YYYY-MM-DDTHH:mm:ss).
 *         end:
 *           type: string
 *           format: date-time
 *           description: The end date and time of the appointment (YYYY-MM-DDTHH:mm:ss).
 *         title:
 *           type: string
 *           description: The title of the appointment.
 *       example:
 *         id: 1
 *         start: "2023-10-10T09:00:00"
 *         end: "2023-10-10T10:00:00"
 *         title: "Appointment with John Doe"
 */

/**
 * @swagger
 * /api/appointment/getByEmployeeId/{id}:
 *   get:
 *     summary: Get appointments by employee ID
 *     description: Retrieve a list of appointments for a specific employee by their ID.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Successful response with the list of appointments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid request. Please check the input parameters.
 *       404:
 *         description: Employee with the specified ID not found.
 */

router.get('/getByEmployeeId/:id', AppointmentControllers.getAppointmentsByEmployeeId);

/**
 * @swagger
 * /api/appointment/checkslot:
 *   post:
 *     summary: Check appointment slot availability
 *     description: Check if a specific appointment slot is available.
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date for the appointment slot (YYYY-MM-DD).
 *               time:
 *                 type: string
 *                 format: time
 *                 description: Time for the appointment slot (HH:mm).
 *     responses:
 *       200:
 *         description: Successful response. Slot is available.
 *       400:
 *         description: Invalid request. Please check the input data.
 *       409:
 *         description: The appointment slot is already booked.
 */
router.post('/checkslot', AppointmentControllers.checkSlot);
router.post('/add', AppointmentControllers.add )
router.get("/getByCustomer/:id", AppointmentControllers.ByCustomer);

module.exports = router;
