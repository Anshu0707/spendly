package com.expense_tracker.ui;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.expense_tracker.model.Category;
import com.expense_tracker.model.CategoryType;
import com.expense_tracker.model.TransactionType;
import com.expense_tracker.util.DateUtil;

public class InputHandler {

    private final ConsoleIO io;

    public InputHandler(ConsoleIO io) {
        this.io = io;
    }

    public TransactionType getTransactionTypeFromUser() {
        io.print("Enter transaction type (1. Income, 2. Expense): ");
        int choice = io.readInt();
        return (choice == 1) ? TransactionType.INCOME : TransactionType.EXPENSE;
    }

    public double getAmount() {
        io.print("Enter amount: ");
        return io.readDouble();
    }

    public String getDescription() {
        io.print("Enter description: ");
        return io.readLine();
    }

    public LocalDate getDate() {
        while (true) {
        io.print("Enter date (yyyy-MM-dd): ");
        String dateStr = io.readLine();
            try {
        return DateUtil.parseDate(dateStr);
            } catch (IllegalArgumentException e) {
                io.println(e.getMessage() + " Please try again.");
            }
        }
    }

    public Category getCategory(TransactionType type) {
        List<CategoryType> matchingCategories = new ArrayList<>();
        int index = 1;

        io.println("Choose a category:");
        for (CategoryType category : CategoryType.values()) {
            if (category.getTransactionType() == type) {
                matchingCategories.add(category);
                io.println(index + ". " + formatName(category.name()));
                index++;
            }
        }

        io.print("Enter your choice: ");
        int choice = io.readInt();

        if (choice < 1 || choice > matchingCategories.size()) {
            io.println("Invalid choice. Defaulting to OTHER.");
            return new Category("Other", CategoryType.OTHER);
        }

        CategoryType selected = matchingCategories.get(choice - 1);
        return new Category(formatName(selected.name()), selected);
    }

    public String getFilePath(String action) {
        io.print("Enter file path to " + action + ": ");
        return io.readLine();
    }

    private String formatName(String enumName) {
        return enumName.charAt(0) + enumName.substring(1).toLowerCase();
    }
}
