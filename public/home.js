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
        // 로그인이 되어 있지 않으면 로그인 페이지로 이동
        window.location.href = '/login.html';
        return;
      }
      return response.json();
    })
    .then(data => {
      // 사용자 정보를 표시
      document.getElementById('user-id').innerText = data.username; // 사용자 아이디 표시
      document.getElementById('user-id').style.display = 'inline'; // 사용자 아이디 보이게 설정
      document.getElementById('signup-btn').style.display = 'none';
      document.getElementById('user-info').style.display = 'inline-block';
      document.getElementById('transactions-btn').style.display = 'inline-block';
    })
    .catch(error => console.error('사용자 정보 불러오기 중 오류:', error));

  // 사용자 목록 요청
  fetch('/api/users')
    .then(response => response.json())
    .then(users => {
      const userList = document.getElementById('user-list');
      userList.innerHTML = '';
      users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username; // 사용자 이름을 리스트에 추가
        userList.appendChild(li);
      });
    })
    .catch(error => console.error('사용자 목록 불러오기 중 오류:', error));
};


// 채팅 버튼 클릭 시 채팅 창 열기
const chatButtons = document.querySelectorAll('.button-outline');
chatButtons.forEach(button => {
  button.addEventListener('click', function() {
    // 1대1 채팅 인터페이스로 이동
    window.location.href = 'chat.html'; // 채팅 페이지로 이동
  });
});
