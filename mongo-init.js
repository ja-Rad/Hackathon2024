// Switch to the database that should be created
db = db.getSiblingDB("coventryCityDB");

// Create the user with readWrite access to the "coventryCityDB"
db.createUser({
    user: "dbuser",
    pwd: "dbpassword",
    roles: [
        {
            role: "readWrite",
            db: "coventryCityDB",
        },
    ],
});

// Create a collection to initialize the database
// It is used only to test db
db.createCollection("football_matches");

// Insert some sample data to ensure the database is initialized
// db.testCollection.insertMany([
//     { name: "Test Data 1", value: 123 },
//     { name: "Test Data 2", value: 456 },
// ]);
