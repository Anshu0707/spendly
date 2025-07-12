package com.expense_tracker.controller;

import java.io.File;
import java.io.FileInputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.expense_tracker.dto.TransactionDTO;
import com.expense_tracker.model.Category;
import com.expense_tracker.model.CategoryType;
import com.expense_tracker.model.Transaction;
import com.expense_tracker.model.TransactionType;
import com.expense_tracker.service.TransactionService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public void addTransaction(@RequestBody @Valid TransactionDTO transactionDTO) {
        // Convert DTO to model and call service
        Transaction transaction = mapToTransaction(transactionDTO);
        transactionService.addTransaction(transaction);
    }

    @GetMapping
    public List<TransactionDTO> getAllTransactions() {
        // Return all transactions as DTOs
        List<Transaction> transactions = transactionService.getAllTransactions();
        return transactions.stream().map(this::mapToDTO).toList();
    }

    @GetMapping("/summary/{year}/{month}")
    public String getMonthlySummary(@PathVariable int year, @PathVariable int month) {
        return transactionService.getMonthlySummary(year, month);
    }

    @GetMapping("/summary/all")
    public String getAllMonthsSummary() {
        return transactionService.getAllMonthsSummary();
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadTransactions(@RequestParam("file") MultipartFile file) {
        try {
            File tempFile = File.createTempFile("upload", ".csv");
            file.transferTo(tempFile);
            transactionService.loadTransactionsFromFile(tempFile.getAbsolutePath());
            tempFile.delete();
            return ResponseEntity.ok("Transactions loaded successfully from uploaded file.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to load transactions: " + e.getMessage());
        }
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadTransactions() {
        try {
            String tempFilePath = "transactions_download.csv";
            transactionService.saveTransactionsToFile(tempFilePath);
            File file = new File(tempFilePath);
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .contentLength(file.length())
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> clearAllTransactions() {
        transactionService.clearAllTransactions();
        return ResponseEntity.ok().build();
    }

    // Helper methods for mapping
    private Transaction mapToTransaction(TransactionDTO dto) {
        TransactionType type = TransactionType.valueOf(dto.getTransactionType().toUpperCase());
        CategoryType categoryType = CategoryType.valueOf(dto.getCategoryType().toUpperCase());
        Category category = new Category(dto.getCategory(), categoryType);
        return new Transaction(dto.getAmount(), type, category, dto.getDate());
    }

    private TransactionDTO mapToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setAmount(transaction.getAmount());
        dto.setTransactionType(transaction.getTransactionType().name());
        dto.setCategory(transaction.getCategory().toString());
        dto.setCategoryType(transaction.getCategory().getCategoryType().name());
        dto.setDate(transaction.getDate());
        return dto;
    }
}
