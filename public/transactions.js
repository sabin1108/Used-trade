document.addEventListener("DOMContentLoaded", () => {
  const salesList = document.getElementById("sales-list");
  const logoutBtn = document.getElementById("logout-btn");
  
  if (!salesList || !logoutBtn) {
    console.error("필수 요소를 찾을 수 없습니다.");
    return;
  }
  
// 거래 내역을 로드하는 함수
function loadSales() {
  fetch('/transactions')
    .then(response => response.json())
    .then(transactions => {
      // console.log("거래내역 데이터:", transactions);
      salesList.innerHTML = '';
      transactions.forEach(transaction => {
        const saleItem = document.createElement("div");
        const titlePrefix = transaction.is_sold ? "[판매완료] " : "[판매중] ";

        saleItem.className = "bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg";
        saleItem.innerHTML = `
          <img src="/hknu.png" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="font-semibold text-lg text-gray-800 mb-2">${titlePrefix} ${transaction.book_title}</h3>
        <p class="font-bold text-blue-600 mb-2">${transaction.price}원</p>
        <p class="text-gray-600 mb-4">${transaction.publisher}(${transaction.author})</p>
        <p class="text-gray-600 mb-4">강의명: ${transaction.course_name}</p>
      </div>
        `;
        salesList.appendChild(saleItem);
      });
      
    })
    .catch((error) => console.error("거래내역 로드 오류:", error));
  }

  // 사용자 정보를 서버에서 가져와 표시
  function loadUserInfo() {
      fetch('/api/profile')
          .then(response => response.json())
          .then(data => {
              if (data && data.username) {
                  document.getElementById('username').innerText = data.username;
                  document.getElementById('student_num').innerText = data.student_num;
                  document.getElementById('user-info').style.display = 'block'; // 사용자 정보 표시
              }
          })
          .catch(error => console.error('사용자 정보를 불러오는 중 오류 발생:', error));
  }

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

  // 초기 로드
  loadUserInfo();
  loadChatList();
  loadSales();
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
