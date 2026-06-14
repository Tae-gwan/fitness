package com.example.fitness.repository;

import com.example.fitness.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {
    // 💡 음식 이름에 특정 키워드가 포함된 항목들을 모두 찾는 메서드
    List<Food> findByFoodNameContaining(String keyword);
}