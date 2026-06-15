package com.example.fitness.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@NoArgsConstructor
public class MealCalculationRequest {
    private List<MealItem> items;

    @Getter
    @NoArgsConstructor
    public static class MealItem {
        private Long foodId;    // 음식 고유 ID
        private double amount;  // 먹은 양 (g 단위 기준)
    }
}