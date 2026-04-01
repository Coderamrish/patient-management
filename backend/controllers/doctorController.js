const Doctor = require('../models/Doctor');

exports.getAll = async (req, res) => { try { res.json(await Doctor.find().sort('-createdAt')); } catch(e){ res.status(500).json({message:e.message}); } };
exports.getOne = async (req, res) => { try { const d = await Doctor.findById(req.params.id); if(!d) return res.status(404).json({message:'Not found'}); res.json(d); } catch(e){ res.status(500).json({message:e.message}); } };
exports.create = async (req, res) => { try { res.status(201).json(await Doctor.create(req.body)); } catch(e){ res.status(400).json({message:e.message}); } };
exports.update = async (req, res) => { try { res.json(await Doctor.findByIdAndUpdate(req.params.id, req.body, {new:true})); } catch(e){ res.status(400).json({message:e.message}); } };
exports.remove = async (req, res) => { try { await Doctor.findByIdAndDelete(req.params.id); res.json({message:'Deleted'}); } catch(e){ res.status(500).json({message:e.message}); } };