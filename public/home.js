// 로그아웃 처리
document.getElementById('logout-btn').addEventListener('click', function() {
  fetch('/logout', {
      method: 'POST',
  })
  .then(response => {
      if (response.ok) {
          window.location.href = '/login.html';  // 로그아웃 후 로그인 페이지로 이동
      }
  })
  .catch(error => console.error('로그아웃 중 오류:', error));
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
window.onload = function() {
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
          const userDiv = document.createElement('div');
          userDiv.className = 'flex items-center space-x-4';

          const avatarDiv = document.createElement('div');
          avatarDiv.className = 'avatar';
          avatarDiv.innerText = user.username.charAt(0);

          const nameDiv = document.createElement('div');
          nameDiv.innerHTML = `<p class="font-semibold">${user.username}</p><p class="text-sm text-gray-500">최근 메시지...</p>`;
          nameDiv.style.cursor = 'pointer'; // 클릭 가능하게 설정

          // 사용자 이름 클릭 시 채팅 페이지로 이동
          nameDiv.addEventListener('click', function() {
            window.location.href = `chat.html?username=${user.username}`;
          });

          userDiv.appendChild(avatarDiv);
          userDiv.appendChild(nameDiv);
          chatUserList.appendChild(userDiv);
        }
      });
    })
    .catch(error => console.error('사용자 목록 불러오기 중 오류:', error));
};


// 채팅 시작 함수
function startChat(username) {
  // 1대1 채팅 인터페이스로 이동, username을 쿼리 파라미터로 전달
  window.location.href = `chat.html?user=${encodeURIComponent(username)}`;
}
