"use client";

import { useState, ChangeEvent } from "react";
import { handleTestDataUpload, processCsvData, uploadDataToDatabase } from "../document-uploader/services/csvHandlers";

export default function UploadCSVClient() {
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [redirectReady, setRedirectReady] = useState<boolean>(false);

    const handleFileSelection = (event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (!file) {
            setStatusMessage("Error: Please select a file.");
            return;
        }

        if (!file.name.endsWith(".csv")) {
            setStatusMessage("Error: Please upload a CSV file.");
            return;
        }

        setCsvFile(file);
        setStatusMessage(`File "${file.name}" selected successfully.`);
    };

    const handleFileUpload = async (): Promise<void> => {
        if (!csvFile) {
            setStatusMessage("Error: No file selected to upload.");
            return;
        }

        setIsLoading(true);
        try {
            await fetch("/api/football-matches", { method: "DELETE" });

            const csvString = await csvFile.text();
            const csvData = await processCsvData(csvString);

            await uploadDataToDatabase(csvData);

            setStatusMessage(`Success: File "${csvFile.name}" uploaded successfully.`);
            setRedirectReady(true);
        } catch (error) {
            setStatusMessage(`Error: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTestUpload = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await handleTestDataUpload();
            setStatusMessage("Success: Test CSV data loaded.");
            setRedirectReady(true);
        } catch (error) {
            setStatusMessage(`Error: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-light border-dotted rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-text-light text-lg">Processing your request, please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-6 text-text-light">CSV Upload</h1>

                <div className="flex flex-col items-center gap-4 mb-4">
                    <label htmlFor="fileInput" className="px-4 py-2 bg-primary-light hover:bg-primary-hover text-white rounded cursor-pointer">
                        Browse CSV File
                    </label>
                    <input id="fileInput" type="file" accept=".csv" className="hidden" onChange={handleFileSelection} />

                    <button onClick={handleFileUpload} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded">
                        Upload to Database
                    </button>
                </div>

                <button onClick={handleTestUpload} className="px-4 py-2 bg-success hover:bg-green-600 text-white rounded">
                    Use Test Data
                </button>

                {statusMessage && <div className="mt-3 text-sm text-text-light">{statusMessage}</div>}

                {redirectReady && (
                    <div className="mt-6">
                        <a href="/dashboard" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded">
                            Go to Dashboard
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
