//chat.js
let userId; // 전역 변수로 사용자 ID를 선언
let currentReceiver;

// 1대1 채팅
document.getElementById('chatForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const message = document.getElementById('message').value;
    const receiverId = '1'; // 실제 receiverId로 교체하세요

    const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, message })
    });

    if (response.ok) {
        document.getElementById('message').value = '';  // 입력란 초기화
        displayMessage(message, true);  // true는 내가 보낸 메시지
        loadMessages();  // 메시지 로드
    } else {
        alert('메시지 전송 실패');
    }
});

// 메시지를 화면에 표시하는 함수
function displayMessage(message, isSender) {
    const chatBox = document.getElementById('chatBox');
    const div = document.createElement('div');
    div.textContent = message;
    div.style.textAlign = isSender ? 'right' : 'left';  // 내가 보낸 메시지는 오른쪽 정렬
    chatBox.appendChild(div);
}

// 메시지 로드
async function loadMessages() {
    const receiverId = '1'; // 실제 receiverId로 교체하세요
    const response = await fetch(`/chat/${receiverId}`);
    const messages = await response.json();

    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = '';  // 이전 메시지 초기화

    messages.forEach(msg => {
        displayMessage(msg.message, msg.sender_id === parseInt(userId));  // 내가 보낸 메시지 여부 체크
    });
}
// 사용자 목록 로드
async function loadUserList() {
    const response = await fetch('/users');
    if (response.ok) {
        const users = await response.json();
        const userList = document.getElementById('userList'); // 사용자 목록을 표시할 DOM 요소

        // 사용자 목록 초기화
        userList.innerHTML = '';

        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.username;
            li.addEventListener('click', () => startChat(user.username)); // 클릭 시 채팅 시작
            userList.appendChild(li);
        });
    } else {
        alert('사용자 목록을 가져오는 데 실패했습니다.');
    }
}

// 클릭한 사용자와의 채팅을 시작하는 함수
function startChat(username) {
    // 채팅을 시작할 때 receiverId를 설정
    const receiverId = username; // username을 receiverId로 사용
    console.log('채팅 시작:', receiverId);
    // 채팅 페이지로 이동하거나 필요한 다른 작업 수행
}

// 페이지가 로드될 때 사용자 목록 로드
window.onload = async () => {
    // 사용자 정보 불러오기
    const response = await fetch('/api/profile');
    if (response.ok) {
        const data = await response.json();
        userId = data.id;  // 로그인한 사용자 ID 설정
    } else {
        console.error('로그인 필요');
        return; // 로그인 필요 시 함수 종료
    }

    await loadUsers();
    const urlParams = new URLSearchParams(window.location.search);
    const initialReceiver = urlParams.get('username');

    // URL에 username이 있으면 바로 채팅 시작
    if (initialReceiver) {
        startChat(initialReceiver);
    }
};

// 로그인 API 호출 후 성공 시 userId 설정
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        userId = data.userId;  // 로그인 성공 시 userId 저장
        window.location.href = '/chat.html';  // 채팅 페이지로 이동
    } else {
        alert('로그인 실패');
    }
});


