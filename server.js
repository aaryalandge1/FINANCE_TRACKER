const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static("public"));
// Test Route
app.get("/test", (req, res) => {
    res.send("Server is working");
});


app.get("/transactions", (req, res) => {

    const sql = `
        SELECT *
        FROM transactions
        ORDER BY transaction_date DESC, id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Database Error"
            });
        }

        res.json(results);

    });

});


app.post("/transactions", (req, res) => {

    const { title, amount, transaction_date, type } = req.body;

    const sql = `
        INSERT INTO transactions
        (title, amount, transaction_date, type)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, amount, transaction_date, type],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Insert Failed"
                });
            }

            res.json({
                success: true,
                message: "Transaction Added Successfully"
            });

        }
    );

});


app.put("/transactions/:id", (req, res) => {

    const { title, amount, transaction_date, type } = req.body;

    const sql = `
        UPDATE transactions
        SET
            title = ?,
            amount = ?,
            transaction_date = ?,
            type = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            title,
            amount,
            transaction_date,
            type,
            req.params.id
        ],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Update Failed"
                });
            }

            res.json({
                success: true,
                message: "Transaction Updated Successfully"
            });

        }
    );

});


app.delete("/transactions/:id", (req, res) => {

    const sql = "DELETE FROM transactions WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Delete Failed"
            });
        }

        res.json({
            success: true,
            message: "Transaction Deleted Successfully"
        });

    });

});


const PORT = 5000;

app.listen(PORT, () => {
    console.log("✅ MySQL Connected");
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
});