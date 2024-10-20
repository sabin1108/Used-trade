package com.example.software_app;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import androidx.appcompat.app.AppCompatActivity;

public class AddPostActivity extends AppCompatActivity {

    private EditText editTextTitle, editTextContent;
    private Button buttonSubmit;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_post);

        editTextTitle = findViewById(R.id.editTextTitle);
        editTextContent = findViewById(R.id.editTextContent);
        buttonSubmit = findViewById(R.id.buttonSubmit);

        buttonSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String title = editTextTitle.getText().toString();
                String content = editTextContent.getText().toString();

                // 게시글을 추가하고 리스트에 다시 돌아가기
                if (!title.isEmpty() && !content.isEmpty()) {
                    // 데이터 추가 로직을 여기에 구현합니다.
                    // 예: 게시글 목록에 추가하고 finish()를 호출하여 이전 액티비티로 돌아갑니다.
                    Intent intent = new Intent();
                    intent.putExtra("title", title);
                    intent.putExtra("content", content);
                    setResult(RESULT_OK, intent);
                    finish();
                }
            }
        });
    }
}
