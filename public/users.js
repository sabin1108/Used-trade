const express = require('express');
const router = express.Router();

// 사용자 목록 가져오기 API
router.get('/users', (req, res) => {
    const db = req.app.get('db');

    db.query('SELECT username FROM users', (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving users');
        }
        res.json(results);
    });
});

module.exports = router;
