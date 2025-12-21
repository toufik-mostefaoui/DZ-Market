package com.example.gateway.Security;

import com.example.gateway.Security.JwtUtil;
import io.micrometer.core.instrument.config.validate.Validated;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class jwtFilter implements WebFilter {

    private final JwtUtil jwtUtil;

    public jwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // Empty public URLs list (only protected endpoints by default)
    private static final String[] PUBLIC_URLS = {
            "/ms-products/api-docs" ,"/ms-authentification/" , "/ms-command/"
            ,"/ms-products/"
    };

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        String method = request.getMethod().name();

        // Allow public endpoints (none specified right now)
        for (String pub : PUBLIC_URLS) {
            if (path.startsWith(pub)) {
                System.out.println("Public endpoint accessed: {}" + path);
                return chain.filter(exchange);
            }
        };

        // Extract Authorization header
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return onError(exchange, "Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7).trim();

        if (!jwtUtil.isValid(token)) {
            System.out.println("Authorization header: '" + authHeader + "'");
            System.out.println("Token extracted: '" + token + "'");
            System.out.println("Token valid: " + jwtUtil.isValid(token));

            return onError(exchange, "Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }

        // No role checks anymore — token validity is sufficient
        return chain.filter(exchange);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        exchange.getResponse().setStatusCode(status);
        return exchange.getResponse().setComplete();
    }
}
