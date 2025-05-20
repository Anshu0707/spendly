package com.expense_tracker.model;

public enum CategoryType {
    SALARY(TransactionType.INCOME),
    BUSINESS(TransactionType.INCOME),
    FOOD(TransactionType.EXPENSE),
    RENT(TransactionType.EXPENSE),
    TRAVEL(TransactionType.EXPENSE),
    OTHER(TransactionType.EXPENSE); // default

    private final TransactionType transactionType;

    //Associating TransactionType with CategoryType
    CategoryType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    //This method returns the TransactionType linked to this CategoryType.
    public TransactionType getTransactionType() {
        return transactionType;
    }
}
