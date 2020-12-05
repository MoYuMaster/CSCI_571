package com.example.stocks;

import android.content.Context;
import android.content.SharedPreferences;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class SharedPreferencesTools {
    private static final String USER_SETTINGS_PREFERENCES_NAME = "UserSettings";
    private static final String ALL_ITEMS_LIST = "AllItemsList";
    private static Gson gson = new GsonBuilder().create();

    public static List<Stock> getOrderedItems(Context context) {
        String stringValue = getUserSettings(context).getString(ALL_ITEMS_LIST, "");
        Type collectionType = new TypeToken<List<Stock>>() {
        }.getType();
        List<Stock> result = gson.fromJson(stringValue, collectionType);
        return (result == null) ? new ArrayList<Stock>() : result;
    }

    public static void setOrderedItems(Context context, List<Stock> items) {
        String stringValue = gson.toJson(items);

        SharedPreferences sharedPreferences = getUserSettings(context);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(ALL_ITEMS_LIST, stringValue);
        editor.apply();
    }

    static SharedPreferences getUserSettings(Context context) {
        return context.getSharedPreferences(USER_SETTINGS_PREFERENCES_NAME, Context.MODE_PRIVATE);
    }
}
