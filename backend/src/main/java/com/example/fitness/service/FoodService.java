package com.example.fitness.service;

import com.example.fitness.dto.MealCalculationRequest;
import com.example.fitness.dto.MealCalculationResponse;
import com.example.fitness.entity.Food;
import com.example.fitness.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;

    @Transactional(readOnly = true)
    public MealCalculationResponse calculateMealNutrients(MealCalculationRequest request) {
        double totalCalories = 0;
        double totalCarbs = 0;
        double totalProtein = 0;
        double totalFat = 0;

        for (MealCalculationRequest.MealItem item : request.getItems()) {
            // DB에서 음식 조회 (없으면 예외 발생)
            Food food = foodRepository.findById(item.getFoodId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 음식 ID입니다: " + item.getFoodId()));

            // 💡 기준량(보통 100g) 대비 먹은 양 비율 계산
            // 만약 공공데이터 기준량이 다를 경우를 대비해 비례 계산 포뮬러 적용
            double ratio = item.getAmount() / 100.0;

            totalCalories += food.getCalories() * ratio;
            totalCarbs += food.getCarbohydrates() * ratio;
            totalProtein += food.getProtein() * ratio;
            totalFat += food.getFat() * ratio;
        }

        // 소수점 둘째 짜리까지만 깔끔하게 반환되도록 반올림 가공
        return MealCalculationResponse.builder()
                .totalCalories(Math.round(totalCalories * 100.0) / 100.0)
                .totalCarbohydrates(Math.round(totalCarbs * 100.0) / 100.0)
                .totalProtein(Math.round(totalProtein * 100.0) / 100.0)
                .totalFat(Math.round(totalFat * 100.0) / 100.0)
                .build();
    }
    // 기존 calculateMealNutrients 메서드 아래에 추가해 주세요!
    @Transactional(readOnly = true)
    public List<Food> searchFoods(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return foodRepository.findByFoodNameContaining(keyword.trim());
    }
}
