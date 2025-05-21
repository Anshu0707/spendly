package com.expense_tracker.repository.impl;

import com.expense_tracker.model.*;
import com.expense_tracker.repository.TransactionRepository;
import com.expense_tracker.util.FileUtil;

import java.util.*;
import java.io.IOException;

public class FileBasedTransactionRepository implements TransactionRepository {

    private final List<Transaction> transactions = new ArrayList<>();
    private String filePath;

    public FileBasedTransactionRepository(String filePath) {
        this.filePath = filePath;
    }

    @Override
    public void addTransaction(Transaction transaction) {
        transactions.add(transaction);
    }

    @Override
    public List<Transaction> getAllTransactions() {
        // By sending new copy i am making sure that the original transactions list inside the repository is not modified by any external classes.
        return new ArrayList<>(transactions);
    }

    @Override
    public void loadFromFile(String filePath) throws IOException {
        List<Transaction> loadedTransactions = FileUtil.readTransactionsFromCSV(filePath);
        transactions.addAll(loadedTransactions);
    }

    @Override
    public void saveToFile(String filePath) throws IOException {
        FileUtil.writeTransactionsToCSV(filePath, transactions);
    }
}
