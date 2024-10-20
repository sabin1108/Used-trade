package com.example.software_app;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;
import java.util.List;

public class PostAdapter extends ArrayAdapter<Post> {
    private final Context context;
    private final List<Post> posts;

    public PostAdapter(Context context, List<Post> posts) {
        super(context, R.layout.post_item, posts);
        this.context = context;
        this.posts = posts;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View rowView = inflater.inflate(R.layout.post_item, parent, false);

        TextView titleTextView = rowView.findViewById(R.id.titleTextView);
        TextView contentTextView = rowView.findViewById(R.id.contentTextView);

        Post post = posts.get(position);
        titleTextView.setText(post.getTitle());
        contentTextView.setText(post.getContent());

        return rowView;
    }
}
