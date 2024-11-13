document.addEventListener("DOMContentLoaded", () => {
    const postsList = document.getElementById("posts-list");
    const logoutBtn = document.getElementById("logout-btn");
    const createPostBtn = document.getElementById("create-post-btn");
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");
    let allPosts = []; // 모든 게시글을 저장하여 검색 필터링에 사용

    if (!postsList || !logoutBtn || !createPostBtn || !searchBtn || !searchInput) {
        console.error("필수 요소를 찾을 수 없습니다.");
        return;
    }
    createPostBtn.addEventListener("click", function() {
        location.href = 'create-post.html'; // 게시글 작성 페이지로 이동
    });

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

    // 게시글 로드 함수
    function loadPosts() {
        fetch('/get-posts')
            .then(response => response.json())
            .then(posts => {
                console.log("게시글 데이터:", posts);
                allPosts = posts; // 모든 게시글을 저장
                displayPosts(allPosts); // 초기 로딩 시 전체 게시글 표시
            })
            .catch(error => console.error("게시글 데이터 로드 오류:", error));
    }

    
    // 게시글을 화면에 표시하는 함수
    function displayPosts(posts) {
        postsList.innerHTML = '';
    
        posts.forEach(post => { // `post` 변수가 forEach 문 안에서 정의됨
            const postItem = document.createElement('li');
            postItem.setAttribute("data-post-id", post.id); // 게시글 ID 속성 추가
    
            const titlePrefix = post.is_sold ? "[판매완료] " : "";
            postItem.innerHTML = `
                <h3>${titlePrefix}${post.title}</h3>
                <p>책 제목: ${post.book_title}</p>
                <p>저자: ${post.author}</p>
                <p>출판사: ${post.publisher}</p>
                <p>강의명: ${post.course_name}</p>
                <p>가격: ${post.price}원</p>
                <p>${post.content}</p>
                <p>작성자: ${post.author} | 작성 시간: ${new Date(post.created_at).toLocaleString()}</p>
                ${post.isAuthor ? `
                <button onclick="deletePost(${post.id})">삭제</button>
                <button onclick="editPost(${post.id})">수정</button>
                <button onclick="markAsSold(${post.id})" ${post.is_sold ? 'disabled' : ''}>판매완료</button>
                ` : `
                <button onclick="startChat('${post.author}')">1대1 채팅</button>
                `}
            `;
            postsList.appendChild(postItem);
        });
    }
    


    

    // 게시글 삭제 함수
    window.deletePost = function(postId) {
        if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            fetch(`/api/delete-post/${postId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        alert('게시글이 삭제되었습니다.');
                        loadPosts();
                    } else {
                        alert(result.error);
                    }
                })
                .catch(error => console.error('게시글 삭제 오류:', error));
        }
    };

    // 게시글 수정 함수
    window.editPost = function(postId) {
        location.href = `edit-post.html?postId=${postId}`;
    };

    // 게시글 판매완료 상태 업데이트 함수
    // 게시글 판매완료 상태 업데이트 함수
    window.markAsSold = function(postId) {
        if (confirm('이 게시글을 판매 완료로 표시하시겠습니까?')) {
            fetch(`/api/mark-as-sold/${postId}`, {
                method: 'PUT',
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        alert('게시글이 판매 완료로 업데이트되었습니다.');
                        
                        // 판매 완료 상태를 즉시 반영
                        const postItem = document.querySelector(`li[data-post-id="${postId}"]`);
                        if (postItem) {
                            const titleElement = postItem.querySelector("h3");
                            if (titleElement && !titleElement.textContent.startsWith("[판매완료]")) {
                                titleElement.textContent = "[판매완료] " + titleElement.textContent;
                            }
                            // 판매완료 버튼 비활성화
                            const markAsSoldButton = postItem.querySelector("button[onclick^='markAsSold']");
                            if (markAsSoldButton) {
                                markAsSoldButton.disabled = true;
                            }
                        }
                    } else {
                        alert(result.error);
                    }
                })
                .catch(error => console.error('판매 완료 업데이트 오류:', error));
        }
    };


    // 게시글 검색 기능
    function searchPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm) || 
            post.book_title.toLowerCase().includes(searchTerm) ||
            post.author.toLowerCase().includes(searchTerm) ||
            post.publisher.toLowerCase().includes(searchTerm) ||
            post.course_name.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm)
        );
        displayPosts(filteredPosts);
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
    

    // 검색 버튼 클릭 이벤트
    searchBtn.addEventListener("click", searchPosts);

    // 엔터 키로 검색 실행
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            searchPosts();
        }
    });

    // 초기 로드
    loadPosts();
    loadUserInfo();
});
console.log("is_sold 상태 확인:", post.is_sold);
