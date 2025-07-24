package com.expense_tracker.model.entity;

import java.time.LocalDate;

import com.expense_tracker.model.TransactionType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
@JoinColumn(name = "category_id", nullable = false)
private Category category;


    @Column(nullable = false)
    private LocalDate date;

    protected Transaction() {} 

    public Transaction(double amount, TransactionType transactionType, Category category, LocalDate date) {
        this.amount = amount;
        this.transactionType = transactionType;
        this.category = category;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public double getAmount() {
        return amount;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public Category getCategory() {
        return category;
    }

    public LocalDate getDate() {
        return date;
    }

    @Override
    public String toString() {
        return String.format(
            "Transaction{id=%d, amount=%.2f, type=%s, category=%s, date=%s}",
            id, amount, transactionType, category, date
        );
    }
}
