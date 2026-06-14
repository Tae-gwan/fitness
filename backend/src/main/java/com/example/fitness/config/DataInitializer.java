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
import java.nio.charset.Charset; // 💡 차셋 임포트 추가
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final FoodRepository foodRepository;

    @Override
    public void run(String... args) throws Exception {
        if (foodRepository.count() > 0) {
            log.info("====== 이미 음식 데이터셋이 존재하므로 자동 초기화를 건너뜁니다 ======");
            return;
        }

        log.info("====== 공공데이터셋(data1, data2) 자동 초기화를 시작합니다. ======");

        String[] files = {"data1.csv", "data2.csv"};
        List<Food> foodBatchList = new ArrayList<>();

        for (String fileName : files) {
            ClassPathResource resource = new ClassPathResource(fileName);

            if (!resource.exists()) {
                log.warn("{} 파일이 resources 폴더에 없습니다. 건너뜁니다.", fileName);
                continue;
            }

            // 💡 인코딩을 StandardCharsets.UTF_8에서 한국 공공데이터 전용인 "EUC-KR"로 수정합니다.
            try (BufferedReader br = new BufferedReader(new InputStreamReader(resource.getInputStream(), Charset.forName("EUC-KR")))) {
                String line;
                br.readLine(); // 헤더 건너뛰기

                while ((line = br.readLine()) != null) {
                    if (line.trim().isEmpty()) continue;

                    String[] tokens = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);

                    if (tokens.length < 6) {
                        tokens = line.split(";");
                        if (tokens.length < 6) continue;
                    }

                    try {
                        String name = tokens[0].replace("\"", "").trim();
                        String size = tokens[1].replace("\"", "").trim();

                        double calories = parseDoubleSafely(tokens[2]);
                        double protein = parseDoubleSafely(tokens[3]);
                        double fat = parseDoubleSafely(tokens[4]);
                        double carbs = parseDoubleSafely(tokens[5]);

                        Food food = Food.builder()
                                .foodName(name)
                                .servingSizeString(size)
                                .calories(calories)
                                .protein(protein)
                                .fat(fat)
                                .carbohydrates(carbs)
                                .build();

                        foodBatchList.add(food);

                    } catch (Exception e) {
                        continue;
                    }
                }
                log.info("{} 파일 파싱 완료! (현재까지 쌓인 데이터 수: {}개)", fileName, foodBatchList.size());
            }
        }

        if (!foodBatchList.isEmpty()) {
            foodRepository.saveAll(foodBatchList);
            log.info("====== 총 {}개의 공공데이터셋이 성공적으로 DB에 저장되었습니다! ======", foodRepository.count());
        }
    }

    private double parseDoubleSafely(String value) {
        if (value == null || value.replace("\"", "").trim().isEmpty()) {
            return 0.0;
        }
        try {
            return Double.parseDouble(value.replace("\"", "").trim());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}