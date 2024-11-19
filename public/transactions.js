document.addEventListener("DOMContentLoaded", () => {
    const saleList = document.getElementById("sale-list");
    const logoutBtn = document.getElementById("logout-btn");
    
    let allTransactions = []; // 모든 판매내역을 저장

    if (!saleList || !logoutBtn) {
      console.error("필수 요소를 찾을 수 없습니다.");
      return;
    }

    // 로그아웃 버튼 이벤트
    logoutBtn.addEventListener("click", () => {
      fetch('/logout', { method: 'POST' })
        .then(response => {
          if (response.ok) {
            window.location.href = '/login.html';
          } else {
            console.error("로그아웃 실패");
          }
        })
        .catch(error => console.error("로그아웃 중 오류:", error));
    });

    // 거래내역 로드 함수
    function loadTransactions() {
      fetch('/transactions')
        .then(response => response.json())
        .then(transactions => {
          console.log("거래내역 데이터:", transactions);
          allTransactions = transactions; // 모든 판매내역 저장
          displayTransactions(allTransactions); // 초기 로딩 시 전체 판매내역 표시
        })
        .catch(error => console.error("게시글 데이터 로드 오류:", error));
    }

    // 판매내역을 화면에 표시하는 함수
    function displayTransactions(transactions) {
      saleList.innerHTML = '';

      transactions.forEach(transaction => {
        const saleItem = document.createElement('li');
        saleItem.setAttribute("data-transaction-id", transaction.id);

        // is_sold 상태에 따라 제목 앞에 [판매완료] / [판매중] 표시
        const titlePrefix = transaction.is_sold ? "[판매완료] " : "[판매중] ";
        saleItem.innerHTML = `
            <h3>${titlePrefix}${transaction.book_title} (${transaction.publisher}) - ${transaction.price}원</h3>
            <p>저자: ${transaction.author}, 강의명: ${transaction.course_name}</p>
        `;
        saleList.appendChild(saleItem);
      });
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

    // 초기 로드
    loadTransactions();
    loadUserInfo();
  });
