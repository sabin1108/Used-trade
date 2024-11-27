document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/profile')
      .then(response => {
        if (!response.ok) {
          throw new Error('사용자 정보를 불러오는데 실패했습니다.');
        }
        return response.json();
      })
      .then(data => {
        document.getElementById('username').placeholder = data.username;
        document.getElementById('password').placeholder = data.password;
        document.getElementById('student_num').placeholder = data.student_num;
        document.getElementById('email').placeholder = data.email;
      })
      .catch(error => {
        console.error('오류 발생:', error);
        alert('사용자 정보를 불러올 수 없습니다. 로그인해주세요.');
        location.href = '/login.html';
      });
    
    const chatUserList = document.getElementById('chat-user-list');

    // 채팅 시작 함수
    function startChat(username) {
      // 1대1 채팅 인터페이스로 이동
      window.location.href = `message.html?username=${encodeURIComponent(username)}`;
    }
  
    function loadChatList() {
      fetch('/get-chats')
        .then(response => response.json())
        .then(chats => {
          chatUserList.innerHTML = '';
          chats.forEach(chat => {
            const chatItem = document.createElement("div");
            chatItem.className = "flex items-center space-x-4 p-4 hover:bg-gray-50 transition duration-300 cursor-pointer";
            chatItem.innerHTML = `
              <div class="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                ${chat.user.charAt(0).toUpperCase()}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">${chat.user}</p>
                <p class="text-sm text-gray-500 truncate">${chat.lastMessage}</p>
  
                </div>
            `;
            chatUserList.appendChild(chatItem);
          });
        })
        .catch(error => console.error("채팅 목록 로드 오류:", error));
    }
  
      // 초기 데이터 로드
      loadChatList();

  });
  
  document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 폼의 기본 제출 동작 방지

    // 폼 데이터를 수집
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const student_num = document.getElementById('student_num').value;
    const email = document.getElementById('email').value;

  
    // 서버로 요청 전송 (AJAX)
    fetch('/api/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        student_num,
        email
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(data.message); // 성공 메시지 표시
        window.location.href = '/profile.html'; // 성공 후 내 정보 페이지로 이동
      } else {
        alert('오류 발생: ' + data.error); // 오류 메시지 표시
      }
    })
    .catch(error => {
      console.error('요청 중 오류 발생:', error);
      alert('정보 업데이트 중 오류가 발생했습니다.');
    });
  });

  // 새 게시글 작성 버튼 클릭 시 board.html로 이동
  document.addEventListener("DOMContentLoaded", function() {
    const newPostButton = document.getElementById("new-post-button");

    if (newPostButton) {
      newPostButton.addEventListener("click", function() {
        window.location.href = "board.html"; // board.html로 이동
      });
    }
  });


// 사용자 목록 가져오기
window.onload = function () {
  // 사용자 정보 불러오기
  fetch('/api/profile')
    .then(response => {
      if (!response.ok) {
        window.location.href = '/login.html';
        return;
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('user-id').innerText = data.username;
      document.getElementById('user-id').style.display = 'inline';

      return fetch('/api/users');
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('사용자 목록을 불러오는 데 실패했습니다.');
      }
      return response.json();
    })
    .then(users => {
      const chatUserList = document.getElementById('chat-user-list');
      chatUserList.innerHTML = '';

      const currentUserId = document.getElementById('user-id').innerText;

      users.forEach(user => {
        if (user.username !== currentUserId) {
          // 사용자 목록 아이템 생성
          const userDiv = document.createElement('div');
          userDiv.className =
            'flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition duration-300 cursor-pointer';

          // 원형 아바타
          const avatarDiv = document.createElement('div');
          avatarDiv.className =
            'w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold';
          avatarDiv.innerText = user.username.charAt(0).toUpperCase();

          // 이름 및 상태 메시지
          const nameDiv = document.createElement('div');
          nameDiv.className = 'flex-1';
          nameDiv.innerHTML = `
            <p class="font-semibold text-gray-800">${user.username}</p>
            <p class="text-sm text-gray-500">최근 메시지...</p>
          `;

          // 사용자 이름 클릭 시 채팅 페이지로 이동
          userDiv.addEventListener('click', function () {
            window.location.href = `message.html?username=${user.username}`;
          });

          userDiv.appendChild(avatarDiv);
          userDiv.appendChild(nameDiv);
          chatUserList.appendChild(userDiv);
        }
      });
    })
    .catch(error =>
      console.error('사용자 목록 불러오기 중 오류:', error)
    );
};

// 채팅 시작 함수
function startChat(username) {
  // 1대1 채팅 인터페이스로 이동, username을 쿼리 파라미터로 전달
  window.location.href = `message.html?username=${encodeURIComponent(username)}`;
}
