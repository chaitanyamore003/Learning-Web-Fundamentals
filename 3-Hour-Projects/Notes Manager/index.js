let baseUrl = "https://crudcrud.com/api/7bab256f95d246499eda6b36cb3daa22";

const totalNotes = document.getElementById("total-notes");
const nowShowingElement = document.getElementById("now-showing");
const addNoteForm = document.getElementById("add-note-form");

addNoteForm.addEventListener("submit", handleAddNote);

//to activate search functionality
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", filterNotes);

function filterNotes() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  const notesList = document.getElementById("notesList");
  const notes = notesList.getElementsByTagName("li");

  let nowShowingCount = 0;

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];

    const title = note.querySelector("h3").textContent.toLowerCase();
    const description = note.querySelector("p").textContent.toLowerCase();

    const matches =
      title.includes(searchTerm) || description.includes(searchTerm);

    if (matches) {
      note.style.display = "";
      nowShowingCount++;
    } else {
      note.style.display = "none";
    }
  }

  totalNotes.textContent = `Total Notes: ${notes.length}`;
  nowShowingElement.textContent = `Now Showing: ${nowShowingCount}`;
}

// Function to display notes from the API and display them
async function displayNotes() {
  try {
    const response = await axios.get(`${baseUrl}/notes`);

    const notes = response.data;

    const notesList = document.getElementById("notesList");
    notesList.innerHTML = "";

    notes.forEach((note) => {
      const noteItem = document.createElement("li");

      noteItem.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.description}</p>
      `;

      const delBtn = document.createElement("button");

      delBtn.textContent = "Delete";
      delBtn.classList.add("delete-btn");

      delBtn.addEventListener("click", () => deleteNote(note._id));

      noteItem.appendChild(delBtn);
      notesList.appendChild(noteItem);
    });

    totalNotes.textContent = `Total Notes: ${notes.length}`;
    nowShowingElement.textContent = `Now Showing: ${notes.length}`;
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
}

// Function to delete a note from the API and update the display
async function deleteNote(noteId) {
  try {
    await axios.delete(`${baseUrl}/notes/${noteId}`);
    await displayNotes();
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

// Function to add a new note to the API and update the display
async function handleAddNote(event) {
  event.preventDefault();
  const form = event.target;
  const title = form.note_title.value;
  const description = form.note_description.value;

  let newNote = {
    title: title,
    description: description,
  };

  try {
    await axios.post(`${baseUrl}/notes`, newNote);
    form.reset();
    await displayNotes();
  } catch (error) {
    console.error("Error adding note:", error);
  }
}
