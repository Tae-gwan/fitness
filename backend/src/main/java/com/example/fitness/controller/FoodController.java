package com.example.fitness.controller;

import com.example.fitness.dto.MealCalculationRequest;
import com.example.fitness.dto.MealCalculationResponse;
import com.example.fitness.entity.Food;
import com.example.fitness.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @PostMapping("/calculate")
    public ResponseEntity<MealCalculationResponse> calculateCalories(@RequestBody MealCalculationRequest request) {
        MealCalculationResponse response = foodService.calculateMealNutrients(request);
        return ResponseEntity.ok(response);
    }
    // 기존 calculateCalories 메서드 아래에 추가해 주세요!
    @GetMapping("/search")
    public ResponseEntity<List<Food>> searchFoods(@RequestParam("keyword") String keyword) {
        List<Food> searchResult = foodService.searchFoods(keyword);
        return ResponseEntity.ok(searchResult);
    }
}