package com.example.software_app;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;
import java.util.List;

public class board_page extends AppCompatActivity {

    private ListView listView;
    private PostAdapter postAdapter; // PostAdapter 선언
    private List<Post> postList; // 게시글 목록
    private DBHelper dbHelper; // DBHelper 인스턴스

    private EditText editTextTitle, editTextContent; // 제목 및 내용 입력 필드
    private Button buttonAdd; // 추가 버튼

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.board_page);

        // 뷰 초기화
        listView = findViewById(R.id.listView);
        editTextTitle = findViewById(R.id.editTextTitle);
        editTextContent = findViewById(R.id.editTextContent);
        buttonAdd = findViewById(R.id.buttonAdd);

        // 데이터베이스 및 리스트 초기화
        dbHelper = new DBHelper(this); // DBHelper 초기화
        postList = new ArrayList<>(); // 게시글 목록 초기화
        postAdapter = new PostAdapter(this, postList); // PostAdapter 초기화
        listView.setAdapter(postAdapter); // ListView에 Adapter 설정

        loadPosts(); // 데이터베이스에서 게시글 로드

        // 게시글 추가 버튼 클릭 리스너
        buttonAdd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String title = editTextTitle.getText().toString();
                String content = editTextContent.getText().toString();

                if (!title.isEmpty() && !content.isEmpty()) {
                    Post newPost = new Post(title, content);
                    dbHelper.addPost(newPost); // 데이터베이스에 추가
                    editTextTitle.setText(""); // 입력 필드 초기화
                    editTextContent.setText(""); // 입력 필드 초기화
                    loadPosts(); // 게시글 목록 새로 고침
                }
            }
        });
    }

    // 게시글 목록을 데이터베이스에서 가져오는 메서드
    private void loadPosts() {
        postList.clear(); // 기존 목록 초기화
        postList.addAll(dbHelper.getAllPosts()); // 데이터베이스에서 게시글 가져오기
        postAdapter.notifyDataSetChanged(); // ListView 업데이트
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadPosts(); // 화면이 다시 나타날 때 게시글 목록 새로 고침
    }
}
