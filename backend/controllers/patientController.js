const Patient = require('../models/Patient');

exports.getAll    = async (req, res) => { try { res.json(await Patient.find().sort('-createdAt')); } catch(e){ res.status(500).json({message:e.message}); } };
exports.getOne    = async (req, res) => { try { const p = await Patient.findById(req.params.id); if(!p) return res.status(404).json({message:'Not found'}); res.json(p); } catch(e){ res.status(500).json({message:e.message}); } };
exports.create    = async (req, res) => { try { res.status(201).json(await Patient.create(req.body)); } catch(e){ res.status(400).json({message:e.message}); } };
exports.update    = async (req, res) => { try { res.json(await Patient.findByIdAndUpdate(req.params.id, req.body, {new:true})); } catch(e){ res.status(400).json({message:e.message}); } };
exports.remove    = async (req, res) => { try { await Patient.findByIdAndDelete(req.params.id); res.json({message:'Deleted'}); } catch(e){ res.status(500).json({message:e.message}); } };