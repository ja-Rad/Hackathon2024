export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/dashboard", "/document-uploader"], // Add all routes requiring authentication
};
