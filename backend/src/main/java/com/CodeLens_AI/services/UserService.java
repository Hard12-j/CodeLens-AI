package com.CodeLens_AI.services;

import com.CodeLens_AI.Entity.User;
import com.CodeLens_AI.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;


@Service
@RequiredArgsConstructor
public class UserService {
    public final UserRepository userRepository;
    public final TextEncryptor tokenEncryptor;

    public User requiredById(UUID id){
        return  userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public String decryptAccessToken(User user){
        return tokenEncryptor.encrypt(user.getAccessToken());
    }

    @Transactional(readOnly = true)
    private static Long toLong(Object value){
        if(value instanceof Number number){
            return number.longValue();
        }
        return Long.parseLong(value.toString());
    }
}
