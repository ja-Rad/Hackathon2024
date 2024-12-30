import "next-auth";

declare module "next-auth" {
    interface User {
        id: string; // Added the `id` field to the User object
        email: string;
    }

    interface Session {
        user: {
            id: string; // Added the `id` field to the Session user
            email: string;
        };
    }

    interface JWT {
        id: string; // Added the `id` field to the JWT object
        email: string;
    }
}
