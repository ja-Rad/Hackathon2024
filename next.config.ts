import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/upload-csv",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
