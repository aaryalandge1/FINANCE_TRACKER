let chart;
const list = document.getElementById("transactionList");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const balance = document.getElementById("balance");

let editId = null;


async function loadTransactions() {

    const res = await fetch("/transactions");
    const data = await res.json();

    list.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    data.forEach((t) => {

        const date = new Date(t.transaction_date);

        const formattedDate = date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        if (t.type === "Income") {
            totalIncome += Number(t.amount);
        } else {
            totalExpense += Number(t.amount);
        }

        list.innerHTML += `
        <li class="${t.type === "Income" ? "income-item" : "expense-item"}">

            <div>

                <strong>${t.title}</strong><br>

                ₹${t.amount} (${t.type})<br>

                📅 ${formattedDate}

            </div>

            <div class="buttons">

                <button
                    class="edit-btn"
                    onclick="editTransaction(
                        ${t.id},
                        '${t.title}',
                        ${t.amount},
                        '${t.type}',
                        '${t.transaction_date}'
                    )">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${t.id})">
                    Delete
                </button>

            </div>

        </li>
        `;
    });

    income.innerText = "₹" + totalIncome;
    expense.innerText = "₹" + totalExpense;
    balance.innerText = "₹" + (totalIncome - totalExpense);


    updateChart(totalIncome, totalExpense);

}



async function addTransaction() {

    const title = document.getElementById("title").value;
    const amount = document.getElementById("amount").value;
    const transaction_date = document.getElementById("transaction_date").value;
    const type = document.getElementById("type").value;

    if (!title || !amount || !transaction_date) {
        alert("Please fill all fields");
        return;
    }

    // UPDATE
    if (editId !== null) {

        await fetch("/transactions/" + editId, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                title,
                amount,
                transaction_date,
                type

            })

        });

        editId = null;

        document.querySelector(".form button").innerText = "Add Transaction";

    }

    // ADD
    else {

        await fetch("/transactions", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                title,
                amount,
                transaction_date,
                type

            })

        });

    }

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("transaction_date").value = "";
    document.getElementById("type").value = "Expense";

    loadTransactions();

}



function editTransaction(id, title, amount, type, transaction_date) {

    editId = id;

    document.getElementById("title").value = title;
    document.getElementById("amount").value = amount;
    document.getElementById("transaction_date").value =
        transaction_date.split("T")[0];

    document.getElementById("type").value = type;

    document.querySelector(".form button").innerText =
        "Update Transaction";

}



async function deleteTransaction(id) {

    await fetch("/transactions/" + id, {

        method: "DELETE"

    });

    loadTransactions();

}


loadTransactions();


const toggleBtn = document.getElementById("toggleBtn");
const transactionBox = document.getElementById("transactionBox");

toggleBtn.addEventListener("click", () => {

    if (transactionBox.style.display === "none") {

        transactionBox.style.display = "block";
        toggleBtn.innerHTML = "❌ Hide Transactions";

    } else {

        transactionBox.style.display = "none";
        toggleBtn.innerHTML = "📋 View Transactions";

    }

});


function updateChart(totalIncome, totalExpense) {

    const ctx = document.getElementById("expenseChart");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: ["Income", "Expense"],

            datasets: [{

                data: [totalIncome, totalExpense],

                backgroundColor: [
                    "#22c55e",
                    "#ef4444"
                ],

                borderColor: "#1E293B",
                borderWidth: 3

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        color: "white",
                        font: {
                            size: 16
                        }

                    }

                }

            }

        }

    });

}