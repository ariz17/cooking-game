package com.example.cookinggame.cooking_game;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.example.cookinggame")
public class CookingGameApplication {

    public static void main(String[] args) {
        SpringApplication.run(CookingGameApplication.class, args);
    }
}