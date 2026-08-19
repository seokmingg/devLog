package com.devlog.backend.auth.token;

import com.devlog.backend.member.Member;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.util.Base64;

@Component
public class JwtTokenProvider {

    private final AuthProperties authProperties;
    private final SecretKey secretKey;
    private final JwtEncoder jwtEncoder;

    public JwtTokenProvider(AuthProperties authProperties) {
        this.authProperties = authProperties;
        byte[] keyBytes = Base64.getDecoder().decode(authProperties.getJwtSecret());

        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("JWT_SECRET은 최소 32바이트여야 합니다.");
        }

        this.secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
        this.jwtEncoder = NimbusJwtEncoder
            .withSecretKey(secretKey)
            .algorithm(MacAlgorithm.HS256)
            .build();
    }

    public TokenResponse createAccessToken(Member member) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plus(authProperties.getAccessTokenExpiration());

        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("devlog")
            .issuedAt(issuedAt)
            .expiresAt(expiresAt)
            .subject(member.getId().toString())
            .claim("role", member.getRole().name())
            .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = jwtEncoder
            .encode(JwtEncoderParameters.from(header, claims))
            .getTokenValue();

        return new TokenResponse(
            token,
            "Bearer",
            authProperties.getAccessTokenExpiration().toSeconds()
        );
    }

    public SecretKey getSecretKey() {
        return secretKey;
    }
}
