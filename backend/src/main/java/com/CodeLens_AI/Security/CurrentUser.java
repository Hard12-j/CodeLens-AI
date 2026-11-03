package com.CodeLens_AI.Security;

import com.CodeLens_AI.Exceptions.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {
    public AppUserPrinciple require(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !(authentication.getPrincipal() instanceof AppUserPrinciple principle)){
            throw new UnauthorizedException("Not Authenticated");
        }
        return principle;

    }
}
