package com.example.stocks;


import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Canvas;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Objects;

import it.xabaras.android.recyclerview.swipedecorator.RecyclerViewSwipeDecorator;

public class ItemMoveCallback extends ItemTouchHelper.Callback {
    int flag; // 0 portfolio
    private Context  context;
    private final HomeItemAdapter mAdapter;
    SharedPreferences.Editor editor;
    private ArrayList<Stock> list;

    public ItemMoveCallback(HomeItemAdapter adapter, Context context, int flag, ArrayList<Stock> list, SharedPreferences.Editor editor) {
        mAdapter = adapter;
        this.context = context;
        this.flag = flag;
        this.list = list;
        this.editor = editor;
    }

    public void upDate( ArrayList<Stock> list) {
        this.list = list;
    }

    @Override
    public boolean isLongPressDragEnabled() {
        return true;
    }

    @Override
    public boolean isItemViewSwipeEnabled() {
        return true;
    }



    @Override
    public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
        if (direction == ItemTouchHelper.LEFT) {
            int pos = viewHolder.getAdapterPosition();
            editor.remove(list.get(pos).ticker);
            editor.apply();
            list.remove(pos);
            mAdapter.notifyItemRemoved(pos);
            mAdapter.notifyDataSetChanged();
        }
    }

    @Override
    public void onChildDraw(@NonNull Canvas c, @NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder, float dX, float dY, int actionState, boolean isCurrentlyActive) {
        new RecyclerViewSwipeDecorator.Builder(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive)
                .addSwipeLeftBackgroundColor(ContextCompat.getColor(context, R.color.red))
                .addSwipeLeftActionIcon(R.drawable.ic_baseline_delete_24)
                .create()
                .decorate();
        super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);
    }

    @Override
    public int getMovementFlags(RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder) {
        if (flag == 0) {
            return makeMovementFlags(ItemTouchHelper.UP | ItemTouchHelper.DOWN, 0);
        } else {
            return makeMovementFlags(ItemTouchHelper.UP | ItemTouchHelper.DOWN | ItemTouchHelper.START | ItemTouchHelper.END, ItemTouchHelper.LEFT);
        }
    }

    @Override
    public boolean onMove(RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder,
                          RecyclerView.ViewHolder target) {
        Collections.swap(list, viewHolder.getAdapterPosition(), target.getAdapterPosition());
        Objects.requireNonNull(recyclerView.getAdapter()).notifyItemMoved(viewHolder.getAdapterPosition(), target.getAdapterPosition());
        mAdapter.notifyDataSetChanged();
        return true;
    }

    @Override
    public void onSelectedChanged(RecyclerView.ViewHolder viewHolder,
                                  int actionState) {
        if (actionState != ItemTouchHelper.ACTION_STATE_IDLE) {
            if (viewHolder instanceof HomeItemAdapter.StockViewHolder) {
                HomeItemAdapter.StockViewHolder myViewHolder=
                        (HomeItemAdapter.StockViewHolder) viewHolder;
                mAdapter.onRowSelected(myViewHolder);
            }
        }
        super.onSelectedChanged(viewHolder, actionState);
    }

    @Override
    public void clearView(RecyclerView recyclerView,
                          RecyclerView.ViewHolder viewHolder) {
        super.clearView(recyclerView, viewHolder);

        if (viewHolder instanceof HomeItemAdapter.StockViewHolder) {
            HomeItemAdapter.StockViewHolder myViewHolder =
                    (HomeItemAdapter.StockViewHolder) viewHolder;
            mAdapter.onRowClear(myViewHolder);
        }
    }

    public interface ItemTouchHelperContract {

        void onRowMoved(int fromPosition, int toPosition);

        void onRowSelected(HomeItemAdapter.StockViewHolder myViewHolder);

        void onRowClear(HomeItemAdapter.StockViewHolder myViewHolder);

    }

}



