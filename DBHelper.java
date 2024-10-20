package com.example.software_app;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import java.util.ArrayList;
import java.util.List;

public class DBHelper extends SQLiteOpenHelper {

    private static final String DATABASE_NAME = "posts.db"; // 데이터베이스 이름
    private static final int DATABASE_VERSION = 1; // 데이터베이스 버전

    // 테이블 이름과 칼럼
    public static final String TABLE_POSTS = "posts";
    public static final String COLUMN_ID = "id";
    public static final String COLUMN_TITLE = "title";
    public static final String COLUMN_CONTENT = "content";

    // 테이블 생성 SQL
    private static final String TABLE_CREATE =
            "CREATE TABLE " + TABLE_POSTS + " (" +
                    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    COLUMN_TITLE + " TEXT, " +
                    COLUMN_CONTENT + " TEXT);";

    public DBHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(TABLE_CREATE); // 테이블 생성
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_POSTS); // 기존 테이블 삭제
        onCreate(db); // 새로 생성
    }

    public void addPost(Post post) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_TITLE, post.getTitle());
        values.put(COLUMN_CONTENT, post.getContent());

        db.insert(TABLE_POSTS, null, values); // 게시글 삽입
        db.close(); // 데이터베이스 닫기
    }

    // 모든 게시글 가져오기
    public List<Post> getAllPosts() {
        List<Post> postList = new ArrayList<>();
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor cursor = db.query(TABLE_POSTS, new String[]{COLUMN_ID, COLUMN_TITLE, COLUMN_CONTENT}, null, null, null, null, null);

        if (cursor.moveToFirst()) {
            do {
                Post post = new Post();
                post.setId(cursor.getInt(0));
                post.setTitle(cursor.getString(1));
                post.setContent(cursor.getString(2));
                postList.add(post);
            } while (cursor.moveToNext());
        }
        cursor.close(); // Cursor 닫기
        db.close(); // 데이터베이스 닫기
        return postList; // 게시글 목록 반환
    }
}

