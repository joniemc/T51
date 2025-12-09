const express = require('express');
const bcrypt = require('bcrypt');

const miMiddleware = require('../middleware/miMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/test', miMiddleware, (req, res)=>{
    res.send('Hello');
});

router.get('/sinmiddleware', authMiddleware, (req, res)=>{
    res.send('Hello not middleware');
});

router.get('/gethash/:plainText', async (req, res)=>{
    const plaintText = req.params.plainText;
    const saltRound = 10;
    const hash = await bcrypt.hash(plaintText,saltRound);

    res.send(hash);

});

module.exports = router;