const api = "http://localhost:3000/expenses";

const checkLoggedIn = () => {
  const loggedIn = localStorage.getItem("loggedIn");

  if (!loggedIn) {
    return false;
  }

  const status = JSON.parse(loggedIn);

  return status === true;
};

if (!checkLoggedIn()) {
  window.location.href = "login.html";
}

const displayExpenses = async () => {
  try {
    const response = await axios.get(api);

    const expenses = response.data.expenses;

    const expensesContainer = document.getElementById("expensesContainer");

    expensesContainer.innerHTML = "";

    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.className = "expense-item";

      li.innerHTML = `
        <div class="expense-details">
          <p><strong>Amount:</strong> ₹${expense.amount}</p>
          <p><strong>Category:</strong> ${expense.category}</p>
          <p><strong>Description:</strong> ${expense.description}</p>
        </div>

        <div class="actions">
          <button class="edit-btn" data-id="${expense.id}">Edit</button>
          <button class="delete-btn" data-id="${expense.id}">Delete</button>
        </div>
      `;

      expensesContainer.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
  }
};
