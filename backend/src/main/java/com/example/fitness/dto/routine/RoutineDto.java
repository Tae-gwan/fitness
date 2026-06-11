package com.example.fitness.dto.routine;

import java.util.List;

public class RoutineDto {


    // AI 루틴 추천 [ 요청 데이터 ]
    public record AiRequest(
            String goal,
            String level,
            String equipmentType
    ) {}

    // AI 루틴 추천 [ 응답 데이터 ] , 루틴 저장/수정
    public record AiResponse(
            String routineName,           // 루틴 이름
            List<ExerciseInfo> exercises  // 상세 운동 목록
    ) {}

    // 운동 상세 정보
    public record ExerciseInfo (
            int sequence,       // 운동 순서
            String name,        // 운동 이름
            String targetPart,  // 타겟 부위
            int sets,           // 세트 수
            int reps            // 횟수
    ){}

    // 저장된 루틴 상세 [ 응답 데이터 ]
    public record Response(
            Long routineId,
            String routineName,
            List<ExerciseInfo> exercises
    ){}


    // 운동 마스터 데이터 [ 응답 데이터 ]
    public record MasterExerciseResponse(
            String name,
            String targetPart
    ) {}
}
