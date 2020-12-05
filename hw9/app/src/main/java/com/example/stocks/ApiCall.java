package com.example.stocks;

import android.content.Context;
import android.os.Debug;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.Console;

public class ApiCall {
    private static ApiCall mInstance;
    private RequestQueue mRequestQueue;
    private static Context mCtx;
    private final static String URL = "http://hw9backend-env.eba-3k4eppxs.us-east-1.elasticbeanstalk.com";

    public ApiCall(Context ctx) {
        mCtx = ctx;
        mRequestQueue = getRequestQueue();
    }

    public static synchronized ApiCall getInstance(Context context) {
        if (mInstance == null) {
            mInstance = new ApiCall(context);
        }
        return mInstance;
    }

    public RequestQueue getRequestQueue() {
        if (mRequestQueue == null) {
            mRequestQueue = Volley.newRequestQueue(mCtx.getApplicationContext());
        }
        return mRequestQueue;
    }

    public <T> void addToRequestQueue(Request<T> req) {
        getRequestQueue().add(req);
    }

    public static void make(Context ctx, String query, Response.Listener<JSONArray>
            listener, Response.ErrorListener errorListener) {
        String url = URL + "/getAutoData?search=" + query;
        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url, null,
                listener, errorListener);
        ApiCall.getInstance(ctx).addToRequestQueue(jsonArrayRequest);
        System.out.println("Api Call getAutoData");
    }

    public static void getDetailData(Context ctx, String query, Response.Listener<JSONObject>
            listener, Response.ErrorListener errorListener) {
        String url = URL + "/getDetailData?search=" + query;
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                listener, errorListener);
        ApiCall.getInstance(ctx).addToRequestQueue(jsonObjectRequest);
        System.out.println("Api Call getDetailData");
    }

    // Get News data //
    public static void getNewsData(Context ctx, String query, Response.Listener<JSONArray> listener, Response.ErrorListener errorListener) {
        String url = URL + "/getNewsTabData?search=" + query;
        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url, null, listener, errorListener);
        ApiCall.getInstance(ctx).addToRequestQueue(jsonArrayRequest);
        System.out.println("Api Call getNewsData");
    }

    // Get Stats data //
    public static void getStatsData(Context ctx, String query, Response.Listener<JSONObject> listener, Response.ErrorListener errorListener) {
        String url = URL + "/getSummaryTabData?search=" + query;
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                listener, errorListener);
        ApiCall.getInstance(ctx).addToRequestQueue(jsonObjectRequest);
        System.out.println("Api Call getStatsData");
    }

    // Get Home data //
    public static void getHomeData(Context ctx, String query, Response.Listener<JSONArray> listener, Response.ErrorListener errorListener) {
        String url = URL + "/getPortfolioData?search=" + query;
        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url, null, listener, errorListener);
        ApiCall.getInstance(ctx).addToRequestQueue(jsonArrayRequest);
        System.out.println("Api Call getHomeData");
    }
}