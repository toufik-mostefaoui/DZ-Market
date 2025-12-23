package com.example.gateway.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class JwtUtil {


    @Value("${jwt.secret}")
    private String secret;
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isValid(String token){
        try{
            System.out.println("Secret: '" + secret + "'");
            extractClaims(token);
            return true;
        }catch (Exception e){
            return false;
        }
    }

    public String getRole(String token){
        return extractClaims(token).get("role" , String.class);
    }
}