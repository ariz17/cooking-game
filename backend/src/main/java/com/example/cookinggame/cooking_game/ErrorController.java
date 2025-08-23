package com.example.cookinggame.cooking_game;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Custom error controller to handle errors gracefully instead of showing Whitelabel Error Page
 */
@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Map<String, Object> errorResponse = new HashMap<>();
        
        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());
            
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                errorResponse.put("error", "Not Found");
                errorResponse.put("message", "The requested resource was not found");
                errorResponse.put("status", 404);
                errorResponse.put("availableEndpoints", new String[]{
                    "/api/gamedata - Get game data",
                    "/api/gamedata/health - Health check",
                    "/actuator/health - Spring Boot health check"
                });
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            } else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                errorResponse.put("error", "Internal Server Error");
                errorResponse.put("message", "An internal server error occurred");
                errorResponse.put("status", 500);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }
        }
        
        errorResponse.put("error", "Unknown Error");
        errorResponse.put("message", "An unknown error occurred");
        errorResponse.put("status", 500);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
