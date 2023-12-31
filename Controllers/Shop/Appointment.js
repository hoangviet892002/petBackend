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
            status: appointment.status,
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
                [Op.gte]: startInVietnamTimeZone.subtract(15, "minutes"),
              },
              end: {
                [Op.lte]: endInVietnamTimeZone.add(15, "minutes"),
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
      const today = moment().startOf("day"); // Lấy thời gian bắt đầu của ngày hôm nay
      const appointmentCount = await Appointment.count({
        where: {
          customer_id: 1,
          createdAt: {
            [Op.gte]: today,
          },
        },
      });

      // if (appointmentCount > 2) {
      //   return res.status(200).json({
      //     success: false,
      //     message: "Spam chi z bé, đợi mai nhá.",
      //   });
      // }

      return res.status(200).json({
        success: true,
        message:
          "Slot is available, and the appointment is scheduled successfully.",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  async add(req, res) {
    const { start, end, employee_id } = req.body;

    // Assuming start and end are in a different time zone
    const startInDifferentTimeZone = moment(start);
    const endInDifferentTimeZone = moment(end);

    // Convert to Vietnam time zone
    const startInVietnamTimeZone = startInDifferentTimeZone
      .tz(vietnamTimeZone)
      .format("YYYY-MM-DDTHH:mm");
    const endInVietnamTimeZone = endInDifferentTimeZone
      .tz(vietnamTimeZone)
      .format("YYYY-MM-DDTHH:mm");
    console.log(startInVietnamTimeZone);
    console.log(endInVietnamTimeZone);
    try {
      const newAppointment = await Appointment.create({
        start: startInVietnamTimeZone,
        end: endInVietnamTimeZone,
        employee_id,
        customer_id: 1,
        status: 1,
      });
      return res
        .status(200)
        .json({ success: true, message: "Appointment created successfully" });
    } catch {
      return res
        .status(200)
        .json({ success: false, message: "Internal server error" });
    }
  }
  async ByCustomer(req, res) {
    try {
      const customerId = req.params.id; 

      // Sử dụng model Appointment để tìm các cuộc hẹn dựa trên thông tin của khách hàng
      const appointments = await Appointment.findAll({ customer_id: customerId });

      // Trả về kết quả dưới dạng JSON
      res.json(appointments);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error(error);
      res
        .status(500)
        .json({
          error: "Có lỗi xảy ra khi lấy danh sách cuộc hẹn của khách hàng.",
        });
    }
  }
}

module.exports = new AppointmentController();
