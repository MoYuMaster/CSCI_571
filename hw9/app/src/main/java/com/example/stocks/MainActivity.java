package com.example.stocks;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatAutoCompleteTextView;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.core.view.MenuItemCompat;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Canvas;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ProgressBar;
import androidx.appcompat.widget.SearchView;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import it.xabaras.android.recyclerview.swipedecorator.RecyclerViewSwipeDecorator;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import android.widget.TextView;

import android.widget.AutoCompleteTextView;

import com.android.volley.Response;
import com.android.volley.VolleyError;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import static java.util.concurrent.TimeUnit.*;
import java.util.concurrent.Executor;
import java.util.concurrent.ScheduledExecutorService;

public class MainActivity extends AppCompatActivity {

    private Toolbar toolbar;
    private ProgressBar spinner;
    // AutoComplete Setting //
    private static final int TRIGGER_AUTO_COMPLETE = 100;
    private static final long AUTO_COMPLETE_DELAY = 300;
    private Handler handler;
    private AutoSuggestAdapter autoSuggestAdapter;
    private ArrayList<Stock> portfolioArrayList;
    private ArrayList<Stock> favoriteArrayList;
    private RecyclerView portfolioView;
    private RecyclerView favoriteView;
    private HomeItemAdapter portfolioAdapter, favoriteAdapter;
    private float netWorth;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private int loadFlag;
    private Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.Theme_Stocks);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        loadFlag = 0;
        context = this;
        //  Set bar
        toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        //  Update Date //
        Date date=java.util.Calendar.getInstance().getTime();
        SimpleDateFormat formatter = new SimpleDateFormat("MMMM dd, yyyy");
        String strDate = formatter.format(date);
        changeTextView(R.id.main_date, strDate);
        // Main Flow //
        mainFlow();
    }

    private void loadCheck(int loadFlag) {
        if (loadFlag == 2) {
            // Hide Progress Bar //
            findViewById(R.id.home_progressbar).setVisibility(View.INVISIBLE);
            findViewById(R.id.home_fetch_data).setVisibility(View.INVISIBLE);
            // Set visible //
            findViewById(R.id.main_date).setVisibility(View.VISIBLE);
            findViewById(R.id.main_portfolio).setVisibility(View.VISIBLE);
            findViewById(R.id.main_favorite).setVisibility(View.VISIBLE);
            findViewById(R.id.main_tiingo_footer).setVisibility(View.VISIBLE);
        }
    }

    private void upDate(String portfolioQuery, String favoriteQuery,Map<String, ?> sharesMap, Map<String, ?> favoriteMap) {
//        portfolioAdapter.notifyDataSetChanged();
        final Runnable upDateHelper = new Runnable() {
            @Override
            public void run() {
                ApiCall.getHomeData(MainActivity.this, portfolioQuery, new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) { // Portfolio Part
                        try {
                            netWorth = 0;
                            SharedPreferences remainLib = getSharedPreferences("remain", MODE_PRIVATE);
                            netWorth = remainLib.getFloat("remain", 0);
//                            portfolioArrayList.clear();
                            for (int i = 0; i < response.length(); ++i) {
                                JSONObject item = response.getJSONObject(i);
                                String sharesOwn = sharesMap.get(item.getString("ticker")).toString();
//                                Stock stock = new Stock(item.getString("ticker"), sharesOwn + " shares", item.getString("last"), item.getString("change"));
//                                portfolioArrayList.add(stock);
                                int childPosition = portfolioView.getChildCount();
                                for (int j = 0; j < childPosition; ++j) {
                                    HomeItemAdapter.StockViewHolder holder = (HomeItemAdapter.StockViewHolder) portfolioView.getChildViewHolder(portfolioView.getChildAt(j));
                                    if (holder.ticker.getText().toString().equals(item.getString("ticker"))) {
                                        holder.currentPrice.setText(item.getString("last"));
                                        // check change //
                                        float changeCheck = Float.parseFloat(item.getString("change"));
                                        if (changeCheck < 0) {
                                            holder.symbol.setBackgroundResource(R.drawable.ic_baseline_trending_down_24);
                                            holder.change.setTextColor(context.getColor(R.color.red));
                                            holder.change.setText(item.getString("change").substring(1));
                                        } else {
                                            holder.symbol.setBackgroundResource(R.drawable.ic_twotone_trending_up_24);
                                            holder.change.setTextColor(context.getColor(R.color.green));
                                            holder.change.setText(item.getString("change"));
                                        }
                                    }
                                }
                                // Update NewWorth //
                                netWorth += Float.parseFloat(item.getString("last"))*Float.parseFloat(sharesOwn);
                            }
//                            portfolioAdapter = new HomeItemAdapter(MainActivity.this, portfolioArrayList);
//                            portfolioView.setAdapter(portfolioAdapter);
//                            portfolioView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
                            DecimalFormat decimalFormat = new DecimalFormat(".00");
                            String newWorthStr = decimalFormat.format(netWorth);
                            changeTextView(R.id.main_networth_value, newWorthStr);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        error.printStackTrace();
                        System.out.println("Home Response Error");
                    }
                });
                //
                ApiCall.getHomeData(MainActivity.this, favoriteQuery, new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) { // Favorite Part
                        try {
//                            favoriteArrayList.clear();
                            for (int i = 0; i < response.length(); ++i) {
                                JSONObject item = response.getJSONObject(i);
                                String stockName = favoriteMap.get(item.getString("ticker")).toString();
                                // If it has shares //
                                if (sharesMap.containsKey(item.getString("ticker"))) {
                                    stockName = sharesMap.get(item.getString("ticker")).toString() + " shares";
                                }
                                Stock stock = new Stock(item.getString("ticker"), stockName, item.getString("last"), item.getString("change"));
//                                favoriteArrayList.add(stock);
                                int childPosition = favoriteView.getChildCount();
                                for (int j = 0; j < childPosition; ++j) {
                                    HomeItemAdapter.StockViewHolder holder = (HomeItemAdapter.StockViewHolder) favoriteView.getChildViewHolder(favoriteView.getChildAt(j));
                                    if (holder.ticker.getText().toString().equals(item.getString("ticker"))) {
                                        holder.currentPrice.setText(item.getString("last"));
                                        float changeCheck = Float.parseFloat(item.getString("change"));
                                        if (changeCheck < 0) {
                                            holder.symbol.setBackgroundResource(R.drawable.ic_baseline_trending_down_24);
                                            holder.change.setTextColor(context.getColor(R.color.red));
                                            holder.change.setText(item.getString("change").substring(1));
                                        } else {
                                            holder.symbol.setBackgroundResource(R.drawable.ic_twotone_trending_up_24);
                                            holder.change.setTextColor(context.getColor(R.color.green));
                                            holder.change.setText(item.getString("change"));
                                        }
                                    }
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        error.printStackTrace();
                        System.out.println("Favorite Response Error");
                    }
                });
            }
        };
        scheduler.scheduleAtFixedRate(upDateHelper, 15, 15, SECONDS);

    }

    private void makeApiCall(String text) {
        ApiCall.make(this, text, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                //parsing logic, please change it as per your requirement
                List<String> stringList = new ArrayList<>();
                try {
                    for (int i = 0; i < response.length(); ++i) {
                        JSONObject stockSuggestion = response.getJSONObject(i);
                        String tickerSuggestion = stockSuggestion.getString("ticker");
                        String nameSuggestion = stockSuggestion.getString("name");
                        stringList.add(tickerSuggestion + " - " + nameSuggestion);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //IMPORTANT: set data here and notify
                autoSuggestAdapter.setData(stringList);
                autoSuggestAdapter.notifyDataSetChanged();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                System.out.println("AutoSuggestion Response Error");
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 2) {
            mainFlow2();
            portfolioAdapter.notifyDataSetChanged();
            favoriteAdapter.notifyDataSetChanged();
        }
    }

    private void mainFlow() {
        // Get ticker information from shared //
        SharedPreferences favoriteLib = getSharedPreferences("favorite", MODE_PRIVATE);
        SharedPreferences sharesLib = getSharedPreferences("stock", MODE_PRIVATE);
        SharedPreferences remainLib = getSharedPreferences("remain", MODE_PRIVATE);
        // Update Net Worth //
        netWorth = 0;
        netWorth = remainLib.getFloat("remain", 0);
        // Get portfolio query string //
        Map<String, ?> sharesMap = sharesLib.getAll();
        String portfolioQuery = "";
        for (Map.Entry<String, ?> item : sharesMap.entrySet()) {
            String stockTicker = item.getKey();
            portfolioQuery = portfolioQuery + stockTicker + ",";
        }
        // Get Favorite Query //
        Map<String, ?> favoriteMap = favoriteLib.getAll();
        String favoriteQuery = "";
        for (Map.Entry<String, ?> item : favoriteMap.entrySet()) {
            String stockTicker = item.getKey();
            favoriteQuery = favoriteQuery + stockTicker + ",";
        }
        portfolioView = findViewById(R.id.main_portfolio_recyclerview);
        favoriteView = findViewById(R.id.main_favorite_recyclerview);
        // Make Request //
        portfolioArrayList = new ArrayList<Stock>();
        favoriteArrayList = new ArrayList<Stock>();
        ApiCall.getHomeData(this, portfolioQuery, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) { // Portfolio Part
                try {
                    for (int i = 0; i < response.length(); ++i) {
                        JSONObject item = response.getJSONObject(i);
                        String sharesOwn = sharesMap.get(item.getString("ticker")).toString();
                        Stock stock = new Stock(item.getString("ticker"), sharesOwn + " shares", item.getString("last"), item.getString("change"));
                        portfolioArrayList.add(stock);
                        // Update NewWorth //
                        netWorth += Float.parseFloat(item.getString("last"))*Float.parseFloat(sharesOwn);
                    }
                    portfolioAdapter = new HomeItemAdapter(MainActivity.this, portfolioArrayList);
                    portfolioView.setAdapter(portfolioAdapter);
                    portfolioView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
                    DecimalFormat decimalFormat = new DecimalFormat(".00");
                    String newWorthStr = decimalFormat.format(netWorth);
                    changeTextView(R.id.main_networth_value, newWorthStr);
                    loadFlag += 1;
                    loadCheck(loadFlag);
                    // simple call back //
                    portfolioAdapter.notifyDataSetChanged();
                    ItemTouchHelper.Callback portfolioSimpleCallback = new ItemMoveCallback(portfolioAdapter, context, 0, portfolioArrayList, favoriteLib.edit());
                    ItemTouchHelper portfolioItemTouchHelper = new ItemTouchHelper(portfolioSimpleCallback);
                    portfolioItemTouchHelper.attachToRecyclerView(portfolioView);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                System.out.println("Home Response Error");
            }
        });
        ApiCall.getHomeData(this, favoriteQuery, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) { // Favorite Part
                try {
                    for (int i = 0; i < response.length(); ++i) {
                        JSONObject item = response.getJSONObject(i);
                        String stockName = favoriteMap.get(item.getString("ticker")).toString();
                        // If it has shares //
                        if (sharesMap.containsKey(item.getString("ticker"))) {
                            stockName = sharesMap.get(item.getString("ticker")).toString() + " shares";
                        }
                        Stock stock = new Stock(item.getString("ticker"), stockName, item.getString("last"), item.getString("change"));
                        favoriteArrayList.add(stock);
                    }
                    favoriteAdapter = new HomeItemAdapter(MainActivity.this, favoriteArrayList);
                    favoriteView.setAdapter(favoriteAdapter);
                    favoriteView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
                    loadFlag += 1;
                    loadCheck(loadFlag);
                    favoriteAdapter.notifyDataSetChanged();
                    ItemTouchHelper.Callback favoriteSimpleCallback = new ItemMoveCallback(favoriteAdapter, context, 1, favoriteArrayList, favoriteLib.edit());
                    ItemTouchHelper favoriteItemTouchHelper = new ItemTouchHelper(favoriteSimpleCallback);
                    favoriteItemTouchHelper.attachToRecyclerView(favoriteView);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                System.out.println("Favorite Response Error");
            }
        });
        // Up date //
        upDate(portfolioQuery, favoriteQuery, sharesMap, favoriteMap);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the search menu action bar.
        MenuInflater menuInflater = getMenuInflater();
        menuInflater.inflate(R.menu.menu, menu);
        // Set AutoComplete view //
        // Get Search menu //
        MenuItem searchMenu = menu.findItem(R.id.app_bar_menu_search);
        // Get SearchView Object //
        SearchView searchView = (SearchView) searchMenu.getActionView();
        final SearchView.SearchAutoComplete autoCompleteTextView = (SearchView.SearchAutoComplete)searchView.findViewById(androidx.appcompat.R.id.search_src_text);
        //Setting up the adapter for AutoSuggest
        autoSuggestAdapter = new AutoSuggestAdapter(this,
                android.R.layout.simple_dropdown_item_1line);
        autoCompleteTextView.setThreshold(3);
        autoCompleteTextView.setAdapter(autoSuggestAdapter);
        autoCompleteTextView.setOnItemClickListener(
                new AdapterView.OnItemClickListener() {
                    // When Click Item From Dropdown Menu //
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view,
                                            int position, long id) {
                        autoCompleteTextView.setText(autoSuggestAdapter.getObject(position));
                        openDetailPage(autoSuggestAdapter.getObject(position));
                    }
                });
        autoCompleteTextView.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int
                    count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before,
                                      int count) {
                handler.removeMessages(TRIGGER_AUTO_COMPLETE);
                handler.sendEmptyMessageDelayed(TRIGGER_AUTO_COMPLETE,
                        AUTO_COMPLETE_DELAY);
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
        handler = new Handler(new Handler.Callback() {
            @Override
            public boolean handleMessage(Message msg) {
                if (msg.what == TRIGGER_AUTO_COMPLETE) {
                    if (!TextUtils.isEmpty(autoCompleteTextView.getText())) {
                        makeApiCall(autoCompleteTextView.getText().toString());
                    }
                }
                return false;
            }
        });
        return true;
    }

    private void openDetailPage(String tickerName) {
        Intent intent = new Intent(this, DetailPage.class);
        intent.putExtra("tickerName", tickerName);
        startActivityForResult(intent, 2);
//        startActivity(intent);
    }

    private void changeTextView(int id, String value) {
        TextView tmp = findViewById(id);
        tmp.setText(value);
    }

    public void tiingoRedirect(View view) {
        String url = "https://www.tiingo.com/";
        Intent browsIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        this.startActivity(browsIntent);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (loadFlag >= 2) {
//            favoriteAdapter.notifyDataSetChanged();
//            portfolioAdapter.notifyDataSetChanged();
        }
    }
//    public void upDateView(){
//        favoriteArrayList.clear();
//        portfolioArrayList.clear();
//
//    }

    private void mainFlow2() {
        favoriteArrayList.clear();
        portfolioArrayList.clear();
        // Get ticker information from shared //
        SharedPreferences favoriteLib = getSharedPreferences("favorite", MODE_PRIVATE);
        SharedPreferences sharesLib = getSharedPreferences("stock", MODE_PRIVATE);
        SharedPreferences remainLib = getSharedPreferences("remain", MODE_PRIVATE);
        // Update Net Worth //
        netWorth = 0;
        netWorth = remainLib.getFloat("remain", 0);
        // Get portfolio query string //
        Map<String, ?> sharesMap = sharesLib.getAll();
        String portfolioQuery = "";
        for (Map.Entry<String, ?> item : sharesMap.entrySet()) {
            String stockTicker = item.getKey();
            portfolioQuery = portfolioQuery + stockTicker + ",";
        }
        // Get Favorite Query //
        Map<String, ?> favoriteMap = favoriteLib.getAll();
        String favoriteQuery = "";
        for (Map.Entry<String, ?> item : favoriteMap.entrySet()) {
            String stockTicker = item.getKey();
            favoriteQuery = favoriteQuery + stockTicker + ",";
        }
        portfolioView = findViewById(R.id.main_portfolio_recyclerview);
        favoriteView = findViewById(R.id.main_favorite_recyclerview);
        // Make Request //
        portfolioArrayList = new ArrayList<Stock>();
        favoriteArrayList = new ArrayList<Stock>();
        ApiCall.getHomeData(this, portfolioQuery, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) { // Portfolio Part
                try {
                    for (int i = 0; i < response.length(); ++i) {
                        JSONObject item = response.getJSONObject(i);
                        String sharesOwn = sharesMap.get(item.getString("ticker")).toString();
                        Stock stock = new Stock(item.getString("ticker"), sharesOwn + " shares", item.getString("last"), item.getString("change"));
                        portfolioArrayList.add(stock);
                        // Update NewWorth //
                        netWorth += Float.parseFloat(item.getString("last"))*Float.parseFloat(sharesOwn);
                        portfolioAdapter.notifyItemChanged(i);
                    }
                    portfolioAdapter = new HomeItemAdapter(MainActivity.this, portfolioArrayList);
                    portfolioView.setAdapter(portfolioAdapter);
                    portfolioView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
                    DecimalFormat decimalFormat = new DecimalFormat(".00");
                    String newWorthStr = decimalFormat.format(netWorth);
                    changeTextView(R.id.main_networth_value, newWorthStr);
                    loadFlag += 1;
                    loadCheck(loadFlag);
                    // simple call back //
                    portfolioAdapter.notifyDataSetChanged();
                    ItemTouchHelper.Callback portfolioSimpleCallback = new ItemMoveCallback(portfolioAdapter, context, 0, portfolioArrayList, favoriteLib.edit());
                    ItemTouchHelper portfolioItemTouchHelper = new ItemTouchHelper(portfolioSimpleCallback);
                    portfolioItemTouchHelper.attachToRecyclerView(portfolioView);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                System.out.println("Home Response Error");
            }
        });
        ApiCall.getHomeData(this, favoriteQuery, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) { // Favorite Part
                try {
                    for (int i = 0; i < response.length(); ++i) {
                        JSONObject item = response.getJSONObject(i);
                        String stockName = favoriteMap.get(item.getString("ticker")).toString();
                        // If it has shares //
                        if (sharesMap.containsKey(item.getString("ticker"))) {
                            stockName = sharesMap.get(item.getString("ticker")).toString() + " shares";
                        }
                        Stock stock = new Stock(item.getString("ticker"), stockName, item.getString("last"), item.getString("change"));
                        favoriteArrayList.add(stock);
//                        favoriteAdapter.notifyItemChanged(++i);
                    }
                    favoriteAdapter = new HomeItemAdapter(MainActivity.this, favoriteArrayList);
                    favoriteView.setAdapter(favoriteAdapter);
                    favoriteView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
                    loadFlag += 1;
                    loadCheck(loadFlag);
                    favoriteAdapter.notifyDataSetChanged();
//                    ItemMoveCallback.update
                    ItemTouchHelper.Callback favoriteSimpleCallback = new ItemMoveCallback(favoriteAdapter, context, 1, favoriteArrayList, favoriteLib.edit());
                    ItemTouchHelper favoriteItemTouchHelper = new ItemTouchHelper(favoriteSimpleCallback);
                    favoriteItemTouchHelper.attachToRecyclerView(favoriteView);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                System.out.println("Favorite Response Error");
            }
        });
        // Up date //
        upDate(portfolioQuery, favoriteQuery, sharesMap, favoriteMap);
    }

}