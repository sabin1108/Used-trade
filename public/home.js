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

//상당 아이콘 이동
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("home-btn").addEventListener("click", () => {
    window.location.href = "home.html"; // Home 페이지로 이동
  });
  document.getElementById("profile-btn").addEventListener("click", () => {
    window.location.href = "profile.html"; // Profile 페지로 이동
  });
  document.getElementById("lock-btn").addEventListener("click", () => {
    window.location.href = "arduino.html"; // Arduino 페이지로 이동
  });
  document.getElementById("board-btn").addEventListener("click", () => {
    window.location.href = "board.html"; // Board 페이지로 이동
  });
  document.getElementById("notification-btn").addEventListener("click", () => {
    window.location.href = "transactions.html"; // Transactions 페이지로 이동
  });
  document.getElementById("logout-btn").addEventListener("click", () => {
    // 로그아웃 처리 로직
    fetch('/api/logout', { method: 'POST' })
      .then(response => {
        if (response.ok) {
          window.location.href = "login.html"; // 로그아웃 후 로그인 페이지로 이동
        } else {
          console.error("로그아웃 실패");
        }
      })
      .catch(error => console.error("로그아웃 오류:", error));
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

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/boards') // boards 테이블에서 게시글 가져오기
    .then(response => response.json())
    .then(boards => {
      const postContainer = document.querySelector('.space-y-4');
      postContainer.innerHTML = ''; // 기존 내용 초기화

      boards.forEach(board => {
        const postCard = document.createElement('div');
        postCard.classList.add('card');
        postCard.innerHTML = `
          <h3 class="font-semibold text-lg">${board.title}</h3>
          <p class="font-bold">${board.price.toLocaleString()}원</p>
          <p class="text-gray-500">판매자: ${board.course_name}</p>
          <div class="flex justify-between mt-4">
            <button class="button-outline chat-button" data-author-username="${board.course_name}">💬 채팅하기</button>
            <button class="button">자세히 보기</button>
          </div>
        `;
        postContainer.appendChild(postCard);
      });

      const chatButtons = document.querySelectorAll(".chat-button");
      chatButtons.forEach(button => {
        button.addEventListener("click", (event) => {
          const authorUsername = event.target.getAttribute("data-author-username");

          // 채팅 페이지로 이동, 작성자 username을 쿼리 매개변수로 전달
          window.location.href = `message.html?username=${encodeURIComponent(username)}`;
        });
      });
    })
    .catch(error => console.error('게시글을 불러오는 중 오류 발생:', error));
});

// 채팅 시작 함수
function startChat(username) {
  // 1대1 채팅 인터페이스로 이동, username을 쿼리 파라미터로 전달
  window.location.href = `message.html?username=${encodeURIComponent(username)}`;
}
