package com.example.stocks;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.RecyclerView;

import com.squareup.picasso.Picasso;

import java.util.ArrayList;
import java.util.Objects;

public class NewsAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    Context context;
    ArrayList<News> newsList;
    FragmentManager fragmentManager;

    public NewsAdapter(Context cxt, ArrayList<News> newsArrayList, FragmentManager manager) {
        context = cxt;
        newsList = newsArrayList;
        fragmentManager = manager;
    }
    @Override
    public int getItemViewType(int position) {
        return (position == 0)? 0 : 1;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        switch (viewType) {
            case 0:
                View view = inflater.inflate(R.layout.first_news, parent, false);
                return new FirstNewsViewHolder(view);
            default:
                View view2 = inflater.inflate(R.layout.news_row, parent, false);
                return new NewsViewHolder(view2);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        switch (holder.getItemViewType()) {
            case 0 :
                FirstNewsViewHolder firstNewsViewHolder = (FirstNewsViewHolder)holder;
                firstNewsViewHolder.currentNews = newsList.get(position);
                firstNewsViewHolder.source.setText(newsList.get(position).source);
                firstNewsViewHolder.time.setText(timeAgo(newsList.get(position).timeForNews, position));
                firstNewsViewHolder.title.setText(newsList.get(position).title);
                Picasso.with(context).load(newsList.get(position).imgUrl.replace("http:", "https:")).resize(1500, 0).into(((FirstNewsViewHolder) holder).imageView);
                break;
            case 1:
                NewsViewHolder holder1 = (NewsViewHolder)holder;
                holder1.currentNews = newsList.get(position);
                holder1.source.setText(newsList.get(position).source);
                holder1.time.setText(timeAgo(newsList.get(position).timeForNews, position));
                holder1.title.setText(newsList.get(position).title);
                Picasso.with(context).load(newsList.get(position).imgUrl.replace("http:", "https:")).resize(350, 350).into(((NewsViewHolder) holder).imageView);
                break;
        }
    }

    private String timeAgo(String news,int position) {
        String res;
        long now = System.currentTimeMillis();
        long newsTime = Long.parseLong(news);
        long diff = now - newsTime;
        // Out put minutes //
        if (diff < (3600 * 1000)) {
            res = Long.toString(diff / (60 * 1000)) + " minutes ago";
        } else if ( diff < (24*3600*1000)){
            res = Long.toString(diff / (3600 * 1000)) + " hours ago";
        } else {
            long tmp = diff / (24*3600*1000) ;
            res = Long.toString(tmp) + " days ago";
        }
        return res;
    }

    @Override
    public int getItemCount() {
        return newsList.size();
    }

    class NewsViewHolder extends RecyclerView.ViewHolder{
        TextView source, time, title;
        com.makeramen.roundedimageview.RoundedImageView imageView;
        News currentNews;

        public NewsViewHolder(@NonNull View itemView) {
            super(itemView);
            source = itemView.findViewById(R.id.newsSource);
            time = itemView.findViewById(R.id.newsTime);
            title = itemView.findViewById(R.id.newsTitle);
            imageView = itemView.findViewById(R.id.newsImg);
            // Click on Card, open url with default browsers //
            itemView.setOnClickListener(new View.OnClickListener(){
                @Override
                public void onClick(View v) {
                    Intent browsIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(currentNews.urlForNews));
                    context.startActivity(browsIntent);
                }
            });
            // Long Click on Card //
            itemView.setOnLongClickListener(new View.OnLongClickListener(){
                @Override
                public boolean onLongClick(View v) {
                    NewsDiaglog newsDiaglog = new NewsDiaglog(currentNews.imgUrl, currentNews.title, currentNews.urlForNews, context);
                    newsDiaglog.setStyle(DialogFragment.STYLE_NO_TITLE, 0);
                    newsDiaglog.show(fragmentManager, "News Dialog");
                    return false;
                }
            });
        }
    }

    class FirstNewsViewHolder extends RecyclerView.ViewHolder {
        TextView source, time, title;
        com.makeramen.roundedimageview.RoundedImageView imageView;
        News currentNews;

        public FirstNewsViewHolder(@NonNull View itemView) {
            super(itemView);
            source = itemView.findViewById(R.id.firstNewsSource);
            time = itemView.findViewById(R.id.firstNewsTime);
            title = itemView.findViewById(R.id.firstNewsTitle);
            imageView = itemView.findViewById(R.id.firstNewsImg);
            // Click on Card, open url with default browsers //
            itemView.setOnClickListener(new View.OnClickListener(){
                @Override
                public void onClick(View v) {
                    Intent browsIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(currentNews.urlForNews));
                    context.startActivity(browsIntent);
                }
            });
            // Long Click on Card //
            itemView.setOnLongClickListener(new View.OnLongClickListener(){
                @Override
                public boolean onLongClick(View v) {
                    NewsDiaglog newsDiaglog = new NewsDiaglog(currentNews.imgUrl, currentNews.title, currentNews.urlForNews, context);
                    newsDiaglog.setStyle(DialogFragment.STYLE_NO_TITLE, 0);
                    newsDiaglog.show(fragmentManager, "News Dialog");
                    return false;
                }
            });
        }
    }
}
