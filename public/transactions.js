window.onload = function() {
    fetch('/api/profile')
      .then(response => {
        if (!response.ok) {
          throw new Error('사용자 정보를 불러오는데 실패했습니다.');
        }
        return response.json();
      })
      .then(data => {
        // 받아온 사용자 정보를 화면에 표시
        document.getElementById('user-info').style.display = 'inline-block';
        document.getElementById('username').innerText = data.username;
        document.getElementById('student_num').innerText = data.student_num;
      })
      .catch(error => {
        console.error('오류 발생:', error);
        alert('사용자 정보를 불러올 수 없습니다. 로그인해주세요.');
        location.href = '/login.html';
      });
  };