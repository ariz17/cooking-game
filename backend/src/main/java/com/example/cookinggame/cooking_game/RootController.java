package com.example.cookinggame.cooking_game;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Controller for handling root path requests and providing basic information about the API.
 */
@Controller
public class RootController {

    /**
     * Handles requests to the root path and provides information about the API.
     * 
     * @return A simple message with API information
     */
    @GetMapping("/")
    @ResponseBody
    public String home() {
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head><title>Cooking Game API</title></head>" +
               "<body>" +
               "<h1>Cooking Game Backend API</h1>" +
               "<p>Welcome to the Cooking Game backend API server.</p>" +
               "<p>This server provides game data for the frontend application.</p>" +
               "<h2>Available Endpoints:</h2>" +
               "<ul>" +
               "<li><a href='/api/gamedata'>/api/gamedata</a> - Get all game data (recipes, ingredients, customers)</li>" +
               "<li><a href='/api/gamedata/health'>/api/gamedata/health</a> - Health check endpoint</li>" +
               "<li><a href='/actuator/health'>/actuator/health</a> - Spring Boot health endpoint</li>" +
               "</ul>" +
               "<p>For the frontend application, please visit your frontend service URL.</p>" +
               "</body>" +
               "</html>";
    }
}