//home.js
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

// 사용자 목록 가져오기
window.onload = function() {
  // 사용자 정보 불러오기
  fetch('/api/profile')
    .then(response => {
      if (!response.ok) {
        throw new Error('로그인 필요');
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('login-btn').style.display = 'none';
      document.getElementById('signup-btn').style.display = 'none';
      document.getElementById('username').innerText = data.username;
      document.getElementById('student_num').innerText = data.student_num;
      document.getElementById('profile-btn').style.display = 'inline-block';
      document.getElementById('transactions-btn').style.display = 'inline-block';
      document.getElementById('user-info').style.display = 'inline-block';
      
      // 사용자 목록 가져오기
      fetch('/api/users') // 사용자 목록 API 엔드포인트
        .then(response => {
          if (!response.ok) {
            throw new Error('사용자 목록 불러오기 실패');
          }
          return response.json();
        })
        .then(users => {
          const userList = document.getElementById('user-list');
          userList.innerHTML = ''; // 기존 목록 초기화
          users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.username; // 사용자 이름 설정
            li.style.cursor = 'pointer'; // 클릭할 수 있다는 느낌 주기
            li.onclick = function() {
              // 클릭 시 사용자의 채팅 페이지로 이동
              location.href = `chat.html?username=${encodeURIComponent(user.username)}`;
            };
            userList.appendChild(li); // 목록에 추가
          });
        })
        .catch(error => {
          console.error('사용자 목록 불러오기 오류:', error);
        });
    })
    .catch(error => {
      console.error('사용자 정보 불러오기 오류:', error);
      // 로그인 필요하면 로그인 페이지로 리디렉션
      window.location.href = '/login.html';
    });
};
