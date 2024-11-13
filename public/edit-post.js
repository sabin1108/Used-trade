// URL에서 postId 추출
function getPostId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('postId');
  }
  
  // 게시글 정보를 로드하는 함수
  async function loadPost() {
    const postId = getPostId();
    if (!postId) {
      alert('잘못된 접근입니다.');
      window.location.href = 'board.html';
      return;
    }
  
    try {
      const response = await fetch(`/api/get-post/${postId}`);
      const post = await response.json();
  
      document.getElementById('title').value = post.title;
      document.getElementById('book-title').value = post.book_title;
      document.getElementById('author').value = post.author;
      document.getElementById('publisher').value = post.publisher;
      document.getElementById('course-name').value = post.course_name;
      document.getElementById('price').value = post.price;
      document.getElementById('content').value = post.content;
    } catch (error) {
      console.error('게시글 로드 오류:', error);
    }
  }
  
  // 게시글 수정 함수
  async function updatePost(event) {
    event.preventDefault();
  
    const postId = getPostId();
    const postData = {
      title: document.getElementById('title').value,
      bookTitle: document.getElementById('book-title').value,
      author: document.getElementById('author').value,
      publisher: document.getElementById('publisher').value,
      courseName: document.getElementById('course-name').value,
      price: document.getElementById('price').value,
      content: document.getElementById('content').value,
    };
  
    try {
      const response = await fetch(`/api/update-post/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const result = await response.json();
  
      if (result.success) {
        alert('게시글이 수정되었습니다.');
        window.location.href = 'board.html'; // 수정 후 게시판 목록 페이지로 이동
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('게시글 수정 오류:', error);
    }
  }
  
  // 페이지 로드 시 게시글 정보 불러오기
  document.addEventListener('DOMContentLoaded', loadPost);
  document.getElementById('edit-post-form').addEventListener('submit', updatePost);
  