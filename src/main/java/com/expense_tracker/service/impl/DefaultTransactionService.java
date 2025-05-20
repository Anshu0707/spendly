package com.expense_tracker.service.impl;

import com.expense_tracker.model.Transaction;
import com.expense_tracker.model.TransactionType;
import com.expense_tracker.repository.TransactionRepository;
import com.expense_tracker.service.TransactionService;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DefaultTransactionService implements TransactionService {

    private final TransactionRepository transactionRepository;

    public DefaultTransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public void addTransaction(Transaction transaction) {
        transactionRepository.addTransaction(transaction);
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.getAllTransactions();
    }

    @Override
    public Map<String, Double> getMonthlySummary() {
        List<Transaction> transactions = transactionRepository.getAllTransactions();
        Map<String, Double> summary = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (Transaction tx : transactions) {
            String monthKey = tx.getDate().format(formatter);
            double amount = tx.getTransactionType() == TransactionType.INCOME
                    ? tx.getAmount()
                    : -tx.getAmount();

            summary.put(monthKey, summary.getOrDefault(monthKey, 0.0) + amount);
        }

        return summary;
    }

    @Override
    public String getMonthlySummary(int year, int month) {
        List<Transaction> transactions = transactionRepository.getAllTransactions();
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

        return String.format(
                "Summary for %d-%02d:\nIncome: ₹%.2f\nExpense: ₹%.2f\nNet: ₹%.2f",
                year, month, income, expense, net
        );
    }

    @Override
    public String getAllMonthsSummary() {
        List<Transaction> transactions = transactionRepository.getAllTransactions();
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

        // Merge both into a sorted monthly summary
        StringBuilder summary = new StringBuilder();
        var allMonths = new java.util.TreeSet<>(incomeMap.keySet());
        allMonths.addAll(expenseMap.keySet()); // ensure all months are included

        for (String month : allMonths) {
            double income = incomeMap.getOrDefault(month, 0.0);
            double expense = expenseMap.getOrDefault(month, 0.0);
            double net = income - expense;

            summary.append(String.format(
                    "Summary for %s:\nIncome: ₹%.2f\nExpense: ₹%.2f\nNet: ₹%.2f\n\n",
                    month, income, expense, net));
        }

        return summary.toString().trim(); // trim to remove final newline
    }




    @Override
    public void loadTransactionsFromFile(String filePath) throws IOException {
        transactionRepository.loadFromFile(filePath);
    }

    @Override
    public void saveTransactionsToFile(String filePath) throws IOException {
        transactionRepository.saveToFile(filePath);
    }
}
