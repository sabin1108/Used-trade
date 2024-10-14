window.onload = function() {
    fetch('/api/profile')
      .then(response => {
        if (!response.ok) {
          throw new Error('사용자 정보를 불러오는데 실패했습니다.');
        }
        return response.json();
      })
      .then(data => {
        document.getElementById('user-info').style.display = 'inline-block';
        document.getElementById('username').innerText = data.username;
        document.getElementById('student_num').innerText = data.student_num;

        document.querySelector('main #username').placeholder = data.username;
        document.getElementById('password').placeholder = data.password;
        document.querySelector('main #student_num').placeholder = data.student_num;
        document.getElementById('email').placeholder = data.email;
      })
      .catch(error => {
        console.error('오류 발생:', error);
        alert('사용자 정보를 불러올 수 없습니다. 로그인해주세요.');
        location.href = '/login.html';
      });
  };

document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 폼의 기본 제출 동작 방지

    // 폼 데이터를 수집
    const new_username = document.getElementById('username').value;
    const new_password = document.getElementById('password').value;
    const new_student_num = document.getElementById('student_num').value;
    const new_email = document.getElementById('email').value;

  
    // 서버로 요청 전송 (AJAX)
    fetch('/api/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        new_username,
        new_password,
        new_student_num,
        new_email
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
  