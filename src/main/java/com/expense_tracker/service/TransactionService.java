package com.expense_tracker.service;

import com.expense_tracker.model.Transaction;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.io.IOException;

public interface TransactionService {
    void addTransaction(Transaction transaction);
    List<Transaction> getAllTransactions();
    Map<String, Double> getMonthlySummary(); // key = "YYYY-MM", value = net amount for all month summary
    String getMonthlySummary(int year, int month); // specific month summary
    String getAllMonthsSummary(); // All month summary
    void loadTransactionsFromFile(String filePath) throws IOException;
    void saveTransactionsToFile(String filePath) throws IOException;
}
