package com.example.stocks;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.DecimalFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DetailPage extends AppCompatActivity {
    private Toolbar toolbar;
    private ArrayList<News> newslist;
    private RecyclerView newsReyclerView;
    private boolean unfolded;
    private static final String ZEROSHARES = "You have 0 shares of ";
    private static final String ZEROSHARES2 = ".\nStart trading!";
    private float currentPrice;
    private String name;
    private float inputNum;
    private float tradeCost;
    private int loadFlag;
    private Menu detailMenu;
    private String ticker;
    private String backStr;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.Theme_Stocks);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail_page);
        loadFlag = 0;
        // Set Toolbar //
        toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        // Get ticker symbol //
        Intent intent = getIntent();
        String tickerName = intent.getStringExtra("tickerName");
        backStr = tickerName;
        String keyword = tickerName.split(" ")[0];
        ticker = keyword;
        // Check favorite //
//        SharedPreferences favoriteLib = getSharedPreferences("favorite", MODE_PRIVATE);
//        String favoriteCheck = favoriteLib.getString(keyword, "");
//        if (!favoriteCheck.equals("")) {
//            detailMenu.getItem(0).setIcon(ContextCompat.getDrawable(this, R.drawable.ic_baseline_star_24));
//        } else {
//            detailMenu.getItem(0).setIcon(ContextCompat.getDrawable(this, R.drawable.ic_baseline_star_border_24));
//        }
        // Get detail Data //
        detailGetData(keyword);
        // Test , add 20000 //
//        SharedPreferences sharedPreferences = getSharedPreferences("remain", MODE_PRIVATE);
//        SharedPreferences.Editor editor = sharedPreferences.edit();
//        editor.putFloat("remain", 13600);
//        editor.apply();
//        System.out.println("jiale:" + sharedPreferences.getFloat("remain", 0));
//        findViewById(R.id.DetailAll).setVisibility(View.VISIBLE);
    }

    @Override
    public boolean onPrepareOptionsMenu(Menu menu) {
        SharedPreferences favoriteLib = getSharedPreferences("favorite", MODE_PRIVATE);
        String favoriteCheck = favoriteLib.getString(ticker, "");
        if (!favoriteCheck.equals("")) {
            menu.getItem(0).setIcon(ContextCompat.getDrawable(this, R.drawable.ic_baseline_star_24));
        } else {
            menu.getItem(0).setIcon(ContextCompat.getDrawable(this, R.drawable.ic_baseline_star_border_24));
        }
        return super.onPrepareOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.app_bar_menu_favorite) {
            SharedPreferences favoriteLib = getSharedPreferences("favorite", MODE_PRIVATE);
            SharedPreferences.Editor editor = favoriteLib.edit();
            String favoriteCheck = favoriteLib.getString(ticker, "");
            if (!favoriteCheck.equals("")) {
                item.setIcon(ContextCompat.getDrawable(this, R.drawable.ic_baseline_star_border_24));
                String hint = "\"" + ticker + "\" was removed from favorites";
                Toast.makeText(this, hint, Toast.LENGTH_SHORT).show();
                editor.remove(ticker);
                editor.apply();
            } else {
                item.setIcon(ContextCompat.getDrawable(this, R.drawable.ic_baseline_star_24));
                String hint = "\"" + ticker + "\" was added to favorites";
                Toast.makeText(this, hint, Toast.LENGTH_SHORT).show();
                editor.putString(ticker, name);
                editor.apply();
            }
        }
        return super.onOptionsItemSelected(item);
    }

    // Show Detail page menu, which include favorite icon //
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater menuInflater = getMenuInflater();
        menuInflater.inflate(R.menu.detail_menu, menu);
        detailMenu = menu;
        return true;
    }

    private void changeTextView(int id, String value) {
        TextView tmp = findViewById(id);
        tmp.setText(value);
    }

    private void changeTextView(int id, String value, Dialog dialog) {
        TextView tmp = dialog.findViewById(id);
        tmp.setText(value);
    }

    // Get Data//
    private void detailGetData(String keyword) {
        // Get Basic Info by getDetailData api //
        ApiCall.getDetailData(this, keyword, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    loadFlag += 1;
                    // Load Basic Information //
                    changeTextView(R.id.ticker, response.getString("ticker"));
                    changeTextView(R.id.name, response.getString("name"));
                    changeTextView(R.id.current_price, "$" + response.getString("lastPrice"));
                    currentPrice = Float.parseFloat(response.getString("lastPrice"));
                    name = response.getString("name");
                    // Change change color //
                    String changeStr = response.getString("change");
                    TextView changeView = findViewById(R.id.change_price);
                    float changeSymbol = Float.parseFloat(changeStr);
                    if (changeSymbol > 0) {
                        changeStr = "+$" + changeStr;
                        changeView.setTextColor(getColor(R.color.green));
                    } else {
                        changeStr = "-$" + changeStr.substring(1);
                        changeView.setTextColor(getColor(R.color.red));
                    }
                    changeView.setText(changeStr);
                    // Update Portfolio based on current price //
                    SharedPreferences sharesLib = getSharedPreferences("stock", MODE_PRIVATE);
                    float sharesNum = sharesLib.getFloat(keyword, 0);
                    String finalStr = "";
                    if (sharesNum <= 0) {
                        finalStr = ZEROSHARES + keyword + ZEROSHARES2;
                    } else {
                        String value = new DecimalFormat("##.##").format(sharesNum * currentPrice);
                        finalStr = "Shares owned: " + sharesNum + "\n" + "Markert Value: $" + value;
                    }
                    changeTextView(R.id.portfolio_shares, finalStr);
                    // Stats Current price same with last Price //
                    changeTextView(R.id.stats_current_price, "Current Price: " + response.getString("lastPrice"));
                    loadCheck(loadFlag);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                System.out.println("Detail Response Error");
            }
        });

        // Get news data by /getNewsTabData api //
        ApiCall.getNewsData(this, keyword, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                try {
                    loadFlag += 1;
                    newslist = new ArrayList<News>();
                    for (int i = 0; i < response.length(); ++i) {
                        JSONObject jsonObject = response.getJSONObject(i);
                        News tmpNews = new News(jsonObject.getString("img"), jsonObject.getString("title"), jsonObject.getString("publisher"), jsonObject.getString("date"), jsonObject.getString("url"));
                        newslist.add(tmpNews);
                    }
                    newsReyclerView = findViewById(R.id.newsRecyclerView);
                    NewsAdapter newsAdapter = new NewsAdapter(DetailPage.this,  newslist, getSupportFragmentManager());
                    newsReyclerView.setAdapter(newsAdapter);
                    newsReyclerView.setLayoutManager(new LinearLayoutManager(DetailPage.this));
                    loadCheck(loadFlag);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                System.out.println("News Response Error");
            }
        });
        // Load High Chart //
        loadChart(keyword);

        // Portfolio Part //
        portFolio(keyword, this);
        // Get Stats data by /getStatsData //
        ApiCall.getStatsData(this, keyword, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    loadFlag += 1;
                    // Load Portfolio Data //
                    String volume = new DecimalFormat("#,###.00").format(Float.parseFloat(response.getString("volume")));
                    changeTextView(R.id.stats_low_price, "Low: " + response.getString("low"));
                    changeTextView(R.id.stats_open_price, "OpenPrice: " + response.getString("open"));
                    changeTextView(R.id.stats_high_price, "High: " + response.getString("high"));
                    changeTextView(R.id.stats_volume, "Volume: " + volume);
                    // If market is not open, no bid and mid value //
                    if (response.getString("marketStatus").equals("0")) {
                        changeTextView(R.id.stats_bid_price, "Bid Price: 0.0");
                        changeTextView(R.id.stats_mid_price, "Mid: 0.0");
                    } else {
                        changeTextView(R.id.stats_bid_price, "Bid Price: " + response.getString("bidPrice"));
                        changeTextView(R.id.stats_mid_price, "Mid: " + response.getString("mid"));
                    }
                    // Load About //
                    changeTextView(R.id.about_description, response.getString("description"));
                    unfolded = false;
                    loadCheck(loadFlag);
                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.println("Get stats Data error.");
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
                System.out.println("Stats Response Error");
            }
        });
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void loadChart(String keyword) {
        WebView webView = findViewById(R.id.web_view);
        webView.setWebViewClient(new WebViewClient());
        WebSettings webSettings = webView.getSettings();
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setSupportZoom(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        webView.loadUrl("file:///android_asset/chart.html?ticker=" + keyword);
    }

    public void clickShow(View view) {
        TextView show = findViewById(R.id.about_btn);
        TextView description = findViewById(R.id.about_description);
        if (!unfolded) {
            description.setMaxLines(Integer.MAX_VALUE);
            description.setEllipsize(null);
            show.setText("Show less");
            unfolded = true;
        } else {
            description.setMaxLines(2);
            description.setEllipsize(TextUtils.TruncateAt.END);
            show.setText("Show more...");
            unfolded = false;
        }
    }

    private void portFolio(String keyword, Context context) {
        SharedPreferences sharesLib = getSharedPreferences("stock", MODE_PRIVATE);
        SharedPreferences remainLib = getSharedPreferences("remain", MODE_PRIVATE);
        SharedPreferences.Editor sharesEdit = sharesLib.edit();
        SharedPreferences.Editor remainEdit = remainLib.edit();
        // Trade Button //
        Button tradeBtn = findViewById(R.id.portfolio_trade_btn);
        tradeBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Initial dialog //
                Dialog dialog = new Dialog(context);
                dialog.setContentView(R.layout.trade_dialog);
                // Initial text view //
                float remain = remainLib.getFloat("remain", 0);
                String trade_title = "Trade " + name + " shares";
                String trade_caculate_initial = "0 x $" + currentPrice + "/share = $0.00";
                String trade_remain_initial = Float.toString(remain) + " available to buy " + keyword;
                changeTextView(R.id.trade_title, trade_title, dialog);
                changeTextView(R.id.trade_caculate, trade_caculate_initial, dialog);
                changeTextView(R.id.trade_remain, trade_remain_initial, dialog);
                dialog.show();
                // If edit text changed //
                EditText editText = dialog.findViewById(R.id.trade_nums);
                editText.addTextChangedListener(new TextWatcher() {
                    @Override
                    public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                    }
                    @Override
                    public void onTextChanged(CharSequence s, int start, int before, int count) {
                        String input = editText.getText().toString();
                        String str = "";
                        Matcher matcher = Pattern.compile("[-+]?[0-9]*\\.?[0-9]*").matcher(input);
                        if (input.equals("-") || (input.equals(""))) {
                            inputNum = 0;
                            str = trade_caculate_initial;
                            changeTextView(R.id.trade_caculate, str, dialog);
                        } else if (matcher.matches()) {
                            inputNum = Float.parseFloat(input);
                            String cost = new DecimalFormat("##.##").format(inputNum * currentPrice);
                            tradeCost = Float.parseFloat(cost);
                            str = inputNum + " x $" + currentPrice + "/share = $" + cost;
                            changeTextView(R.id.trade_caculate, str, dialog);
                        } else { // Invalid amount
                            Toast.makeText(context, "Please enter valid amount", Toast.LENGTH_SHORT).show();
                        }
                    }
                    @Override
                    public void afterTextChanged(Editable s) {
                    }
                });
                // Buy button for trade dialog //
                Button buyBtn = dialog.findViewById(R.id.trade_buy_btn);
                buyBtn.setOnClickListener(new View.OnClickListener(){
                    @Override
                    public void onClick(View v) {
                        if (inputNum <= 0) {
                            Toast.makeText(context, "Cannot buy less than 0 shares", Toast.LENGTH_SHORT).show();
                            return;
                        }
                        float remainMoney = remainLib.getFloat("remain", 0);
                        if (tradeCost > remainMoney) {
                            Toast.makeText(context, "Not enough money to buy", Toast.LENGTH_SHORT).show();
                            return;
                        }
                        float updateRemain = remainMoney - tradeCost;
                        remainEdit.putFloat("remain", updateRemain);
                        remainEdit.apply();
                        float updateShares = sharesLib.getFloat(keyword, 0);
                        updateShares += inputNum;
                        sharesEdit.putFloat(keyword, updateShares);
                        sharesEdit.apply();
                        String currentSum = new DecimalFormat("##.##").format(updateShares * currentPrice);
                        // Update portfolio //
                        String str = "";
                        if (updateShares <= 0) {
                            str = ZEROSHARES + keyword + ZEROSHARES2;
                        } else {
                            str = "Shares owned: " + Float.toString(updateShares) + "\n" + "Market Value: $" + currentSum;
                        }
                        changeTextView(R.id.portfolio_shares, str);
                        dialog.dismiss();
                        // Congrats //
                        Dialog congrats = new Dialog(context);
                        congrats.setContentView(R.layout.trade_congras);
                        TextView congratsPop = congrats.findViewById(R.id.congras_shares);
                        String hint = "You have successfully bought " + inputNum + "\nshares of " + keyword;
                        congratsPop.setText(hint);
                        congrats.show();
                        Button doneBtn = congrats.findViewById(R.id.congras_done_btn);
                        doneBtn.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                congrats.dismiss();
                                inputNum = 0;
                            }
                        });
                    }
                });
                // Sell button for trade dialog //
                Button sellBtn = dialog.findViewById(R.id.trade_sell_btn);
                sellBtn.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if (inputNum <= 0) {
                            Toast.makeText(context, "Cannot sell less than 0 shares", Toast.LENGTH_SHORT).show();
                            return;
                        }
                        float updateShares = sharesLib.getFloat(keyword, 0);
                        if (inputNum > updateShares) {
                            Toast.makeText(context, "Not enough shares to sell", Toast.LENGTH_SHORT).show();
                            return;
                        }
                        float updateRemain = remainLib.getFloat("remain", 0) + tradeCost;
                        remainEdit.putFloat("remain", updateRemain);
                        remainEdit.apply();
                        updateShares -= inputNum;
                        sharesEdit.putFloat(keyword, updateShares);
                        sharesEdit.apply();
                        String currentSum = new DecimalFormat("##.##").format(updateShares * currentPrice);
                        // Update portfolio //
                        String str = "";
                        if (updateShares <= 0) {
                            str = ZEROSHARES + keyword + ZEROSHARES2;
                            sharesEdit.remove(keyword);
                            sharesEdit.apply();
                        } else {
                            str = "Shares owned: " + Float.toString(updateShares) + "\n" + "Market Value: $" + currentSum;
                        }
                        changeTextView(R.id.portfolio_shares, str);
                        dialog.dismiss();
                        // Congrats //
                        Dialog congrats = new Dialog(context);
                        congrats.setContentView(R.layout.trade_congras);
                        TextView congratsPop = congrats.findViewById(R.id.congras_shares);
                        String hint = "You have successfully sold " + inputNum + "\nshares of " + keyword;
                        congratsPop.setText(hint);
                        congrats.show();
                        Button doneBtn = congrats.findViewById(R.id.congras_done_btn);
                        doneBtn.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                congrats.dismiss();
                                inputNum = 0;
                            }
                        });
                    }
                });
            }
        });
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        Intent intent = new Intent();
        setResult(2,intent);
        return true;
    }

    private void loadCheck(int value) {
        if (value == 3) {
            findViewById(R.id.stats).setVisibility(View.VISIBLE);
            findViewById(R.id.detailTitle).setVisibility(View.VISIBLE);
            findViewById(R.id.high_chart).setVisibility(View.VISIBLE);
            findViewById(R.id.portfolio).setVisibility(View.VISIBLE);
            findViewById(R.id.about).setVisibility(View.VISIBLE);
            findViewById(R.id.news).setVisibility(View.VISIBLE);
            findViewById(R.id.news).setVisibility(View.VISIBLE);
            findViewById(R.id.news).setVisibility(View.VISIBLE);
            findViewById(R.id.progressBar1).setVisibility(View.INVISIBLE);
            findViewById(R.id.fetch_data).setVisibility(View.INVISIBLE);
        }
    }
}