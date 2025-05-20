package com.expense_tracker.ui;

import com.expense_tracker.model.Transaction;
import com.expense_tracker.model.TransactionType;
import com.expense_tracker.service.TransactionService;

import java.time.LocalDate;
import java.util.Map;

public class ConsoleUI {

    private final ConsoleIO io = new ConsoleIO();
    private final MenuRenderer menuRenderer = new MenuRenderer(io);
    private final InputHandler inputHandler = new InputHandler(io);
    private final TransactionService transactionService;

    public ConsoleUI(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    public void start() {
        boolean running = true;

        while (running) {
            menuRenderer.printMainMenu();
            int choice = io.readInt();

            switch (choice) {
                case 1 -> addTransactionFlow();
                case 2 -> showMonthlySummaryFlow();
                case 3 -> showAllMonthlySummaryFlow();
                case 4 -> loadFromFileFlow();
                case 5 -> saveToFileFlow();
                case 6 -> {
                    running = false;
                    menuRenderer.printExitMessage();
                }
                default -> io.println("Invalid choice. Please try again.");
            }
        }
    }

    private void addTransactionFlow() {
        menuRenderer.printTransactionTypeMenu();
        TransactionType type = inputHandler.getTransactionTypeFromUser();

        double amount = inputHandler.getAmount();
        String description = inputHandler.getDescription();
        LocalDate date = inputHandler.getDate();
        var category = inputHandler.getCategory(type);

        Transaction transaction = new Transaction(amount, type, category, date);
        transactionService.addTransaction(transaction);

        io.println("Transaction added successfully!");
    }

    private void showMonthlySummaryFlow() {
        io.print("Enter year (e.g., 2025): ");
        int year = io.readInt();
        io.print("Enter month (1-12): ");
        int month = io.readInt();

        String summary = transactionService.getMonthlySummary(year, month);
        io.println("\n" + summary);
    }

    private void showAllMonthlySummaryFlow() {
        String summary = transactionService.getAllMonthsSummary();
        io.println("\n=== Summary for All Transactions ===");
        io.println(summary);
        io.println("====================================");
    }


    private void loadFromFileFlow() {
        String path = inputHandler.getFilePath("load");
        try {
            transactionService.loadTransactionsFromFile(path);
            io.println("Transactions loaded successfully from file.");
        } catch (Exception e) {
            io.println("Failed to load transactions: " + e.getMessage());
        }
    }

    private void saveToFileFlow() {
        String path = inputHandler.getFilePath("save");
        try {
            transactionService.saveTransactionsToFile(path);
            io.println("Transactions saved successfully to file.");
        } catch (Exception e) {
            io.println("Failed to save transactions: " + e.getMessage());
        }
    }
}
