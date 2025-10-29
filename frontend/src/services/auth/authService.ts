import { API_BASE_URL } from "../../config/constants.ts";
import type { LoginParams, LoginResponse } from "./types.ts";
import { authStorage } from "./storage.ts";

class AuthService {
    async login(params: LoginParams): Promise<string> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Login failed with status: ${res.status}`);
            }

            const data: LoginResponse = await res.json();
            
            if (!data.token) {
                throw new Error('No token received from server');
            }

            authStorage.saveToken(data.token);
            return data.token;

        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout - server is not responding');
                }
                throw error;
            }
            
            throw new Error('Network error occurred');
        }
    }

    logout(): void {
        authStorage.clearToken();
    }

    isAuthenticated(): boolean {
        return authStorage.isTokenValid();
    }

    getUserId(): number | null {
        return authStorage.getUserId();
    }

    getUserLogin(): string | null {
        return authStorage.getUserLogin();
    }

    // Полная информация о пользователе
    getUserInfo(): { userId: number | null; login: string | null } {
        return authStorage.getUserInfo();
    }

    // Простая проверка авторизации
    checkAuth(): { isAuthenticated: boolean; userId: number | null; login: string | null } {
        return {
            isAuthenticated: this.isAuthenticated(),
            userId: this.getUserId(),
            login: this.getUserLogin()
        };
    }
}

export const authService = new AuthService();