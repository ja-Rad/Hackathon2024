"use client";

import { useState } from "react";

export default function UploadButtons() {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("api/upload-csv", {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error("Upload failed");
            }
            // Handle successful upload
            console.log("Upload successful");
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

            
            <button onClick={() => handleUpload()} disabled={isLoading} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto">
                Import CSV
            </button>
            <button onClick={() => handleUpload()} disabled={isLoading} className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto">
                Use Test Data
            </button>
        </div>
    );
}
