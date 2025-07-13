package com.expense_tracker.util;

import com.opencsv.bean.CsvBindByName;

public class TransactionCsvRecord {

    @CsvBindByName
    private double amount;

    @CsvBindByName
    private String transactionType;

    @CsvBindByName
    private String category;

    @CsvBindByName
    private String categoryType;

    @CsvBindByName
    private String date; // use String for parsing

    // Getters and setters
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryType() { return categoryType; }
    public void setCategoryType(String categoryType) { this.categoryType = categoryType; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
