package com.expense_tracker.controller;

import java.io.File;
import java.io.FileInputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.server.ResponseStatusException;

import com.expense_tracker.dto.TransactionDTO;
import com.expense_tracker.model.CategoryType;
import com.expense_tracker.model.TransactionType;
import com.expense_tracker.model.entity.Category;
import com.expense_tracker.model.entity.Transaction;
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
        Transaction transaction = mapToTransaction(transactionDTO);
        transactionService.addTransaction(transaction);
    }

    @GetMapping
    public List<TransactionDTO> getAllTransactions() {
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
        transactionService.loadTransactionsFromCSV(file);
        return ResponseEntity.ok("Transactions uploaded successfully.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Failed to upload transactions: " + e.getMessage());
    }
}


@GetMapping("/download")
public ResponseEntity<Resource> downloadTransactions() {
    try {
        File file = transactionService.generateCSVFromTransactions();
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(file.length())
                .body(resource);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}


    @DeleteMapping
    public ResponseEntity<Void> clearAllTransactions() {
        transactionService.clearAllTransactions();
        return ResponseEntity.ok().build();
    }

    // ----------------------------- Mapping Helpers -----------------------------

    private Transaction mapToTransaction(TransactionDTO dto) {
        try {
            CategoryType categoryType = CategoryType.valueOf(dto.getCategoryType().toUpperCase());
            TransactionType type = categoryType.getTransactionType(); // derived safely
    
            Category category = new Category(dto.getCategory(), categoryType);
            return new Transaction(dto.getAmount(), type, category, dto.getDate());
    
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid categoryType: " + dto.getCategoryType());
        }
    }
    

    private TransactionDTO mapToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setAmount(transaction.getAmount());
        dto.setCategory(transaction.getCategory().toString());
        dto.setCategoryType(transaction.getCategory().getCategoryType().name());
        dto.setTransactionType(transaction.getTransactionType().name());
        dto.setDate(transaction.getDate());
        return dto;
    }
}
