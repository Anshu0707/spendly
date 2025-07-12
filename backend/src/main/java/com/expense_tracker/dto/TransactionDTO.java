package com.expense_tracker.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TransactionDTO {
    @Min(value = 0, message = "Amount must be positive")
    private double amount;

    @NotBlank(message = "Transaction type is required")
    private String transactionType; // "INCOME" or "EXPENSE"

    @NotBlank(message = "Category is required")
    private String category;

    private String categoryType; // Optional, if you want to expose it

    @NotNull(message = "Date is required")
    private LocalDate date;

    public double getAmount() {
        return amount;
    }
    public void setAmount(double amount) {
        this.amount = amount;
    }
    public String getTransactionType() {
        return transactionType;
    }
    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public String getCategoryType() {
        return categoryType;
    }
    public void setCategoryType(String categoryType) {
        this.categoryType = categoryType;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
}
