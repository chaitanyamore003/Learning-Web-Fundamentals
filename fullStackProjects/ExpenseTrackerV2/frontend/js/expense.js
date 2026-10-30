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

// Display all expenses
const displayExpenses = async () => {
  try {
    const response = await axios.get(api);
    const expenses = response.data.expenses;

    const expensesContainer = document.getElementById("expensesContainer");

    expensesContainer.innerHTML = "";

    if (expenses.length === 0) {
      expensesContainer.textContent = "No expenses added yet.";
      return;
    }

    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.className = "expense-item";

      const details = document.createElement("div");
      details.classList.add("expense-details");

      details.textContent = `${expense.category} - ₹${expense.expenseAmount} - ${expense.description}`;

      li.appendChild(details);

      // Actions container
      const actions = document.createElement("div");
      actions.classList.add("actions");

      // Edit button
      const editBtn = document.createElement("button");
      editBtn.classList.add("edit-btn");
      editBtn.textContent = "Edit Expense";

      editBtn.addEventListener("click", () => {
        editExpense(expense.id);
      });

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete Expense";

      deleteBtn.addEventListener("click", () => {
        deleteExpense(expense.id);
      });

      actions.append(editBtn, deleteBtn);
      li.appendChild(actions);

      expensesContainer.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
  }
};

// Add expense
const addExpense = async (e) => {
  e.preventDefault();

  try {
    const amount = e.target.amount.value;
    const category = e.target.category.value;
    const description = e.target.description.value;

    const response = await axios.post(`${api}/add`, {
      amount,
      category,
      description,
    });

    e.target.reset();

    document.getElementById("responseMessage").textContent =
      response.data.message;

    await displayExpenses();
  } catch (error) {
    console.error("Failed to add expense:", error);
  }
};

// Initial fetch
displayExpenses();
