package com.expense_tracker.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.expense_tracker.model.entity.Transaction;

public interface TransactionService {
    void addTransaction(Transaction transaction);
    List<Transaction> getAllTransactions();
    Page<Transaction> getTransactionsPage(Pageable pageable);
    Map<String, Double> getMonthlySummary();
    String getMonthlySummary(int year, int month);
    String getAllMonthsSummary();
    void importFromCSV(String filePath) throws IOException;
    void exportToCSV(String filePath) throws IOException;
    void deleteAll(); // optional - only if needed
    void loadTransactionsFromCSV(MultipartFile file);
    File generateCSVFromTransactions();
    void clearAllTransactions();
}
