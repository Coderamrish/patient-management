const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/doctorController');
router.get('/', auth, c.getAll);
router.get('/:id', auth, c.getOne);
router.post('/', auth, c.create);
router.put('/:id', auth, c.update);
router.delete('/:id', auth, c.remove);
module.exports = router;