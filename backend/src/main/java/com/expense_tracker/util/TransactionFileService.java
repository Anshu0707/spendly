package com.expense_tracker.util;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.expense_tracker.model.CategoryType;
import com.expense_tracker.model.TransactionType;
import com.expense_tracker.model.entity.Category;
import com.expense_tracker.model.entity.Transaction;
import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import com.opencsv.exceptions.CsvValidationException;

@Service
public class TransactionFileService {

    public List<Transaction> loadTransactions(String filePath) throws IOException, CsvValidationException  {
        List<Transaction> transactions = new ArrayList<>();

        try (CSVReader reader = new CSVReader(new FileReader(filePath))) {
            String[] line;
            reader.readNext(); // skip header
            while ((line = reader.readNext()) != null) {
                // double amount = Double.parseDouble(line[0]);
                // TransactionType type = TransactionType.valueOf(line[1]);
                // String categoryName = line[2];
                // CategoryType categoryType = CategoryType.valueOf(line[3]);
                // LocalDate date = LocalDate.parse(line[4]);

                // Category category = new Category(categoryName, categoryType);
                // Transaction tx = new Transaction(amount, type, category, date);
                double amount = Double.parseDouble(line[0]);
CategoryType categoryType = CategoryType.valueOf(line[1]);
TransactionType type = categoryType.getTransactionType();
LocalDate date = LocalDate.parse(line[2]);

Category category = new Category(categoryType.name(), categoryType);
Transaction tx = new Transaction(amount, type, category, date);
                transactions.add(tx);
            }
        }

        return transactions;
    }

    public void saveTransactions(String filePath, List<Transaction> transactions) throws IOException {
        try (CSVWriter writer = new CSVWriter(new FileWriter(filePath))) {
            // writer.writeNext(new String[]{"amount", "transactionType", "category", "categoryType", "date"});

            // for (Transaction tx : transactions) {
            //     writer.writeNext(new String[]{
            //             String.valueOf(tx.getAmount()),
            //             tx.getTransactionType().name(),
            //             tx.getCategory().toString(),
            //             tx.getCategory().getCategoryType().name(),
            //             tx.getDate().toString()
            //     });
            // }
            writer.writeNext(new String[]{"amount", "categoryType", "date"});
for (Transaction tx : transactions) {
    writer.writeNext(new String[]{
        String.valueOf(tx.getAmount()),
        tx.getCategory().getCategoryType().name(),
        tx.getDate().toString()
    });
}
        }
    }
}
