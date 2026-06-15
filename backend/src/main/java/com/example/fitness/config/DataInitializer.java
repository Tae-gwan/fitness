package com.example.fitness.config;

import com.example.fitness.entity.Food;
import com.example.fitness.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets; // 💡 UTF_8을 깔끔하게 쓰기 위한 임포트 추가
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final FoodRepository foodRepository;

    @Override
    public void run(String... args) throws Exception {
        // 이미 DB에 데이터가 있다면 초기화를 건너뜁니다.
        if (foodRepository.count() > 0) {
            log.info("====== 이미 200개 정제 데이터셋이 존재하므로 자동 초기화를 건너뜁니다 ======");
            return;
        }

        log.info("====== [UTF-8 청정 모드] 200개 핵심 데이터셋 초기화를 시작합니다! ======");

        String fileName = "data1.csv";
        List<Food> foodBatchList = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource(fileName);

        if (!resource.exists()) {
            log.error("❌ resources 폴더에 {} 파일이 존재하지 않습니다!", fileName);
            return;
        }

        // 💡 StandardCharsets.UTF_8을 명시하여 새로 드린 200개 파일이 깨지지 않고 한글로 읽히게 합니다.
        try (BufferedReader br = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            br.readLine(); // 맨 상단 헤더(식품명, 제조사...) 한 줄 건너뛰기

            int lineCount = 1;
            while ((line = br.readLine()) != null) {
                lineCount++;
                if (line.trim().isEmpty()) continue;

                // 예외가 발생해도 다음 줄로 부드럽게 넘어가도록 개별 행마다 try-catch 처리
                try {
                    String[] tokens = line.split(",");

                    // 칼로리, 탄단지가 위치한 최소 8개의 열이 확보되지 않은 깨진 줄은 통과
                    if (tokens == null || tokens.length < 8) {
                        continue;
                    }

                    String name = tokens[0].trim();   // 식품명
                    String size = tokens[3].trim();   // 1회제공량

                    double calories = parseDoubleSafely(tokens[4]); // 에너지(kcal)
                    double protein  = parseDoubleSafely(tokens[5]); // 단백질(g)
                    double fat      = parseDoubleSafely(tokens[6]); // 지방(g)
                    double carbs    = parseDoubleSafely(tokens[7]); // 탄수화물(g)

                    if (name.isEmpty()) continue;

                    Food food = Food.builder()
                            .foodName(name)
                            .servingSizeString(size)
                            .calories(calories)
                            .protein(protein)
                            .fat(fat)
                            .carbohydrates(carbs)
                            .build();

                    foodBatchList.add(food);

                } catch (ArrayIndexOutOfBoundsException e) {
                    log.warn("⚠️ {}번째 행에서 데이터 잘림 발생 (건너뜁니다) -> 내용: {}", lineCount, line);
                } catch (Exception e) {
                    continue;
                }
            }
        }

        if (!foodBatchList.isEmpty()) {
            foodRepository.saveAll(foodBatchList);
            log.info("====== 총 {}개의 엄선된 식단 데이터가 DB에 정상 저장되었습니다! ======", foodRepository.count());
        }
    }

    private double parseDoubleSafely(String value) {
        if (value == null || value.trim().isEmpty()) {
            return 0.0;
        }
        try {
            return Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}