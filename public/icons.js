//상당 아이콘 이동
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("home-btn").addEventListener("click", () => {
      window.location.href = "home.html"; // Home 페이지로 이동
    });
    document.getElementById("profile-btn").addEventListener("click", () => {
      window.location.href = "profile.html"; // Profile 페이지로 이동
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
      fetch('/logout', { method: 'POST' })
        .then(response => {
          if (response.ok) {
            alert('로그아웃 성공!')
            window.location.href = "login.html"; // 로그아웃 후 로그인 페이지로 이동
          } else {
            console.error("로그아웃 실패");
          }
        })
        .catch(error => console.error("로그아웃 오류:", error));
    });
  });
