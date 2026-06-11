package com.example.fitness.service.routine;

import com.example.fitness.dto.routine.RoutineDto;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional(readOnly = true)
public class AiRoutineService {

    private final ChatClient chatClient;


    public AiRoutineService(ChatClient.Builder builder) {
        this.chatClient = builder
                .defaultOptions(GoogleGenAiChatOptions.builder()
                        .model("gemini-2.5-flash") // 최신 모델로 고정
                        .temperature(0.1)
                        .build())
                .build();
    }


    // ai 루틴 추천
    public RoutineDto.AiResponse generateRoutine(RoutineDto.AiRequest dto) {
        return this.chatClient.prompt()
                .system("당신은 전문 피트니스 트레이너입니다. 사용자의 조건에 맞는 최적의 운동 루틴을 JSON 형식으로 제공해야 합니다.")
                .user(u -> u.text("운동 목표: {goal}, 수준: {level}, 장비: {equipment}")
                        .param("goal", dto.goal())
                        .param("level", dto.level())
                        .param("equipment", dto.equipmentType()))
                .call()
                .entity(RoutineDto.AiResponse.class);
    }
}
