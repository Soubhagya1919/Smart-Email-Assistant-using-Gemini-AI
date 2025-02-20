package com.email.writer.service.impl;

import com.email.writer.dtos.EmailRequest;
import com.email.writer.service.EmailGeneratorService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

/**
 * Implementation of the EmailGeneratorService interface.
 * This class is responsible for generating emails based on the provided EmailRequest.
 */
@Service
public class EmailGeneratorServiceImpl implements EmailGeneratorService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailGeneratorServiceImpl.class);

    // WebClient instance used for making HTTP requests
    private final WebClient webClient;

    // Gemini API URL
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    // Gemini API key
    @Value("${gemini.api.key}")
    private String getGeminiApiKey;

    /**
     * Constructor for EmailGeneratorServiceImpl.
     * Initializes the WebClient instance using the provided WebClient.Builder.
     *
     * @param webClientBuilder WebClient.Builder instance
     */
    public EmailGeneratorServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
        LOGGER.info("WebClient instance initialized");
    }

    /**
     * Generates an email based on the provided EmailRequest.
     * This method crafts a request in the format expected by the Gemini API,
     * sends the request, and extracts the response content.
     *
     * @param emailRequest EmailRequest instance containing the email content and tone
     * @return the generated email content as a string
     */
    @Override
    public String generateEmail(EmailRequest emailRequest) {
        LOGGER.info("Generating email for request: {}", emailRequest);
        // Build the prompt for the Gemini API request
        String prompt = buildPrompt(emailRequest);
        LOGGER.debug("Prompt built: {}", prompt);

        // Craft a request in the format expected by the Gemini API
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", prompt)
                                }
                        )
                });
        LOGGER.debug("Request body built: {}", requestBody);

        // Send the request to the Gemini API and get the response
        String response = webClient.post()
                .uri(geminiApiUrl + getGeminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        LOGGER.info("Response received from Gemini API");

        // Extract the response content and return it as a string
        return extractResponseContent(response);
    }

    /**
     * Extracts the response content from the Gemini API response.
     * This method uses the ObjectMapper to parse the JSON response and extract the text content.
     *
     * @param response Gemini API response as a string
     * @return the extracted response content as a string
     */
    private String extractResponseContent(String response) {
        LOGGER.debug("Extracting response content from: {}", response);
        try {
            // Initialize the ObjectMapper instance
            ObjectMapper objectMapper = new ObjectMapper();

            // Parse the response into a JsonNode
            JsonNode rootNode = objectMapper.readTree(response);

            // Navigate to the 'text' field in the response
            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            // Return the 'text' value as a string
            String extractedContent = textNode.asText();
            LOGGER.debug("Extracted response content: {}", extractedContent);
            return extractedContent;
        } catch (Exception e) {
            LOGGER.error("Error processing response: {}", e.getMessage());
            // Return an error message if the response cannot be parsed
            return "Error processing request: " + e.getMessage();
        }
    }

    /**
     * Builds the prompt for the Gemini API request based on the provided EmailRequest.
     * This method constructs a string that includes the email content and tone.
     *
     * @param emailRequest EmailRequest instance containing the email content and tone
     * @return the built prompt as a string
     */
    private String buildPrompt(EmailRequest emailRequest) {
        LOGGER.debug("Building prompt for request: {}", emailRequest);
        // Initialize the StringBuilder instance
        StringBuilder prompt = new StringBuilder();

        // Append the email content and tone to the prompt
        prompt.append("Generate a professional email reply for the following email content. Please don't generate a subject line ");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.");
        }
        prompt.append("\nOriginal email content: \n").append(emailRequest.getEmailContent());

        // Return the built prompt as a string
        String builtPrompt = prompt.toString();
        LOGGER.debug("Prompt built: {}", builtPrompt);
        return builtPrompt;
    }
}