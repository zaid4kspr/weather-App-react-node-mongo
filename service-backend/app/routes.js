const router = require("express").Router();

router.use('/v1', require('./modules/adminAuth'));
router.use('/v1', require('./modules/weather'));

module.exports = router;
