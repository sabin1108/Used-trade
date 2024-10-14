document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.getElementById("post-form");
    const postsList = document.getElementById("posts-list");

    // 게시글 로드
    function loadPosts() {
        fetch('/get-posts')
            .then(response => response.json())
            .then(posts => {
                postsList.innerHTML = '';
                posts.forEach(post => {
                    const postItem = document.createElement('li');
                    postItem.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>${post.content}</p>
                        <p>작성자: ${post.author} | 작성 시간: ${new Date(post.created_at).toLocaleString()}</p>
                        ${post.isAuthor ? `
                        <button onclick="deletePost(${post.id})">삭제</button>
                        <button onclick="editPost(${post.id})">수정</button>
                        ` : `
                        <button onclick="startChat('${post.author}')">1대1 채팅</button>
                        `}
                    `;
                    postsList.appendChild(postItem);
                });
            })
            .catch(error => console.error('Error fetching posts:', error));
    }

    // 게시글 작성
    postForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        fetch('/create-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    loadPosts();
                } else {
                    alert('게시글 작성 실패');
                }
            })
            .catch(error => console.error('Error creating post:', error));
    });

    // 게시글 삭제 함수
    window.deletePost = function (postId) {
        if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            fetch(`/api/delete-post/${postId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert('게시글이 삭제되었습니다.');
                        loadPosts();
                    } else {
                        response.text().then((message) => alert(message));
                    }
                })
                .catch((err) => {
                    console.error('게시글 삭제 오류:', err);
                });
        }
    };

    // 게시글 수정 함수
    window.editPost = function (postId) {
        const newTitle = prompt('새로운 제목을 입력하세요:');
        const newContent = prompt('새로운 내용을 입력하세요:');

        if (newTitle && newContent) {
            fetch(`/api/update-post/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle, content: newContent }),
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        alert('게시글이 수정되었습니다.');
                        loadPosts();
                    } else {
                        alert('게시글 수정 실패: ' + result.message);
                    }
                })
                .catch(err => {
                    console.error('게시글 수정 오류:', err);
                });
        }
    };

    // 1대1 채팅 함수
    window.startChat = function (authorUsername) {
        window.location.href = `/chat.html?username=${authorUsername}`;
    };

    // 페이지 로드 시 게시글 목록 로드
    loadPosts();
});
