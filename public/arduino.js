document.getElementById("rotateButton").addEventListener("click", () => {
    fetch("/rotate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ angle: 90 }), // 90도 회전 명령 전송
    })
      .then((response) => {
        if (response.ok) {
          alert("모터 회전 명령이 전송되었습니다!");
        } else {
          alert("명령 전송에 실패했습니다.");
        }
      })
      .catch((error) => console.error("Error:", error));
  });
  
