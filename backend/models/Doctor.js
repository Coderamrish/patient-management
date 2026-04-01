const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  specialization: { type: String, required: true },
  phone:          { type: String, required: true },
  email:          { type: String },
  availability:   { type: String, default: 'Mon-Fri, 9am-5pm' }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);