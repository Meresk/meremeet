import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = `auth_token`;

interface DecodedToken {
    sub: string;     
    user_id: number;  
    exp: number;
    iat: number;
}

class AuthStorage {
    getToken(): string | null {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch {
            return null;
        }
    }

    saveToken(token: string): void {
        try {
            localStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Failed to save token:', error);
            throw new Error('Failed to save authentication token');
        }
    }

    clearToken(): void {
        try {
            localStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.error('Failed to clear token:', error);
        }
    }

    getDecodedToken(): DecodedToken | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            return jwtDecode<DecodedToken>(token);
        } catch (error) {
            console.error('Invalid token:', error);
            this.clearToken();
            return null;
        }
    }

    isTokenValid(): boolean {
        const decoded = this.getDecodedToken();
        if (!decoded) return false;

        const now = Date.now() / 1000 + 10;
        return decoded.exp > now;
    }

    getUserId(): number | null {
        const decoded = this.getDecodedToken();
        return decoded?.user_id ?? null;
    }

    getUserLogin(): string | null {
        const decoded = this.getDecodedToken();
        return decoded?.sub ?? null;
    }

    // Получаем все данные пользователя из токена
    getUserInfo(): { userId: number | null; login: string | null } {
        const decoded = this.getDecodedToken();
        return {
            userId: decoded?.user_id ?? null,
            login: decoded?.sub ?? null
        };
    }
}

export const authStorage = new AuthStorage();