package com.expense_tracker.model;

import java.time.LocalDate;

public class Transaction {
    private double amount;
    private TransactionType transactionType;
    private Category category;
    private LocalDate date;

    public Transaction(double amount, TransactionType transactionType, Category category, LocalDate date) {
        this.amount = amount;
        this.transactionType = transactionType;
        this.category = category;
        this.date = date;
    }

    public double getAmount() {
        return amount;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public Category getCategory() {
        return category;
    }

    public LocalDate getDate() {
        return date;
    }

    @Override
    public String toString() {
        return String.format("Transaction{amount=%.2f, type=%s, category=%s, date=%s}",
                amount, transactionType, category, date);
    }
}
