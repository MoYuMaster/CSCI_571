package com.example.stocks;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatDialogFragment;

import com.squareup.picasso.Picasso;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class NewsDiaglog extends AppCompatDialogFragment {
    private String imgUrl;
    private String title;
    private String url;
    private Context context;

    public NewsDiaglog(String imgUrl, String title, String url, Context ctx) {
        this.imgUrl = imgUrl;
        this.title = title;
        this.url = url;
        this.context = ctx;
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        LayoutInflater inflater = getActivity().getLayoutInflater();
        View view = inflater.inflate(R.layout.news_dialog, null);
        builder.setView(view);
        // Load Data //
        Picasso.with(view.getContext()).load(imgUrl.replace("http:", "https:"))
                .resize(1100, 775).into((ImageView)view.findViewById(R.id.newsDialogimg));
        TextView titleView = (TextView)view.findViewById(R.id.newsDialogTitle);
        titleView.setText(title);
        // Set Button //
        ImageButton twitterBtn = (ImageButton)view.findViewById(R.id.twitterBtn);
        twitterBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String encodedUrl = "";
                try {
                    encodedUrl = URLEncoder.encode(url, "UTF-8");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                    System.out.println("Twitter link encode Error.");
                }
                String twitterUrl = "https://twitter.com/intent/tweet?url=" + encodedUrl + "&text=Check%20out%20this%20Link:" + "&hashtags=CSCI571StockApp";
                Intent browsIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(twitterUrl));
                context.startActivity(browsIntent);
            }
        });
        ImageButton chromeBtn = (ImageButton)view.findViewById(R.id.chromeBtn);
        chromeBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent browsIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                context.startActivity(browsIntent);
            }
        });
        return builder.create();
    }

    @Override
    public void onResume() {
        super.onResume();
        Window window = getDialog().getWindow();
        window.setLayout(1100,WindowManager.LayoutParams.WRAP_CONTENT);
    }
}
