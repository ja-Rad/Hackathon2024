"use client";

import { useState, ChangeEvent } from "react";
import { handleTestDataUpload, processCsvData, uploadDataToDatabase } from "../lib/csvHandlers";

export default function UploadCSVClient() {
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>("");

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

        try {
            await fetch("/api/football-matches", { method: "DELETE" });

            const csvString = await csvFile.text();
            const csvData = await processCsvData(csvString);

            await uploadDataToDatabase(csvData);

            setStatusMessage(`Success: File "${csvFile.name}" uploaded successfully.`);
        } catch (error) {
            setStatusMessage(`Error: ${(error as Error).message}`);
        }
    };

    const handleTestUpload = async (): Promise<void> => {
        try {
            await handleTestDataUpload();
            setStatusMessage("Success: Test CSV data loaded.");
        } catch (error) {
            setStatusMessage(`Error: ${(error as Error).message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">CSV Upload</h1>

                <div className="flex flex-col items-center gap-4 mb-4">
                    <label htmlFor="fileInput" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                        Browse CSV File
                    </label>
                    <input id="fileInput" type="file" accept=".csv" className="hidden" onChange={handleFileSelection} />

                    <button onClick={handleFileUpload} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                        Upload to Database
                    </button>
                </div>

                <button onClick={handleTestUpload} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Use Test Data
                </button>

                {statusMessage && <div className="mt-3 text-sm text-gray-800 dark:text-gray-200">{statusMessage}</div>}
            </div>
        </div>
    );
}