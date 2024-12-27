import Papa from "papaparse";

export const processCsvData = async (csvString: string): Promise<object[]> => {
    const processedCsvString = csvString.replace(/^,+/, "id,");
    return Papa.parse(processedCsvString, {
        header: true,
        skipEmptyLines: true,
    }).data as object[];
};

export const uploadDataToDatabase = async (data: object[]): Promise<void> => {
    const response = await fetch("/api/upload-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to upload data to the database.");
    }
};

export const handleTestDataUpload = async (): Promise<void> => {
    await fetch("/api/football-matches", { method: "DELETE" });

    const response = await fetch("/files/CCFC_match_lineups_data.csv");
    if (!response.ok) {
        throw new Error("Failed to fetch test CSV file.");
    }

    const csvString = await response.text();
    const csvData = await processCsvData(csvString);

    await uploadDataToDatabase(csvData);
};
