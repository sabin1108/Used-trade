// 소켓 연결
const socket = io('http://ec2-3-39-46-144.ap-northeast-2.compute.amazonaws.com:3000/');

// 사용자 이름 입력 및 등록
const username = prompt('사용자 이름을 입력하세요:'); // 예시: 사용자 이름 입력
socket.emit('registerUser', username); // 서버에 사용자 이름 등록

// 서버 연결 성공 시 처리
socket.on('connect', () => {
  console.log('서버와 연결됨');
  document.getElementById('feedback').textContent = '서버와 연결되었습니다.';
  document.getElementById('feedback').style.color = 'green';
});

// 서버 연결 실패 시 처리
socket.on('connect_error', (err) => {
  console.error('서버 연결 실패:', err);
});

// 메시지 수신 처리
socket.on('receiveMessage', ({ senderId, message }) => {
  const chatWindow = document.getElementById('chat-window');

  // 메시지 표시
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', senderId === username ? 'user' : 'bot'); // 본인의 메시지인지 확인
  messageDiv.innerHTML = `
    <strong>${senderId}</strong>: ${message}
    <span class="timestamp">${new Date().toLocaleTimeString()}</span>
  `;
  chatWindow.appendChild(messageDiv);
});

// 폼 전송 이벤트 처리
document.getElementById('chat-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const message = document.getElementById('message-input').value.trim();
  if (!message) return;

  // 서버로 메시지 전송
  socket.emit('sendMessage', { receiverUsername: 'anotherUser', message });

  // 내가 보낸 메시지 화면에 표시
  const chatWindow = document.getElementById('chat-window');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', 'user'); // 본인 메시지에 'user' 클래스 추가
  messageDiv.innerHTML = `
    <strong>${username}</strong>: ${message}
    <span class="timestamp">${new Date().toLocaleTimeString()}</span>
  `;
  chatWindow.appendChild(messageDiv);

  // 메시지 입력란 초기화
  document.getElementById('message-input').value = '';
  document.getElementById('feedback').textContent = '메시지 전송 중...';
  document.getElementById('feedback').style.color = 'blue';
});
