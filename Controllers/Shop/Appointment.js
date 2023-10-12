const moment = require("moment-timezone");
const { Op } = require("sequelize");
const Appointment = require("../../Models/Shop/Appointments");
const Customer = require("../../Models/Users/Customer");
const vietnamTimeZone = "Asia/Ho_Chi_Minh";

class AppointmentController {
  
  async getAppointmentsByEmployeeId(req, res) {
    const { id } = req.params; // Lấy id_employee từ tham số URL

    try {
      // Sử dụng Sequelize để truy vấn cơ sở dữ liệu
      const appointments = await Appointment.findAll({
        where: {
          employee_id: id, // Lọc các cuộc hẹn với id_employee cụ thể
        },
      });

      // Lặp qua danh sách appointments để thêm customer_name
      const appointmentsFormatted = await Promise.all(
        appointments.map(async (appointment) => {
          // Lấy thông tin khách hàng dựa trên customer_id
          const customer = await Customer.findByPk(appointment.customer_id);

          // Trả về đối tượng đã định dạng với customer_name

          return {
            id: appointment.id,
            start: moment(appointment.start).format("YYYY-MM-DDTHH:mm:ss"),
            end: moment(appointment.end).format("YYYY-MM-DDTHH:mm:ss"),
            status : appointment.status,
            title: customer ? customer.name : "mắc ziệc",
          };
        })
      );

      // Trả về danh sách cuộc hẹn đã được định dạng trong phản hồi JSON
      res.status(200).json(appointmentsFormatted);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cuộc hẹn:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách cuộc hẹn" });
    }
  }
  async checkSlot(req, res) {
    const { start, end, id_employee } = req.body;
    const startInVietnamTimeZone = moment(start).tz(vietnamTimeZone);
    const endInVietnamTimeZone = moment(end).tz(vietnamTimeZone);
  
    try {
      // Perform an overlap check using Sequelize
      const overlappingAppointments = await Appointment.findAll({
        where: {
          employee_id: id_employee,
          [Op.or]: [
            {
              start: {
                [Op.lte]: endInVietnamTimeZone,
              },
              end: {
                [Op.gte]: startInVietnamTimeZone,
              },
            },
          ],
        },
      });
  
      if (overlappingAppointments.length > 0) {
        return res.status(200).json({
          success: false,
          message: "Giờ đã có người đặt rồi.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Slot is available, and the appointment is scheduled successfully.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
  async add(req, res){
    const { start, end, employee_id } = req.body;
    try{
      const newAppointment = await Appointment.create({
        start,
        end,
        employee_id,
        customer_id: 1,
        status: 1,
      });
      return res.status(200).json({ success: true, message: "Appointment created successfully" });
    }catch{
      return res.status(200).json({ success: false, message: "Internal server error" });
    }
  }
  
}

module.exports = new AppointmentController();
