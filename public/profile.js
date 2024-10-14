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

      document.querySelector("main #username").innerText = data.username;
      document.getElementById('user_id').innerText = data.user_id;
      document.querySelector("main #student_num").innerText = data.student_num;
      document.getElementById('email').innerText = data.email;
      document.getElementById('created_at').innerText = new Date(data.created_at).toLocaleDateString();
    })
    .catch(error => {
      console.error('오류 발생:', error);
      alert('사용자 정보를 불러올 수 없습니다. 로그인해주세요.');
      location.href = '/login.html';
    });
};

// 로그아웃 처리
document.getElementById('logout-btn').addEventListener('click', function() {
  fetch('/logout', {
      method: 'POST',
  })
  .then(response => {
      if (response.ok) {
      window.location.href ='/home.html';  // 로그아웃 후 페이지 새로고침
      }
  })
  .catch(error => console.error('로그아웃 중 오류:', error));
  });

  
// window.onload = function() {
//   // 사용자 정보 불러오기
//   fetch('/api/user-info')
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('로그인 필요');
//       }
//       return response.json();
//     })
//     .then(data => {
//       document.getElementById('username').innerText = data.username;
//       document.getElementById('student_num').innerText = data.student_num;
//       document.getElementById('user-info').style.display = 'inline-block';

//       document.querySelector('main span#usename').innerText = data.username;
//       // document.getElementById('username').innerText = data.username;
//       document.getElementById('user_id').innerText = data.user_id;
//       document.getElementById('main span#student_num').innerText = data.student_num;
//       // document.getElementById('student_num').innerText = data.student_num;
//       document.getElementById('email').innerText = data.email;
//       document.getElementById('created_at').innerText = new Date(data.created_at).toLocaleDateString();
//     })
//     .catch(error => {
//       console.error('사용자 정보 불러오기 오류:', error);
//       // 로그인 필요하면 로그인 페이지로 리디렉션
//       window.location.href = '/login.html';
//     });
// };