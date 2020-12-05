package com.example.stocks;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.Collections;

public class HomeItemAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> implements ItemMoveCallback.ItemTouchHelperContract{
    private Context context;
    private ArrayList<Stock> stockArrayList;

    public HomeItemAdapter(Context cxt, ArrayList<Stock> list) {
        context = cxt;
        stockArrayList = list;
    }
    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.main_row, parent, false);
        return new StockViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        StockViewHolder stockViewHolder = (StockViewHolder) holder;
//        if (stockArrayList.get(position).ticker != stockViewHolder.ticker.getText().toString()) {
//
//        } else {
            stockViewHolder.ticker.setText(stockArrayList.get(position).ticker);
            stockViewHolder.currentPrice.setText(stockArrayList.get(position).currentPrice);
            stockViewHolder.nameOrShares.setText(stockArrayList.get(position).nameOrShares);
            stockViewHolder.change.setText(stockArrayList.get(position).change);
            // Change Symbol Color //
            float changeCheck = Float.parseFloat(stockArrayList.get(position).change);
            if (changeCheck < 0) {
                stockViewHolder.symbol.setBackgroundResource(R.drawable.ic_baseline_trending_down_24);
                stockViewHolder.change.setTextColor(context.getColor(R.color.red));
                stockViewHolder.change.setText(stockArrayList.get(position).change.substring(1));
            } else {
                stockViewHolder.symbol.setBackgroundResource(R.drawable.ic_twotone_trending_up_24);
                stockViewHolder.change.setTextColor(context.getColor(R.color.green));
            }
            stockViewHolder.arrow.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
//                Intent intent = new Intent(context, DetailPage.class);
//                intent.putExtra("tickerName", stockArrayList.get(position).ticker);
//                context.startActivity(intent);
                    Intent intent = new Intent(context, DetailPage.class);
                    intent.putExtra("tickerName", stockArrayList.get(position).ticker);
                    ((MainActivity)context).startActivityForResult(intent, 2);
                }
            });
       // }
    }

    @Override
    public int getItemCount() {
        return stockArrayList.size();
    }

    class StockViewHolder extends RecyclerView.ViewHolder {
        TextView ticker, currentPrice, nameOrShares, change;
        ImageView symbol, arrow;
        View rowView;
        public StockViewHolder(View view) {
            super(view);
            ticker = view.findViewById(R.id.main_ticker);
            currentPrice = view.findViewById(R.id.main_current_price);
            nameOrShares = view.findViewById(R.id.main_name_shares);
            change = view.findViewById(R.id.main_change);
            symbol = view.findViewById(R.id.main_symbol);
            arrow = view.findViewById(R.id.main_arrow);
            rowView = view;
        }
    }

    @Override
    public void onRowMoved(int fromPosition, int toPosition) {
        if (fromPosition < toPosition) {
            for (int i = fromPosition; i < toPosition; i++) {
                Collections.swap(stockArrayList, i, i + 1);
            }
        } else {
            for (int i = fromPosition; i > toPosition; i--) {
                Collections.swap(stockArrayList, i, i - 1);
            }
        }
        notifyItemMoved(fromPosition, toPosition);
    }

    @Override
    public void onRowSelected(StockViewHolder myViewHolder) {
        myViewHolder.rowView.setBackgroundColor(Color.GRAY);

    }

    @Override
    public void onRowClear(StockViewHolder myViewHolder) {
        myViewHolder.rowView.setBackgroundColor(Color.WHITE);

    }
}
