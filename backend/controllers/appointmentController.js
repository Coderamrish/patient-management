const Appointment = require('../models/Appointment');

exports.getAll = async (req, res) => { try { res.json(await Appointment.find().populate('patient','name').populate('doctor','name specialization').sort('-date')); } catch(e){ res.status(500).json({message:e.message}); } };
exports.create = async (req, res) => { try { const a = await (await Appointment.create(req.body)).populate('patient','name'); res.status(201).json(a); } catch(e){ res.status(400).json({message:e.message}); } };
exports.update = async (req, res) => { try { res.json(await Appointment.findByIdAndUpdate(req.params.id, req.body, {new:true}).populate('patient','name').populate('doctor','name')); } catch(e){ res.status(400).json({message:e.message}); } };
exports.remove = async (req, res) => { try { await Appointment.findByIdAndDelete(req.params.id); res.json({message:'Deleted'}); } catch(e){ res.status(500).json({message:e.message}); } };