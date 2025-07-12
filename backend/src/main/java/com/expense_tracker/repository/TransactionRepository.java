package com.expense_tracker.repository;

import java.io.IOException;
import java.util.List;

import com.expense_tracker.model.Transaction;

public interface TransactionRepository {
    void addTransaction(Transaction transaction);
    List<Transaction> getAllTransactions();
    void loadFromFile(String filePath) throws IOException;
    void saveToFile(String filePath) throws IOException;
    void clearAllTransactions();
}
