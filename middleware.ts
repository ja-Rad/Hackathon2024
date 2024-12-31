// import { NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/dashboard/:path*", // Protect dashboard
        "/document-uploader/:path*", // Protect document uploader
        "/api/football-matches/:path*", // Protect football-matches API
        "/api/generative-ai-advice/:path*", // Protect generative AI advice API
        "/api/upload-csv/:path*", // Protect upload CSV API
        "/insights/:path*", // Protect dynamic insights routes
    ],
};

// Middleware debug log
// export function middleware(request) {
//     console.log("Middleware invoked for:", request.nextUrl.pathname);
//     return NextResponse.next();
// }

