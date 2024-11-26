// public/login.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // 폼 기본 제출 동작 방지

  const user_id = document.getElementById('user_id').value;
  const password = document.getElementById('password').value;

  // 서버로 로그인 요청 전송
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, password })
  })
  .then(response => {
    // 응답 상태에 따라 처리
    if (!response.ok) {
      return response.json().then(data => {
        throw new Error(data.error); // 오류 메시지를 던짐
      });
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      console.log(data);
    }
  })
  .catch(error => {
    // 오류 발생 시 메시지 출력
    alert('오류 발생: ' + error.message);
  });
});
