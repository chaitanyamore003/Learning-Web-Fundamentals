// ============================================================
// 1. AUTHENTICATION
// ============================================================

// Retrieve the JWT token stored after successful login.
const token = localStorage.getItem("token");

// Redirect unauthenticated users to the login page.
if (!token) {
  window.location.href = "login.html";
}

// ============================================================
// 2. AXIOS API INSTANCES
// ============================================================

// Axios instance for expense-related operations.
const api = axios.create({
  baseURL: "http://localhost:3000/expenses",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Axios instance for Cashfree payment operations.
const paymentApi = axios.create({
  baseURL: "http://localhost:3000/payment",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Axios instance for premium-related operations.
const premiumApi = axios.create({
  baseURL: "http://localhost:3000/premium",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// ============================================================
// 3. DOM ELEMENTS
// ============================================================

const buyPremiumBtn = document.getElementById("buyPremiumBtn");
const viewLeaderboardBtn = document.getElementById("viewLeaderboardBtn");
const expensesContainer = document.getElementById("expensesContainer");
const responseMessage = document.getElementById("responseMessage");

// ============================================================
// 4. CASHFREE INITIALIZATION
// ============================================================

// Initialize Cashfree in Sandbox mode for testing payments.
const cashfree = Cashfree({
  mode: "sandbox",
});

// ============================================================
// 5. CHECK PREMIUM MEMBERSHIP STATUS
// ============================================================

const checkPremiumStatus = async () => {
  try {
    // Fetch the currently authenticated user's profile.
    // Assumes GET /users/me returns { success: true, user: {...} }.
    const response = await axios.get("http://localhost:3000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = response.data.user;

    // Display buttons according to the user's membership status.
    if (user.isPremium) {
      buyPremiumBtn.hidden = true;
      viewLeaderboardBtn.hidden = false;
    } else {
      buyPremiumBtn.hidden = false;
      viewLeaderboardBtn.hidden = true;
    }
  } catch (error) {
    console.error("Failed to fetch premium status:", error);

    // Do not expose the leaderboard if membership
    // status could not be verified.
    viewLeaderboardBtn.hidden = true;
  }
};

// ============================================================
// 6. BUY PREMIUM MEMBERSHIP
// ============================================================

buyPremiumBtn.addEventListener("click", async () => {
  try {
    // Disable the button to prevent repeated order creation.
    buyPremiumBtn.disabled = true;
    buyPremiumBtn.textContent = "Processing...";

    // Step 1: Request the backend to create a Cashfree order.
    const response = await paymentApi.post("/create-order", {});

    const { paymentSessionId, orderId } = response.data;

    // Ensure that Cashfree returned a valid payment session.
    if (!paymentSessionId) {
      throw new Error("Payment session ID not received");
    }

    console.log("Order created successfully:", orderId);

    // Step 2: Open Cashfree's hosted checkout page.
    // Cashfree redirects the user after checkout.
    await cashfree.checkout({
      paymentSessionId,
      redirectTarget: "_self",
    });
  } catch (error) {
    console.error("Payment initiation failed:", error.response?.data || error);

    alert(
      error.response?.data?.message ||
        "Unable to initiate payment. Please try again.",
    );

    // Re-enable the button if payment initiation fails.
    buyPremiumBtn.disabled = false;
    buyPremiumBtn.textContent = "✦ Buy Premium";
  }
});

// ============================================================
// 7. LEADERBOARD NAVIGATION
// ============================================================

// Navigate to the leaderboard page when clicked.
// The backend must independently verify premium membership.
viewLeaderboardBtn.addEventListener("click", () => {
  window.location.href = "leaderboard.html";
});

// ============================================================
// 8. DISPLAY ALL EXPENSES
// ============================================================

const displayExpenses = async () => {
  try {
    // Fetch all expenses belonging to the authenticated user.
    const response = await api.get("/");

    const expenses = response.data.expenses;

    // Clear previously displayed expenses before rendering.
    expensesContainer.innerHTML = "";

    // Display a message when the user has no expenses.
    if (expenses.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.className = "empty-message";
      emptyMessage.textContent = "No expenses added yet.";

      expensesContainer.appendChild(emptyMessage);
      return;
    }

    // Create an individual list item for each expense.
    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.className = "expense-item";

      // Display expense details.
      const details = document.createElement("div");
      details.className = "expense-details";

      details.textContent = `${expense.category} - ₹${expense.expenseAmount} - ${expense.description}`;

      li.appendChild(details);

      // Container for Edit and Delete buttons.
      const actions = document.createElement("div");
      actions.className = "actions";

      // Edit button.
      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit Expense";

      editBtn.addEventListener("click", () => {
        editExpense(expense.id);
      });

      // Delete button.
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete Expense";

      deleteBtn.addEventListener("click", () => {
        deleteExpense(expense.id);
      });

      actions.append(editBtn, deleteBtn);
      li.appendChild(actions);

      // Append the completed expense item to the list.
      expensesContainer.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to fetch expenses:", error);

    expensesContainer.textContent =
      "Unable to load expenses. Please try again.";
  }
};

// ============================================================
// 9. ADD NEW EXPENSE
// ============================================================

const addExpense = async (e) => {
  // Prevent the browser's default form submission/reload.
  e.preventDefault();

  try {
    // Retrieve values from the expense form.
    const amount = e.target.amount.value;
    const category = e.target.category.value;
    const description = e.target.description.value;

    // Send the new expense to the backend.
    const response = await api.post("/add", {
      amount,
      category,
      description,
    });

    // Clear the form after successful insertion.
    e.target.reset();

    // Display the backend's success message.
    responseMessage.textContent = response.data.message;

    // Refresh the expense list to display the new expense.
    await displayExpenses();
  } catch (error) {
    console.error("Failed to add expense:", error);

    responseMessage.textContent =
      error.response?.data?.message ||
      "Unable to add expense. Please try again.";
  }
};

// ============================================================
// 10. DELETE EXPENSE
// ============================================================

const deleteExpense = async (expenseId) => {
  // Ask the user for confirmation before deleting.
  const confirmed = confirm("Are you sure you want to delete this expense?");

  if (!confirmed) return;

  try {
    // Send the delete request to the backend.
    await api.delete(`/delete/${expenseId}`);

    // Refresh the expense list after successful deletion.
    await displayExpenses();
  } catch (error) {
    console.error("Failed to delete expense:", error);

    alert(error.response?.data?.message || "Unable to delete expense.");
  }
};

// ============================================================
// 11. INITIALIZE DASHBOARD
// ============================================================

// Run these operations only when the user is authenticated.
if (token) {
  // Fetch the user's premium status and configure buttons.
  checkPremiumStatus();

  // Fetch and display the user's expenses.
  displayExpenses();
}
