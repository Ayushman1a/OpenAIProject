package com.example.traveltourism.controller;

import com.example.traveltourism.payload.request.LoginRequest;
import com.example.traveltourism.payload.request.SignupRequest;
import com.example.traveltourism.payload.response.AuthResponse;
import com.example.traveltourism.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody SignupRequest signupRequest) {
        userService.registerUser(signupRequest);
        String token = createBasicAuthToken(signupRequest.getUsername(), signupRequest.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(signupRequest.getUsername(), token, Collections.singletonList("USER")));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(authority -> authority.startsWith("ROLE") ? authority.replaceFirst("ROLE_", "") : authority)
                .collect(Collectors.toList());

        String token = createBasicAuthToken(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity.ok(new AuthResponse(authentication.getName(), token, roles));
    }

    private String createBasicAuthToken(String username, String password) {
        String credentials = username + ":" + password;
        return "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }
}
