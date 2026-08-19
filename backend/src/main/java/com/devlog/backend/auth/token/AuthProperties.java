package com.devlog.backend.auth.token;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.auth")
public class AuthProperties {

    private String jwtSecret;
    private Duration accessTokenExpiration;
    private Duration refreshTokenExpiration;
    private String frontendRedirectUrl;
    private boolean cookieSecure;
}
