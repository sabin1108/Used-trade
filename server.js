// server.js
const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000; // 서버 포트 설정

// 세션 설정
app.use(session({
  secret: 'secret',  // 임의의 비밀 키
  resave: false,
  saveUninitialized: true
}));

// 초기 페이지 설정
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1111',
  database: 'used_book_db'
});

// 데이터베이스 연결
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류: ', err);
    return;
  }
  console.log('MySQL 연결 성공');
});
app.set('db', db);

// 회원가입 API
app.post('/signup', (req, res) => {
  const { user_id, username, student_num, email, password } = req.body;
  const query = 'INSERT INTO users (user_id, username, student_num, email, password) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [user_id, username, student_num, email, password], (err, result) => {
    if (err) {
      console.error('회원가입 실패: ', err);
      return res.status(500).send('회원가입에 실패했습니다.');
    }
    res.status(200).send('회원가입 성공!');
  });
});

// 로그인 API
app.post('/login', (req, res) => {
  const { user_id, password } = req.body;
  const query = 'SELECT * FROM users WHERE user_id = ? AND password = ?';

  db.query(query, [user_id, password], (err, results) => {
    if (err) {
      console.error('로그인 오류: ', err);
      return res.status(500).json({ error: '로그인 오류가 발생했습니다.' });
    }
    if (results.length > 0) {
      req.session.user_id = results[0].id; // 사용자 ID 저장
      req.session.username = results[0].username; // 사용자 이름 저장
      return res.status(200).json({ message: '로그인 성공!', success: true });
    } else {
      res.status(401).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.', success: false });
    }
  });
});

// 로그아웃 처리
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('로그아웃 중 오류가 발생했습니다.');
    }
    res.redirect('/');
  });
});

// 개인 정보 확인 API
app.get('/api/profile', (req, res) => {
  const userId = req.session.user_id;

  if (!userId) {
    return res.status(401).json({ error: '로그인 필요' });
  }

  const query = 'SELECT * FROM users WHERE id = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('데이터 조회 오류:', err);
      return res.status(500).json({ error: '데이터 조회 실패' });
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
  });
});

// 사용자 정보 수정 API
app.post('/api/update-profile', (req, res) => {
  const userId = req.session.user_id; // 세션에서 사용자 ID 가져오기
  const { new_username, new_password, new_student_num, new_email } = req.body;

  const updateQuery = `UPDATE users SET 
                        username = COALESCE(?, username),
                        password = COALESCE(?, password),
                        student_num = COALESCE(?, student_num),
                        email = COALESCE(?, email)
                      WHERE id = ?`;

  db.query(updateQuery, [new_username, new_password, new_student_num, new_email, userId], (err, result) => {
    if (err) {
      console.error('사용자 정보 업데이트 오류:', err);
      return res.status(500).json({ error: '사용자 정보를 업데이트하는 중 오류가 발생했습니다.' });
    }
    res.json({ success: true, message: '사용자 정보가 성공적으로 업데이트되었습니다.' });
  });
});

// 채팅 메시지 가져오기 API
app.get('/chat/:receiverUsername', (req, res) => {
  const senderId = req.session.user_id; // 세션에서 로그인한 사용자 ID 가져오기
  const { receiverUsername } = req.params;

  if (!senderId) {
    return res.status(401).send('로그인이 필요합니다.');
  }

  db.query('SELECT id FROM users WHERE username = ?', [receiverUsername], (err, receiverResults) => {
    if (err || receiverResults.length === 0) {
      return res.status(404).send('수신자를 찾을 수 없습니다.');
    }

    const receiverId = receiverResults[0].id;

    const query = `
      SELECT Chats.*, sender.username AS sender_name, receiver.username AS receiver_name
      FROM Chats
      JOIN users AS sender ON Chats.sender_id = sender.id
      JOIN users AS receiver ON Chats.receiver_id = receiver.id
      WHERE (Chats.sender_id = ? AND Chats.receiver_id = ?)
      OR (Chats.sender_id = ? AND Chats.receiver_id = ?)
      ORDER BY Chats.timestamp
    `;
    db.query(query, [senderId, receiverId, receiverId, senderId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('메시지를 가져오는 중 오류가 발생했습니다.');
      }
      res.json(results);
    });
  });
});
// 사용자 목록 API home에서 유저 순서대로 나오게 하는거
app.get('/api/users', (req, res) => {
  const senderId = req.session.user_id;

  if (!senderId) {
    return res.status(401).send('로그인이 필요합니다.');
  }

  db.query('SELECT id, username FROM users WHERE id != ?', [senderId], (err, results) => {
    if (err) {
      return res.status(500).send('사용자 목록을 가져오는 중 오류가 발생했습니다.');
    }
    res.json(results);
  });
});
// 사용자 목록 API
app.get('/users', (req, res) => {
  const senderId = req.session.user_id;

  if (!senderId) {
    return res.status(401).send('로그인이 필요합니다.');
  }

  db.query('SELECT id, username FROM users WHERE id != ?', [senderId], (err, results) => {
    if (err) {
      return res.status(500).send('사용자 목록을 가져오는 중 오류가 발생했습니다.');
    }
    res.json(results);
  });
});



// 채팅 메시지 전송 API
app.post('/chat', (req, res) => {
  const { receiverUsername, message } = req.body;
  const senderId = req.session.user_id;

  if (!senderId) {
    return res.status(401).send('로그인이 필요합니다.');
  }

  db.query('SELECT username FROM users WHERE id = ?', [senderId], (err, senderResults) => {
    if (err || senderResults.length === 0) {
      return res.status(500).send('사용자 정보를 찾을 수 없습니다.');
    }

    const senderUsername = senderResults[0].username;

    if (senderUsername === receiverUsername) {
      return res.status(400).send('자신에게 메시지를 보낼 수 없습니다.');
    }

    db.query('SELECT id FROM users WHERE username = ?', [receiverUsername], (err, receiverResults) => {
      if (err) {
        console.error(err);
        return res.status(500).send('서버 오류: 수신자 ID를 찾는 중 문제가 발생했습니다.');
      }
      if (receiverResults.length === 0) {
        return res.status(404).send('수신자를 찾을 수 없습니다.');
      }

      const receiverId = receiverResults[0].id;

      db.query('INSERT INTO chats (sender_id, receiver_id, message) VALUES (?, ?, ?)', [senderId, receiverId, message], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('메시지 전송에 실패했습니다.');
        }
        res.status(201).send('메시지 전송 성공');
      });
    });
  });
});



// 게시글 작성 API
app.post('/create-post', (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.user_id;

  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const query = 'INSERT INTO boards (user_id, title, content, created_at) VALUES (?, ?, ?, NOW())';
  db.query(query, [userId, title, content], (err) => {
    if (err) {
      console.error('게시글 작성 오류:', err);
      return res.status(500).json({ error: '게시글 작성 중 오류가 발생했습니다.' });
    }
    res.status(200).json({ success: true });
  });
});

// 게시글 삭제 API
app.delete('/api/delete-post/:postId', (req, res) => {
  const postId = req.params.postId;
  const userId = req.session.user_id;

  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const query = 'DELETE FROM boards WHERE id = ? AND user_id = ?';
  db.query(query, [postId, userId], (err, result) => {
    if (err) {
      console.error('게시글 삭제 오류:', err);
      return res.status(500).json({ error: '게시글 삭제 중 오류가 발생했습니다.' });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: '삭제할 권한이 없습니다.' });
    }

    res.status(200).json({ success: true });
  });
});

// 게시글 수정 API
app.put('/api/update-post/:postId', (req, res) => {
  const postId = req.params.postId;
  const userId = req.session.user_id;
  const { title, content } = req.body;

  if (!userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  const query = 'UPDATE boards SET title = ?, content = ?, updated_at = NOW() WHERE id = ? AND user_id = ?';
  db.query(query, [title, content, postId, userId], (err, result) => {
    if (err) {
      console.error('게시글 수정 오류:', err);
      return res.status(500).json({ error: '게시글 수정 중 오류가 발생했습니다.' });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: '수정할 권한이 없습니다.' });
    }

    res.status(200).json({ success: true });
  });
});

// 게시글 목록 가져오기 API
app.get('/get-posts', (req, res) => {
  const userId = req.session.user_id;

  const query = `
    SELECT boards.id, boards.title, boards.content, boards.created_at, users.username AS author,
    CASE WHEN boards.user_id = ? THEN true ELSE false END AS isAuthor
    FROM boards
    JOIN users ON boards.user_id = users.id
    ORDER BY boards.created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('게시글 목록 조회 오류:', err);
      return res.status(500).json({ error: '게시글 목록 조회 중 오류가 발생했습니다.' });
    }
    res.json(results);
  });
});


// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
