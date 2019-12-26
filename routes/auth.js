const express = require('express');
const router = express.Router();

const authCntrl = require('../controllers/auth');

router.get('/login', authCntrl.getLogin);

router.post('/login', authCntrl.postLogin);

router.post('/logout', authCntrl.postLogout);


module.exports = router;