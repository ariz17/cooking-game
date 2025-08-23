package com.example.cookinggame.cooking_game;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

/**
 * REST Controller for the cooking game.
 * This class provides all the necessary game data to the frontend,
 * including recipes, ingredients, and customer information.
 */
@RestController
@RequestMapping("/api/gamedata")
public class GameDataController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getGameData() {
        Map<String, Object> data = new HashMap<>();

        // Recipes and ingredients
        Map<String, List<String>> recipes = new HashMap<>();
        recipes.put("Chocolate Milkshake", Arrays.asList("chocolate icecream", "milk", "sugar"));
        recipes.put("Milk", Arrays.asList("milk", "sugar"));
        recipes.put("Lemonade", Arrays.asList("water", "sugar", "lemon"));
        recipes.put("Coffee", Arrays.asList("coffee powder", "milk", "sugar"));
        recipes.put("Burger", Arrays.asList("bread", "patty", "cheese"));
        recipes.put("Potato Balls", Arrays.asList("potato", "flour", "oil", "salt"));
        recipes.put("Pizza", Arrays.asList("dough", "cheese", "tomato", "pepperoni"));
        recipes.put("French Fries", Arrays.asList("potato", "oil", "salt"));
        recipes.put("Chocos", Arrays.asList("chocos fills", "sugar", "milk"));
        recipes.put("Chicken Wings", Arrays.asList("chicken", "flour", "oil","salt"));
        data.put("recipes", recipes);

        List<String> ingredients = Arrays.asList("chocolate icecream", "milk", "sugar", "water", "lemon", "bread", "patty", "cheese", "potato", "flour", "oil", "dough", "tomato", "pepperoni", "salt", "chicken", "chocos fills", "coffee powder");
        data.put("ingredients", ingredients);

        // Customer images - using relative paths
        List<String> customerImages = Arrays.asList(
            "/assets/Customer%201.png",
            "/assets/Customer%202.png",
            "/assets/Customer%203.png",
            "/assets/Customer%204.png",
            "/assets/Customer%205.png"
        );
        
        // Available recipe names
        List<String> recipeNames = new ArrayList<>(recipes.keySet());
        
        // Create customers with randomized orders
        List<Map<String, String>> customers = new ArrayList<>();
        for (String image : customerImages) {
            Map<String, String> customer = new HashMap<>();
            customer.put("image", image);
            // Randomly select a recipe for each customer
            String randomRecipe = recipeNames.get((int) (Math.random() * recipeNames.size()));
            customer.put("order", randomRecipe);
            customers.add(customer);
        }
        data.put("customers", customers);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");
        return ResponseEntity.ok().headers(headers).body(data);
    }

    // Add this new method
    @GetMapping("/health")
    public String healthCheck() {
        return "OK";
    }
}