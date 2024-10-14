const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
// 채팅 메시지 전송 API
router.post('/', (req, res) => {
    const db = req.app.get('db');
    const { receiverId, message } = req.body;
    const senderId = req.session.userId;

    if (!senderId) {
        return res.status(401).send('You need to be logged in to send a message');
    }

    db.query('INSERT INTO Chats (sender_id, receiver_id, message) VALUES (?, ?, ?)', [senderId, receiverId, message], (err, result) => {
        if (err) {
            return res.status(500).send('Error sending message');
        }
        res.status(201).send('Message sent');
    });
});

// 채팅 메시지 가져오기 API
router.get('/:receiverId', (req, res) => {
    const db = req.app.get('db');
    const senderId = req.session.userId;
    const { receiverId } = req.params;

    if (!senderId) {
        return res.status(401).send('You need to be logged in to view messages');
    }

    db.query(
        'SELECT * FROM Chats WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)',
        [senderId, receiverId, receiverId, senderId],
        (err, results) => {
            if (err) {
                return res.status(500).send('Error retrieving messages');
            }
            res.json(results);
        }
    );
});

module.exports = router;
