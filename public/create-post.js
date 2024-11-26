document.addEventListener("DOMContentLoaded", function() {
    const postForm = document.getElementById("post-form");

    if (!postForm) {
        console.error("게시글 작성 폼을 찾을 수 없습니다.");
        return;
    }

    postForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const bookTitle = document.getElementById("book-title").value;
        const author = document.getElementById("author").value;
        const publisher = document.getElementById("publisher").value;
        const courseName = document.getElementById("course-name").value;
        const price = document.getElementById("price").value;
        const content = document.getElementById("content").value;

        fetch("/create-post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, bookTitle, author, publisher, courseName, price, content }),
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("게시글이 작성되었습니다.");
                window.location.href = "board.html"; // 작성 완료 후 게시판으로 이동
            } else {
                alert(result.error || "게시글 작성에 실패했습니다.");
            }
        })
        .catch(error => console.error("게시글 작성 중 오류:", error));
    });
});
