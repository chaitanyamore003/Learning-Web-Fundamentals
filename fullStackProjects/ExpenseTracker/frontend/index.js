const backendApi = "http://localhost:3000";
let editId = null;

const expensesList = document.getElementById("expensesList");
const form = document.querySelector("form");
const submitButton = form.querySelector("button[type='submit']");

const displayExpenses = async () => {
  try {
    const response = await axios.get(`${backendApi}/expenses/1`);
    const expenses = response.data.expenses;

    expensesList.innerHTML = "";

    expenses.forEach((element) => {
      const li = document.createElement("li");

      const details = document.createElement("span");
      details.textContent = `${element.name} - ₹${element.amount}`;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => editExpense(element);
      editBtn.id = "editBtn";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteExpense(element.id);
      deleteBtn.id = "deleteBtn";

      const actions = document.createElement("div");
      actions.className = "expense-actions";
      actions.append(editBtn, deleteBtn);

      li.append(details, actions);
      expensesList.appendChild(li);
    });
  } catch (err) {
    console.log(err);
  }
};

const formSubmit = async (e) => {
  e.preventDefault();

  const name = form.name.value;
  const amount = form.amount.value;

  try {
    if (editId !== null) {
      await axios.put(`${backendApi}/expenses/update/${editId}`, {
        name,
        amount,
      });

      editId = null;
      submitButton.innerText = "Add Expense";
    } else {
      await axios.post(`${backendApi}/expenses/add`, {
        name,
        amount,
        userId: 1,
      });
    }

    form.reset();
    await displayExpenses();
  } catch (err) {
    console.log(err);
  }
};

const editExpense = (ele) => {
  form.name.value = ele.name;
  form.amount.value = ele.amount;

  editId = ele.id;
  submitButton.innerText = "Update Expense";
};

const deleteExpense = async (expenseId) => {
  try {
    await axios.delete(`${backendApi}/expenses/delete/${expenseId}`);

    await displayExpenses();
  } catch (err) {
    console.log(err);
  }
};

displayExpenses();
