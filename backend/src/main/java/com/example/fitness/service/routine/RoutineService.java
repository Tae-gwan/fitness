package com.example.fitness.service.routine;

import com.example.fitness.dto.routine.RoutineDto;
import com.example.fitness.entity.User;
import com.example.fitness.entity.routine.Routine;
import com.example.fitness.entity.routine.RoutineExercise;
import com.example.fitness.repository.UserRepository;
import com.example.fitness.repository.routine.MasterExerciseRepository;
import com.example.fitness.repository.routine.RoutineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoutineService {

    private final UserRepository userRepository;
    private final RoutineRepository routineRepository;
    private final MasterExerciseRepository masterExerciseRepository;


    // 2. 루틴 저장 / 추가
    @Transactional
    public RoutineDto.Response saveRoutine(String username, RoutineDto.AiResponse dto) {

        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 멤버")
        );

        Routine routine = Routine.builder()
                .name(dto.routineName())
                .user(user)
                .build();

        dto.exercises().forEach(ex -> {
            routine.addExercise(RoutineExercise.builder()
                    .sequence(ex.sequence())
                    .name(ex.name())
                    .targetPart(ex.targetPart())
                    .sets(ex.sets())
                    .reps(ex.reps())
                    .build());
        });

        Routine saved = routineRepository.save(routine);
        return convertToDto(saved);
    }


    // 3. 내 루틴 가져오기
    public List<RoutineDto.Response> getMyRoutines(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(
                ()-> new IllegalArgumentException("존재하지 않는 멤버")
        );

        return routineRepository.findAllByUserId(user.getId()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 4. 운동 추가 기초 데이터 ( 운동 마스터 데이터 )
    public List<RoutineDto.MasterExerciseResponse> getMasterExercises() {
        return masterExerciseRepository.findAll().stream()
                .map(m -> new RoutineDto.MasterExerciseResponse(m.getName(), m.getTargetPart()))
                .collect(Collectors.toList());
    }

    // 5. 내 루틴 수정
    @Transactional
    public RoutineDto.Response updateRoutine(String username, Long routineId, RoutineDto.AiResponse dto) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 멤버")
        );

        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new IllegalArgumentException("루틴을 찾을 수 없습니다."));

        if (!routine.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        List<RoutineExercise> newExercises = dto.exercises().stream()
                .map(ex -> RoutineExercise.builder()
                        .sequence(ex.sequence())
                        .name(ex.name())
                        .targetPart(ex.targetPart())
                        .sets(ex.sets())
                        .reps(ex.reps())
                        .build())
                .toList();

        routine.update(dto.routineName(), newExercises);
        return convertToDto(routine);
    }

    // 6. 루틴 삭제
    @Transactional
    public void deleteRoutine(String username, Long routineId) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 멤버")
        );

        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new IllegalArgumentException("루틴을 찾을 수 없습니다."));

        if (!routine.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        routineRepository.delete(routine);
    }


    private RoutineDto.Response convertToDto(Routine routine) {
        List<RoutineDto.ExerciseInfo> exercises = routine.getExercises().stream()
                .map(ex -> new RoutineDto.ExerciseInfo(
                        ex.getSequence(), ex.getName(), ex.getTargetPart(), ex.getSets(), ex.getReps()))
                .toList();
        return new RoutineDto.Response(routine.getId(), routine.getName(), exercises);
    }
}
