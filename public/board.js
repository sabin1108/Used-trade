document.addEventListener("DOMContentLoaded", () => {
    const homeBtn = document.getElementById("home-btn");
    const postsList = document.getElementById("posts-list");
    const createPostBtn = document.getElementById("create-post-btn");
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");

    if (!homeBtn || !postsList || !createPostBtn || !searchBtn || !searchInput) {
        console.error("필수 요소를 찾을 수 없습니다.");
        return;
    }

    // 홈으로 이동 버튼 이벤트
    homeBtn.addEventListener("click", () => {
        location.href = "home.html";
    });

    // 새 게시글 작성 버튼 이벤트
    createPostBtn.addEventListener("click", () => {
        location.href = "create-post.html";
    });

    // 검색 버튼 이벤트
    searchBtn.addEventListener("click", () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            loadPosts(); // 검색어가 없으면 전체 게시글 다시 로드
            return;
        }

        fetch(`/get-posts`)
            .then(response => response.json())
            .then(posts => {
                const filteredPosts = posts.filter(post =>
                    post.title.toLowerCase().includes(searchTerm) ||
                    post.book_title.toLowerCase().includes(searchTerm) ||
                    post.author.toLowerCase().includes(searchTerm) ||
                    post.publisher.toLowerCase().includes(searchTerm)
                );
                displayPosts(filteredPosts);
            })
            .catch(error => console.error("검색 중 오류:", error));
    });

    // 게시글 로드 함수
    function loadPosts() {
        fetch("/get-posts")
            .then(response => response.json())
            .then(posts => {
                displayPosts(posts);
            })
            .catch(error => console.error("게시글 로드 오류:", error));
    }

    // 게시글을 화면에 표시하는 함수
    function displayPosts(posts) {
        const postsList = document.getElementById("posts-list");
        postsList.innerHTML = ""; // 기존 게시글 초기화
        
        posts.forEach(post => {
             // num이 없으면 4자리 랜덤 숫자를 생성
        if (!post.num) {
            post.num = Math.floor(1000 + Math.random() * 9000);
            
            // 서버로 num 업데이트 요청
            fetch(`/update-num/${post.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ num: post.num })
            }).catch(error => console.error("num 업데이트 오류:", error));
        }
            const postItem = document.createElement("div");
            postItem.className = "bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300";
        
            const titlePrefix = post.is_sold ? "[판매완료] " : "";
        
            postItem.innerHTML = `
                <h3 class="text-lg font-semibold text-gray-800 mb-2">${titlePrefix}${post.title}</h3>
                <p class="text-sm text-gray-600 mb-2"><strong>책 제목:</strong> ${post.book_title}</p>
                <p class="text-sm text-gray-600 mb-2"><strong>저자:</strong> ${post.author}</p>
                <p class="text-sm text-gray-600 mb-2"><strong>출판사:</strong> ${post.publisher}</p>
                <p class="text-sm text-gray-600 mb-2"><strong>가격:</strong> ${post.price}원</p>
                <p class="text-xs text-gray-500 mb-4">작성자: ${post.author_name} | 작성 시간: ${new Date(post.created_at).toLocaleString()}</p>
                <div class="flex space-x-2">
                    ${post.isAuthor ? `
                        <button class="delete-btn bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300" data-id="${post.id}">삭제</button>
                        <button class="edit-btn bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition duration-300" data-id="${post.id}">수정</button>
                        <button class="mark-as-sold-btn bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300" data-id="${post.id}" ${post.is_sold ? "disabled" : ""}>판매완료</button>
                    ` : ""}
                    <span class="text-gray-500 text-sm">#${post.num || "N/A"}</span>
                </div>
            `;
            postsList.appendChild(postItem);
        });
        attachEventListeners();
    
    
    
    

        function attachEventListeners() {
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", event => {
                    const postId = event.target.getAttribute("data-id");
                    deletePost(postId);
                });
            });
        
            document.querySelectorAll(".edit-btn").forEach(button => {
                button.addEventListener("click", event => {
                    const postId = event.target.getAttribute("data-id");
                    location.href = `edit-post.html?postId=${postId}`;
                });
            });
        
            document.querySelectorAll(".mark-as-sold-btn").forEach(button => {
                button.addEventListener("click", event => {
                    const postId = event.target.getAttribute("data-id");
                    markAsSold(postId);
                });
            });
        }
    }

    // 게시글 삭제 함수
    function deletePost(postId) {
        if (!confirm("정말로 삭제하시겠습니까?")) return;

        fetch(`/api/delete-post/${postId}`, { method: "DELETE" })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert("게시글이 삭제되었습니다.");
                    loadPosts();
                } else {
                    alert(result.error || "게시글 삭제 실패");
                }
            })
            .catch(error => console.error("게시글 삭제 오류:", error));
    }

    // 게시글 판매완료 함수
    function markAsSold(postId) {
        fetch(`/api/mark-as-sold/${postId}`, { method: "PUT" })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert("게시글이 판매 완료되었습니다.");
                    loadPosts();
                } else {
                    alert(result.error || "판매완료 실패");
                }
            })
            .catch(error => console.error("판매 완료 오류:", error));
    }

    // 초기 로드
    loadPosts();
});
