const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mysql@123",
    database: "finance_tracker"
});

db.connect((err) => {
    if (err) {
        console.log("❌ Database Connection Failed:", err);
    } else {
        console.log("✅ MySQL Connected");
    }
});

module.exports = db;