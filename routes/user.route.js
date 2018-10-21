const express = require('express'),
router = express.Router();


const user = require('../controllers/user.controller');


router.get('/', user.get_users);

router.get('/:phone', user.get);

router.post('/', user.create);

router.put('/:id', user.update);


module.exports = router;