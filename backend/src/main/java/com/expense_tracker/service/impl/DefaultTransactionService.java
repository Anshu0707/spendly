package com.expense_tracker.service.impl;

import java.io.File;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.expense_tracker.model.TransactionType;
import com.expense_tracker.model.entity.Transaction;
import com.expense_tracker.repository.TransactionRepository;
import com.expense_tracker.service.TransactionService;
import com.expense_tracker.util.TransactionFileService;
import com.opencsv.exceptions.CsvValidationException;

@Service
public class DefaultTransactionService implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionFileService fileService;

    public DefaultTransactionService(TransactionRepository transactionRepository,
                                     TransactionFileService fileService) {
        this.transactionRepository = transactionRepository;
        this.fileService = fileService;
    }

    @Override
    public void addTransaction(Transaction transaction) {
        transactionRepository.save(transaction);
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public void deleteAll() {
        transactionRepository.deleteAll();
    }

    @Override
    public void importFromCSV(String filePath) throws IOException {
        try{
        List<Transaction> imported = fileService.loadTransactions(filePath);
        transactionRepository.saveAll(imported);
        } catch (CsvValidationException e) {
            throw new IOException("Invalid CSV format: " + e.getMessage(), e);
        }
    }

    @Override
    public void exportToCSV(String filePath) throws IOException {
        List<Transaction> all = transactionRepository.findAll();
        fileService.saveTransactions(filePath, all);
    }

    @Override
    public Map<String, Double> getMonthlySummary() {
        List<Transaction> transactions = transactionRepository.findAll();
        Map<String, Double> summary = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (Transaction tx : transactions) {
            String monthKey = tx.getDate().format(formatter);
            double amount = tx.getTransactionType() == TransactionType.INCOME
                    ? tx.getAmount() : -tx.getAmount();
            summary.put(monthKey, summary.getOrDefault(monthKey, 0.0) + amount);
        }
        return summary;
    }

    @Override
    public String getMonthlySummary(int year, int month) {
        List<Transaction> transactions = transactionRepository.findAll();
        double income = 0.0;
        double expense = 0.0;

        for (Transaction tx : transactions) {
            if (tx.getDate().getYear() == year && tx.getDate().getMonthValue() == month) {
                if (tx.getTransactionType() == TransactionType.INCOME) {
                    income += tx.getAmount();
                } else {
                    expense += tx.getAmount();
                }
            }
        }

        double net = income - expense;

        return String.format("Summary for %d-%02d:\nIncome: ₹%.2f\nExpense: ₹%.2f\nNet: ₹%.2f",
                year, month, income, expense, net);
    }

    @Override
    public String getAllMonthsSummary() {
        List<Transaction> transactions = transactionRepository.findAll();
        Map<String, Double> incomeMap = new HashMap<>();
        Map<String, Double> expenseMap = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (Transaction tx : transactions) {
            String monthKey = tx.getDate().format(formatter);
            if (tx.getTransactionType() == TransactionType.INCOME) {
                incomeMap.put(monthKey, incomeMap.getOrDefault(monthKey, 0.0) + tx.getAmount());
            } else {
                expenseMap.put(monthKey, expenseMap.getOrDefault(monthKey, 0.0) + tx.getAmount());
            }
        }

        var allMonths = new TreeSet<>(incomeMap.keySet());
        allMonths.addAll(expenseMap.keySet());

        StringBuilder summary = new StringBuilder();
        for (String month : allMonths) {
            double income = incomeMap.getOrDefault(month, 0.0);
            double expense = expenseMap.getOrDefault(month, 0.0);
            double net = income - expense;

            summary.append(String.format("Summary for %s:\nIncome: ₹%.2f\nExpense: ₹%.2f\nNet: ₹%.2f\n\n",
                    month, income, expense, net));
        }

        return summary.toString().trim();
    }

    @Override
public void loadTransactionsFromCSV(MultipartFile file) {
    try {
        File tempFile = File.createTempFile("upload", ".csv");
        file.transferTo(tempFile);
        List<Transaction> transactions = fileService.loadTransactions(tempFile.getAbsolutePath());
        transactionRepository.saveAll(transactions);
        tempFile.delete();
    } catch (Exception e) {
        throw new RuntimeException("Failed to load transactions from CSV: " + e.getMessage(), e);
    }
}

@Override
public File generateCSVFromTransactions() {
    try {
        List<Transaction> transactions = transactionRepository.findAll();
        File file = File.createTempFile("transactions", ".csv");
        fileService.saveTransactions(file.getAbsolutePath(), transactions);
        return file;
    } catch (Exception e) {
        throw new RuntimeException("Failed to generate CSV: " + e.getMessage(), e);
    }
}

@Override
public void clearAllTransactions() {
    transactionRepository.deleteAll();
}
}
