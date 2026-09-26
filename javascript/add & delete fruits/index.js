// Add the Edit Button:
let l1 = document.querySelectorAll(".fruit");

l1.forEach((l) => {
  let btn = document.createElement("button");
  btn.innerText = "edit";
  btn.classList.add("edit-btn");
  l.appendChild(btn);

  let delBtn = l.querySelector(".delete-btn");
  delBtn.addEventListener("click", () => {
    delBtn.parentElement.remove();
  });
});

// Implement the code as in video but with one extra 'Edit' button in 'li'
const form = document.querySelector("form");
const fruits = document.querySelector(".fruits");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fruitToAdd = document.querySelector("#fruit-to-add");
  const newLi = document.createElement("li");
  const newListText = document.createTextNode(fruitToAdd.value);
  newLi.appendChild(newListText);
  newLi.classList.add("fruit");

  //delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerText = "x";
  newLi.appendChild(deleteBtn);
  deleteBtn.addEventListener("click", () => {
    deleteBtn.parentElement.remove();
  });

  //edit button
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.innerText = "edit";
  newLi.appendChild(editBtn);

  fruits.appendChild(newLi);
});
