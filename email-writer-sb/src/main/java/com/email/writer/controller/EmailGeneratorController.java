/**
 * This class serves as a RESTful API controller for email generation.
 * It handles HTTP requests and delegates the actual email generation to the EmailGeneratorService.
 */
package com.email.writer.controller;

import com.email.writer.dtos.EmailRequest;
import com.email.writer.service.EmailGeneratorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**G
 * This REST controller is responsible for handling email generation requests.
 * It is annotated with @RestController to indicate that it handles REST requests.
 * The @RequestMapping annotation specifies the base URL for this controller.
 * The @CrossOrigin annotation allows cross-origin requests from any domain.
 */
@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailGeneratorController {

    private static final Logger logger = LoggerFactory.getLogger(EmailGeneratorController.class);

    /**
     * The EmailGeneratorService instance that will be used to generate emails.
     * This instance is injected through the constructor.
     */
    private final EmailGeneratorService emailGeneratorService;

    /**
     * Constructor that injects the EmailGeneratorService instance.
     * @param emailGeneratorService the EmailGeneratorService instance to be used
     */
    public EmailGeneratorController(EmailGeneratorService emailGeneratorService) {
        this.emailGeneratorService = emailGeneratorService;
        logger.info("EmailGeneratorController initialized with EmailGeneratorService instance");
    }

    /**
     * Handles HTTP POST requests to the "/generate" endpoint.
     * This method generates an email based on the provided EmailRequest and returns the response as a String.
     * @param emailRequest the EmailRequest instance containing the email content and tone
     * @return the generated email content as a String, wrapped in a ResponseEntity
     */
    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest) {
        logger.info("Received email generation request with emailRequest: {}", emailRequest);
        try {
            // Delegate the email generation to the EmailGeneratorService
            String response = emailGeneratorService.generateEmail(emailRequest);
            logger.info("Email generation successful with response: {}", response);
            // Return the response as a String, wrapped in a ResponseEntity
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error generating email", e);
            return ResponseEntity.badRequest().body("Error generating email: " + e.getMessage());
        }
    }
}