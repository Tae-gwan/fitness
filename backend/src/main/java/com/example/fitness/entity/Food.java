package com.example.fitness.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "foods", indexes = {
        @Index(name = "idx_food_name", columnList = "food_name")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "food_name", nullable = false)
    private String foodName; // 식품명

    @Column(name = "serving_size_string")
    private String servingSizeString; // 영양성분함량기준량 (예: 100g)

    private double calories; // 에너지(kcal)
    private double protein;  // 단백질(g)
    private double fat;      // 지방(g)
    private double carbohydrates; // 탄수화물(g)
}