const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/chamcong', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const EmployeeSchema = new mongoose.Schema({
  name: String,
  department: String,
  checkInTime: Date,
  checkOutTime: Date,
});

const Employee = mongoose.model('Employee', EmployeeSchema);

app.use(bodyParser.json());
app.use(cors());

// Thêm nhân viên mới
app.post('/employees', (req, res) => {
  const { name, department } = req.body;
  const newEmployee = new Employee({ name, department });
  newEmployee.save((err, employee) => {
    if (err) {
      res.status(500).json({ error: 'Lỗi khi tạo nhân viên' });
    } else {
      res.status(201).json(employee);
    }
  });
});

// Lấy danh sách nhân viên
app.get('/employees', (req, res) => {
  Employee.find({}, (err, employees) => {
    if (err) {
      res.status(500).json({ error: 'Lỗi khi lấy danh sách nhân viên' });
    } else {
      res.json(employees);
    }
  });
});

// Ghi nhận giờ chấm công cho nhân viên
app.post('/employees/:id/checkin', (req, res) => {
  const { id } = req.params;
  Employee.findById(id, (err, employee) => {
    if (err) {
      res.status(500).json({ error: 'Lỗi khi tìm nhân viên' });
    } else if (!employee) {
      res.status(404).json({ error: 'Nhân viên không tồn tại' });
    } else {
      employee.checkInTime = new Date();
      employee.save((err, updatedEmployee) => {
        if (err) {
          res.status(500).json({ error: 'Lỗi khi cập nhật giờ chấm công' });
        } else {
          res.json(updatedEmployee);
        }
      });
    }
  });
});

// Ghi nhận giờ ra về cho nhân viên
app.post('/employees/:id/checkout', (req, res) => {
  const { id } = req.params;
  Employee.findById(id, (err, employee) => {
    if (err) {
      res.status(500).json({ error: 'Lỗi khi tìm nhân viên' });
    } else if (!employee) {
      res.status(404).json({ error: 'Nhân viên không tồn tại' });
    } else {
      employee.checkOutTime = new Date();
      employee.save((err, updatedEmployee) => {
        if (err) {
          res.status(500).json({ error: 'Lỗi khi cập nhật giờ chấm công' });
        } else {
          res.json(updatedEmployee);
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server đang lắng nghe tại cổng ${PORT}`);
});
