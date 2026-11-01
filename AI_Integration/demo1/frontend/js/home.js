const api = "http://localhost:3000/api/ai";

const generateResponse = async () => {
  const prompt = document.getElementById("prompt").value.trim();
  const button = document.getElementById("generateBtn");
  const responseBox = document.getElementById("responseBox");
  const responseElement = document.getElementById("response");

  if (!prompt) {
    alert("Please enter a prompt!");
    return;
  }

  button.disabled = true;
  button.textContent = "Generating...";
  responseBox.style.display = "block";
  responseElement.classList.remove("error");
  responseElement.textContent =
    "Please wait, AI is generating your response...";

  try {
    const result = await fetch(`${api}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await result.json();

    if (!result.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    responseElement.textContent = data.response;
  } catch (error) {
    responseElement.classList.add("error");
    responseElement.textContent = error.message;
  } finally {
    button.disabled = false;
    button.textContent = "Generate Response";
  }
};
