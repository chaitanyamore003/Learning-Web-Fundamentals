let ul = document.querySelector("#expenseList");
let editingId = null;

//defult call to dispaly
display();

function addExpense(e) {
  //prevents form from auto submitting with POST request
  e.preventDefault();
  let form = e.target;

  let expenseList = JSON.parse(localStorage.getItem("expenseList")) || [];

  if (editingId !== null) {
    let existingExpense = expenseList.find((e) => {
      return e.id === editingId;
    });

    existingExpense.expense = form.expenseName.value;
    existingExpense.amount = form.expenseAmount.value;
    existingExpense.category = form.chooseCategory.value;

    let submitBtn = form.querySelector("#submitBtn");
    submitBtn.innerText = "Add Expense";
    editingId = null;
  } else {
    let expense = form.expenseName.value;
    let amount = form.expenseAmount.value;
    let category = form.chooseCategory.value;

    //creating a user
    let user = {
      id: Date.now(),
      expense: expense,
      amount: amount,
      category: category,
    };

    expenseList.push(user);
  }

  //saving the data
  localStorage.setItem("expenseList", JSON.stringify(expenseList));

  //displaying the list
  display();

  //reset form
  form.reset();
}

function display() {
  ul.innerHTML = "";
  let list = JSON.parse(localStorage.getItem("expenseList")) || [];

  list.forEach((e) => {
    let li = document.createElement("li");

    let text = document.createTextNode(
      e.amount + " - " + e.category + " - " + e.expense,
    );
    li.appendChild(text);

    //adding delete button
    let delBtn = document.createElement("button");
    delBtn.classList.add("delBtn");
    delBtn.innerText = "Delete";
    delBtn.dataset.id = e.id;
    delBtn.addEventListener("click", () => deleteExpense(e.id));

    li.appendChild(delBtn);

    //adding edit button
    let editBtn = document.createElement("button");
    editBtn.classList.add("editBtn");
    editBtn.innerText = "Edit";
    editBtn.dataset.id = e.id;
    editBtn.addEventListener("click", () => editExpense(e.id));

    li.appendChild(editBtn);

    //add this li to ul
    ul.appendChild(li);
  });
}

function deleteExpense(id) {
  let expenseList = JSON.parse(localStorage.getItem("expenseList")) || [];

  let updatedExpenseList = expenseList.filter((e) => {
    return e.id !== id;
  });

  localStorage.setItem("expenseList", JSON.stringify(updatedExpenseList));
  display();
}

function editExpense(id) {
  let expenseList = JSON.parse(localStorage.getItem("expenseList")) || [];

  let expense = expenseList.find((e) => {
    return e.id === id;
  });

  //id not found
  if (!expense) return;

  //if found
  //fill the data into form
  let form = document.querySelector("#inputForm");
  form.expenseName.value = expense.expense;
  form.expenseAmount.value = expense.amount;
  form.chooseCategory.value = expense.category;

  let submitBtn = form.querySelector("#submitBtn");
  submitBtn.innerText = "Update Expense";
  editingId = id;
}
