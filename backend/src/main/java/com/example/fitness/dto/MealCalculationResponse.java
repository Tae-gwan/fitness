package com.example.fitness.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MealCalculationResponse {
    private double totalCalories;
    private double totalCarbohydrates;
    private double totalProtein;
    private double totalFat;
}