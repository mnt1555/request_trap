const router = require('express').Router();   
const controller = require('../controllers/trapController.js');

router.get('/', controller.home);
router.get('/:trapId/requests', controller.requests);
router.all('/:trapId', controller.traps);

module.exports = router;
