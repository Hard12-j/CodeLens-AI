"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { QueryKeys } from "@/lib/query-keys";

export const Auth_COOKIE = "devpilot_auth";

export function setAuthCookie(authed: boolean){
    if(typeof document === "undefined") return;
    if(authed){
        document.cookie = `${Auth_COOKIE}=1; path=/; max-age=${60*60*24*7}; SameSite=Lax`;
    }else{
        document.cookie = `${Auth_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    }
}

export function useCurrentUser(){
    return useQuery({
        queryKey: QueryKeys.auth.me(),
        queryFn: async() => {
            try{
                const user = await api.me();
                setAuthCookie(true);
                return user;
            }catch(error){
                setAuthCookie(false);
                throw error;
            }
        },
    })
}

export function useLogout(){
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async() => {
            await api.logout();
        },
        onSuccess: () => {
            setAuthCookie(false);
            queryClient.invalidateQueries({queryKey: QueryKeys.auth.all});
            
            router.replace("/login");
        }
    })
}