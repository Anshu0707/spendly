package com.expense_tracker.model;

public enum CategoryType {
    SALARY(TransactionType.INCOME),
    BUSINESS(TransactionType.INCOME),
    FOOD(TransactionType.EXPENSE),
    RENT(TransactionType.EXPENSE),
    TRAVEL(TransactionType.EXPENSE),
    OTHER(TransactionType.EXPENSE);

    private final TransactionType transactionType;

    CategoryType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }
}
