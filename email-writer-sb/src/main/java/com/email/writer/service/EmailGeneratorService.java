package com.email.writer.service;

import com.email.writer.dtos.EmailRequest;

public interface EmailGeneratorService {
    String generateEmail(EmailRequest emailRequest);
}
