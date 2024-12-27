"use client";
import Papa from "papaparse";
import React, { useState, ChangeEvent } from "react";

export default function UploadCSV() {
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [csvFileName, setCsvFileName] = useState<string>("");
    const [statusMessage, setStatusMessage] = useState<string>("");

    const handleImportCSV = (event: ChangeEvent<HTMLInputElement>): void => {
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
        setCsvFileName(file.name);
        setStatusMessage(`File "${file.name}" selected successfully.`);
    };

    const handleImportTestCSV = async (): Promise<void> => {
        try {
            const deleteResponse = await fetch("/api/football-matches", {
                method: "DELETE",
            });

            if (!deleteResponse.ok) {
                throw new Error("Failed to delete existing documents in the database.");
            }

            const fileResponse = await fetch("/files/CCFC_match_lineups_data.csv");
            if (!fileResponse.ok) {
                throw new Error("Failed to fetch test CSV file.");
            }

            const csvString = await fileResponse.text();

            const processedCsvString = csvString.replace(/^,+/, "id,");

            const csvDataJson = Papa.parse<object[]>(processedCsvString, {
                header: true,
                skipEmptyLines: true,
            }).data;

            const response = await fetch("/api/upload-csv", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(csvDataJson),
            });

            if (!response.ok) {
                throw new Error("Failed to upload data to the database.");
            }

            setCsvFileName("CCFC_match_lineups_data.csv");
            setStatusMessage("Success: Test CSV data loaded.");
        } catch (error) {
            setStatusMessage(`Error: ${(error as Error).message}`);
        }
    };

    const handleUploadToDatabase = async (): Promise<void> => {
        if (!csvFile) {
            setStatusMessage("Error: No file selected to upload.");
            return;
        }

        try {
            // Delete existing documents in the database
            const deleteResponse = await fetch("/api/football-matches", {
                method: "DELETE",
            });

            if (!deleteResponse.ok) {
                throw new Error("Failed to delete existing documents in the database.");
            }

            const reader = new FileReader();
            reader.onload = async (e) => {
                const csvString = e.target?.result as string;

                const processedCsvString = csvString.replace(/^,+/, "id,");

                const csvDataJson = Papa.parse<object[]>(processedCsvString, {
                    header: true,
                    skipEmptyLines: true,
                }).data;

                const response = await fetch("/api/upload-csv", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(csvDataJson),
                });

                if (!response.ok) {
                    throw new Error("Failed to upload data to the database.");
                }

                setStatusMessage(`Success: File "${csvFileName}" uploaded successfully.`);
            };

            reader.readAsText(csvFile);
        } catch (error) {
            setStatusMessage(`Error: ${(error as Error).message}`);
        }
    };

    const triggerFileInput = () => {
        document.getElementById("fileInput")?.click();
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">CSV Upload</h1>

                <div className="flex flex-col items-center gap-4 mb-4">
                    <button onClick={triggerFileInput} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Import CSV File
                    </button>
                    <input id="fileInput" type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />

                    <button onClick={handleUploadToDatabase} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mb-3">
                        Upload to Database
                    </button>
                </div>
                <button onClick={handleImportTestCSV} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Import Test CSV
                </button>

                {statusMessage && <div className="mt-3 text-sm text-white-800">{statusMessage}</div>}
            </div>
        </div>
    );
}
