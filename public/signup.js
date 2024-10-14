document.getElementById('signupForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const user_id = document.getElementById('user_id').value;
  const username = document.getElementById('username').value;
  const student_num = document.getElementById('student_num').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, username, student_num, email, password})
  })
  .then(response => response.text())
  .then(data => {
    alert(data);
    if (data === '회원가입 성공!') {
      window.location.href = 'login.html';
    }
  })
  .catch(error => console.error('오류:', error));
});