package com.example.fitness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// 아래 import 추가
import org.springframework.ai.model.google.genai.autoconfigure.chat.GoogleGenAiChatAutoConfiguration;
import org.springframework.ai.model.google.genai.autoconfigure.embedding.GoogleGenAiEmbeddingConnectionAutoConfiguration;

@SpringBootApplication(exclude = {
		GoogleGenAiChatAutoConfiguration.class,
		GoogleGenAiEmbeddingConnectionAutoConfiguration.class
})
public class FitnessApplication {
	public static void main(String[] args) {
		SpringApplication.run(FitnessApplication.class, args);
	}
}