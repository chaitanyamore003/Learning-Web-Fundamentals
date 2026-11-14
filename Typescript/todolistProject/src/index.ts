const tasklist = document.querySelector<HTMLUListElement>("#task-list");
const form = document.querySelector<HTMLFormElement>("#task-form");
const taskName = document.querySelector<HTMLInputElement>("#task-name");
const dueDate = document.querySelector<HTMLInputElement>("#due-date");
let emptyMessage =
  document.querySelector<HTMLParagraphElement>("#empty-message");

interface Task {
  id: number;
  name: string;
  dueDate: string;
  completed: boolean;
}

// Retrieve tasks from localStorage.
const getTasks = (): Task[] => {
  const storedTasks = localStorage.getItem("tasklist");

  if (storedTasks) {
    return JSON.parse(storedTasks) as Task[];
  }

  return [];
};

// Add a new task.
const addTasks = (): void => {
  const name: string = taskName?.value.trim() ?? "";
  const date: string = dueDate?.value ?? "";

  if (!name || !date) {
    alert("Please enter task name and due date.");
    return;
  }

  const newTask: Task = {
    id: Date.now(),
    name: name,
    dueDate: date,
    completed: false,
  };

  const tasks = getTasks();
  tasks.push(newTask);

  localStorage.setItem("tasklist", JSON.stringify(tasks));

  display();
  form?.reset();
};

// Render tasks in the UI.
const display = (): void => {
  if (!tasklist) return;

  const tasks = getTasks();

  tasklist.innerHTML = "";

  if (emptyMessage) {
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
  }

  tasks.forEach((t: Task) => {
    const listEle = document.createElement("li");
    listEle.classList.add("list-ele");

    const text = document.createElement("span");
    text.textContent = `${t.name} - ${t.dueDate}`;

    listEle.appendChild(text);

    const completed = document.createElement("input");
    completed.type = "checkbox";
    completed.checked = t.completed;

    completed.addEventListener("change", (): void => {
      const updatedTasks = tasks.map((task: Task) => {
        if (task.id === t.id) {
          return {
            ...task,
            completed: completed.checked,
          };
        }

        return task;
      });

      localStorage.setItem("tasklist", JSON.stringify(updatedTasks));
      display();
    });

    listEle.appendChild(completed);

    const delBtn = document.createElement("button");
    delBtn.innerText = "DELETE";
    delBtn.classList.add("del-btn");

    delBtn.addEventListener("click", (): void => {
      deleteTask(t.id);
    });

    listEle.appendChild(delBtn);
    tasklist.appendChild(listEle);
  });
};

// Delete a task using its ID.
const deleteTask = (id: number): void => {
  const tasks = getTasks();

  const updatedTasks = tasks.filter((t: Task) => {
    return t.id !== id;
  });

  localStorage.setItem("tasklist", JSON.stringify(updatedTasks));

  display();
};

form?.addEventListener("submit", (event: SubmitEvent): void => {
  event.preventDefault();
  addTasks();
  form.reset();
});

// Display saved tasks when the application loads.
display();
