const express = require('express'),
router = express.Router();


const user = require('../controllers/user.controller');


router.get('/', user.get_users);

router.get('/:phone', user.get);

router.post('/', user.create);

router.put('/:phone', user.update);

router.delete('/:phone', user.delete);



module.exports = router;