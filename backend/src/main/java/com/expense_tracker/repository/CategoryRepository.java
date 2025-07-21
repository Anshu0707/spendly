package com.expense_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.expense_tracker.model.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Add findByCategoryType(CategoryType type) if needed
}
