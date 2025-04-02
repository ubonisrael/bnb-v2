interface CookieOptions {
    expires?: Date;
    path?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}

class CookieService {
    /**
     * Set a cookie with the given name, value, and options
     */
    public setCookie(name: string, value: string, options: CookieOptions = {}): void {
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (options.expires) {
            cookieString += `; expires=${options.expires.toUTCString()}`;
        }

        if (options.path) {
            cookieString += `; path=${options.path}`;
        }

        if (options.secure) {
            cookieString += '; secure';
        }

        if (options.sameSite) {
            cookieString += `; samesite=${options.sameSite}`;
        }

        document.cookie = cookieString;
    }

    /**
     * Get a cookie value by name
     */
    public getCookie(name: string): string | null {
        const cookies = document.cookie.split(';');
        const cookieName = encodeURIComponent(name);

        for (const cookie of cookies) {
            const [key, value] = cookie.trim().split('=');
            if (key === cookieName) {
                return decodeURIComponent(value);
            }
        }

        return null;
    }

    /**
     * Delete a cookie by name
     */
    public deleteCookie(name: string, path: string = '/'): void {
        this.setCookie(name, '', {
            expires: new Date(0),
            path
        });
    }

    /**
     * Set a cookie with expiration in hours from now
     */
    public setCookieWithExpiry(name: string, value: string, hoursToExpire: number): void {
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (hoursToExpire * 60 * 60 * 1000));

        this.setCookie(name, value, {
            expires: expiryDate,
            path: '/'
        });
    }
}

export default CookieService; 