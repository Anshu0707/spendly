package com.expense_tracker.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;

import com.expense_tracker.model.TransactionType;
import com.expense_tracker.model.entity.Transaction;

public class FileUtil {

    private FileUtil() {
        // Prevent instantiation
    }

    public static Properties loadProperties(String filePath) throws IOException {
        Properties props = new Properties();
        ClassLoader classLoader = FileUtil.class.getClassLoader();
        try (InputStream input = classLoader.getResourceAsStream(filePath)) {
            if (input == null) {
                throw new IOException("File not found: " + filePath);
            }
            props.load(input);
        }
        return props;
    }

    public static List<String> readAllLines(String filePath) throws IOException {
        return Files.readAllLines(Path.of(filePath));
    }

    public static void writeAllLines(String filePath, List<String> lines) throws IOException {
        Path path = Path.of(filePath);
        if (path.getParent() != null && !Files.exists(path.getParent())) {
            Files.createDirectories(path.getParent());
        }
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(path.toFile()), StandardCharsets.UTF_8))) {
            // Write UTF-8 BOM for Excel compatibility
            writer.write('\uFEFF');
            for (String line : lines) {
                writer.write(line);
                writer.newLine();
            }
        }
    }

    // Assuming CSV file format: amount,transactionType,categoryType,date(yyyy-MM-dd)
    public static List<Transaction> readTransactionsFromCSV(String filePath) throws IOException {
        List<Transaction> transactions = new ArrayList<>();
        try (BufferedReader br = Files.newBufferedReader(Path.of(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                // Skip empty lines or headers if needed here
                if (line.isBlank() || line.startsWith("amount") || line.startsWith("Amount") ) continue;

                String[] parts = line.split(",");
                if (parts.length < 4) continue; // invalid line

                double amount = Double.parseDouble(parts[0].trim());
                String transactionTypeStr = parts[1].trim();
                String categoryTypeStr = parts[2].trim();
                String dateStr = parts[3].trim();

                var transactionType = com.expense_tracker.model.TransactionType.valueOf(transactionTypeStr.toUpperCase());
                var categoryType = com.expense_tracker.model.CategoryType.valueOf(categoryTypeStr.toUpperCase());
                var category = new com.expense_tracker.model.entity.Category(categoryType.name(),categoryType);
                var date = java.time.LocalDate.parse(dateStr);

                transactions.add(new Transaction(amount, transactionType, category, date));
            }
        }
        return transactions;
    }

    public static void writeTransactionsToCSV(String filePath, List<Transaction> transactions) throws IOException {
        List<String> lines = new ArrayList<>();
        lines.add("Amount,TransactionType,CategoryType,Date"); // header

        for (Transaction tx : transactions) {
            String line = String.format("%.2f,%s,%s,%s",
                    tx.getAmount(),
                    tx.getTransactionType().name(),
                    tx.getCategory().getCategoryType().name(),
                    tx.getDate().toString());
            lines.add(line);
        }

        // Add empty line for spacing
        lines.add("");
        lines.add("==== Summary for All Transactions ====");

        // Group transactions by year-month
        Map<String, List<Transaction>> grouped = new TreeMap<>(); // Sorted by date
        for (Transaction tx : transactions) {
            String key = String.format("%d-%02d", tx.getDate().getYear(), tx.getDate().getMonthValue());
            grouped.computeIfAbsent(key, k -> new ArrayList<>()).add(tx);
        }

        // Build summary for each group
        for (Map.Entry<String, List<Transaction>> entry : grouped.entrySet()) {
            String month = entry.getKey();
            List<Transaction> txList = entry.getValue();
            double income = 0.0, expense = 0.0;

            for (Transaction tx : txList) {
                if (tx.getTransactionType() == TransactionType.INCOME) {
                    income += tx.getAmount();
                } else {
                    expense += tx.getAmount();
                }
            }

            double net = income - expense;
            lines.add("Summary for " + month + ":");
            lines.add(String.format("Income: ₹%.2f", income));
            lines.add(String.format("Expense: ₹%.2f", expense));
            lines.add(String.format("Net: ₹%.2f", net));
            lines.add(""); // blank line between summaries
        }

        lines.add("===================================");

        writeAllLines(filePath, lines);
    }


}
