import clientPromise from "@/app/lib/mongodb";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const client = await clientPromise;

        const db = client.db("coventryCityDB");
        const result = await db.collection("football_matches").insertMany(body);

        return Response.json({ message: "Data inserted successfully", result }, { status: 201 });
    } catch (error: unknown) {
        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return Response.json({ message: errorMessage }, { status: 500 });
    }
}
