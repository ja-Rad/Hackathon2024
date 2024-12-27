import clientPromise from "@/app/lib/mongodb";

export async function DELETE() {
    try {
        const client = await clientPromise;
        const db = client.db("coventryCityDB");
        const result = await db.collection("football_matches").deleteMany({});

        return Response.json({ message: "All documents deleted", deletedCount: result.deletedCount });
    } catch (error: unknown) {
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return Response.json({ message: errorMessage }, { status: 500 });
    }
}
