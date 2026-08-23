package com.devlog.backend.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class HttpRequestLoggingFilter extends OncePerRequestFilter {

    private static final String REQUEST_ID_HEADER = "X-Request-Id";
    private static final String REQUEST_ID_MDC_KEY = "requestId";

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String requestId = resolveRequestId(request);
        long startedAt = System.nanoTime();

        MDC.put(REQUEST_ID_MDC_KEY, requestId);
        response.setHeader(REQUEST_ID_HEADER, requestId);

        try {
            filterChain.doFilter(request, response);
        } catch (IOException | ServletException | RuntimeException exception) {
            log.error(
                "HTTP request failed method={} uri={} durationMs={}",
                request.getMethod(),
                request.getRequestURI(),
                elapsedMillis(startedAt),
                exception
            );
            throw exception;
        } finally {
            int status = response.getStatus();
            long durationMillis = elapsedMillis(startedAt);
            if (status >= 500) {
                log.error("HTTP request completed method={} uri={} status={} durationMs={}",
                    request.getMethod(), request.getRequestURI(), status, durationMillis);
            } else if (status >= 400) {
                log.warn("HTTP request completed method={} uri={} status={} durationMs={}",
                    request.getMethod(), request.getRequestURI(), status, durationMillis);
            } else {
                log.info("HTTP request completed method={} uri={} status={} durationMs={}",
                    request.getMethod(), request.getRequestURI(), status, durationMillis);
            }
            MDC.remove(REQUEST_ID_MDC_KEY);
        }
    }

    private String resolveRequestId(HttpServletRequest request) {
        String requestId = request.getHeader(REQUEST_ID_HEADER);
        if (requestId == null
            || requestId.isBlank()
            || requestId.length() > 100
            || !requestId.matches("[A-Za-z0-9._-]+")) {
            return UUID.randomUUID().toString();
        }
        return requestId;
    }

    private long elapsedMillis(long startedAt) {
        return TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startedAt);
    }
}
