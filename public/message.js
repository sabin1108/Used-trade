// 소켓 연결
const socket = io('http://localhost:3000');

// 서버 연결 성공 시 처리
socket.on('connect', () => {
  console.log('서버와 연결됨');
  document.getElementById('feedback').textContent = '서버와 연결되었습니다.';
  document.getElementById('feedback').style.color = 'green';
});

// 서버 연결 실패 시 처리
socket.on('connect_error', (err) => {
  console.error('서버 연결 실패:', err);
  document.getElementById('feedback').textContent = '서버 연결 실패';
  document.getElementById('feedback').style.color = 'red';
});

// 메시지 수신 처리
socket.on('receiveMessage', ({ senderId, message }) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.textContent = `${senderId}: ${message}`;
  document.getElementById('chat-window').appendChild(messageDiv);
});

// 폼 전송 이벤트 처리
document.getElementById('chat-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const message = document.getElementById('message-input').value.trim();
  if (!message) return;

  // 전송할 데이터 준비
  const senderId = 'testUser'; // 예시 사용자 ID
  const receiverUsername = 'anotherUser'; // 예시 수신자 이름

  // 서버로 메시지 전송
  socket.emit('sendMessage', { senderId, receiverUsername, message });

  // 보낸 메시지를 화면에 표시
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.textContent = `나: ${message}`;
  document.getElementById('chat-window').appendChild(messageDiv);

  // 메시지 입력란 초기화
  document.getElementById('message-input').value = '';
  document.getElementById('feedback').textContent = '메시지 전송 중...';
  document.getElementById('feedback').style.color = 'blue';

  const sendMessage = (sender_id, receiver_id, message) => {
    fetch('/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender_id, receiver_id, message })
    })
    .then(response => response.json())
    .then(data => console.log('Message sent:', data))
    .catch(error => console.error('Error sending message:', error));
  };
});
