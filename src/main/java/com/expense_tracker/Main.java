package com.expense_tracker;

import com.expense_tracker.repository.TransactionRepository;
import com.expense_tracker.repository.impl.FileBasedTransactionRepository;
import com.expense_tracker.service.TransactionService;
import com.expense_tracker.service.impl.DefaultTransactionService;
import com.expense_tracker.ui.ConsoleUI;
import com.expense_tracker.util.FileUtil;

import java.io.IOException;
import java.util.Properties;

public class Main {
    public static void main(String[] args) {
        try {
            // Load properties from config.properties file
            Properties properties = FileUtil.loadProperties("config.properties");
            String filePath = properties.getProperty("data.file.path");
            if (filePath == null || filePath.isEmpty()) {
                System.out.println("Data file path not specified in config.properties");
                return;
            }

            TransactionRepository repository = new FileBasedTransactionRepository(filePath);
            TransactionService transactionService = new DefaultTransactionService(repository);
            ConsoleUI consoleUI = new ConsoleUI(transactionService);
            consoleUI.start();

        } catch (IOException e) {
            System.out.println("Failed to load config.properties file: " + e.getMessage());
        }
    }
}
