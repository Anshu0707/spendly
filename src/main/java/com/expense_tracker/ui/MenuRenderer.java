package com.expense_tracker.ui;

public class MenuRenderer {

    private final ConsoleIO io;

    public MenuRenderer(ConsoleIO io) {
        this.io = io;
    }

    public void printMainMenu() {
        io.println("\n--- Expense Tracker Menu ---");
        io.println("1. Add Transaction");
        io.println("2. View Monthly Summary");
        io.println("3. View All Summary");
        io.println("4. Load from File");
        io.println("5. Save to File");
        io.println("6. Exit");
        io.print("Enter your choice: ");
    }

    public void printTransactionTypeMenu() {
        io.println("\nChoose Transaction Type:");
        io.println("1. Income");
        io.println("2. Expense");
        io.print("Enter your choice: ");
    }

    public void printExitMessage() {
        io.println("Exiting application. Goodbye!");
    }
}
