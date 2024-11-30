const mysql = require("mysql2/promise"); // Install mysql2 for database connection

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed",
        };
    }

    // Parse incoming form data
    const { name, email, message } = JSON.parse(event.body);

    // Validate inputs
    if (!name || !email || !message) {
        return {
            statusCode: 400,
            body: JSON.stringify({ status: "error", message: "All fields are required." }),
        };
    }

    try {
        // Connect to your MySQL database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Insert data into the database
        const query = "INSERT INTO contact_form (name, email, message) VALUES (?, ?, ?)";
        await connection.execute(query, [name, email, message]);

        // Close the connection
        await connection.end();

        return {
            statusCode: 200,
            body: JSON.stringify({ status: "success", message: "Message sent successfully!" }),
        };
    } catch (error) {
        console.error("Database error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ status: "error", message: "Failed to send message." }),
        };
    }
};
