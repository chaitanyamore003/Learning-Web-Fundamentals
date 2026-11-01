const token = localStorage.getItem("token");

// Redirect to login if the user is not authenticated
if (!token) {
  window.location.href = "login.html";
}

// Configure Axios
const premiumApi = axios.create({
  baseURL: "http://localhost:3000/premium",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// DOM elements
const leaderboardContainer = document.getElementById("leaderboard");
const message = document.getElementById("message");

// Fetch leaderboard data
const getLeaderboard = async () => {
  try {
    const response = await premiumApi.get("/getLeaderboard");

    const leaderboard = response.data.leaderboard;

    // Clear loading message
    leaderboardContainer.innerHTML = "";

    if (!leaderboard || leaderboard.length === 0) {
      leaderboardContainer.innerHTML = `
                <p id="message">No leaderboard data available.</p>
            `;
      return;
    }

    // Display each user
    leaderboard.forEach((user, index) => {
      const row = document.createElement("div");
      row.classList.add("leaderboard-row");

      const rank = document.createElement("span");
      rank.classList.add("rank");

      // Display medals for the top three users
      const medals = ["🥇", "🥈", "🥉"];
      rank.textContent = medals[index] || `#${index + 1}`;

      const userName = document.createElement("span");
      userName.classList.add("user-name");
      userName.textContent = user.name;

      const totalExpense = document.createElement("span");
      totalExpense.classList.add("total-expense");

      totalExpense.textContent = `₹${Number(user.totalExpense).toLocaleString(
        "en-IN",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      )}`;

      row.append(rank, userName, totalExpense);

      leaderboardContainer.appendChild(row);
    });
  } catch (error) {
    console.error(
      "Failed to fetch leaderboard:",
      error.response?.data || error,
    );

    leaderboardContainer.innerHTML = "";

    const errorMessage = document.createElement("p");
    errorMessage.id = "message";
    errorMessage.classList.add("error");

    if (error.response?.status === 401) {
      errorMessage.textContent = "Session expired. Please log in again.";
      localStorage.removeItem("token");

      leaderboardContainer.appendChild(errorMessage);

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);

      return;
    }

    if (error.response?.status === 403) {
      errorMessage.textContent =
        "Premium membership is required to access the leaderboard.";
    } else {
      errorMessage.textContent =
        "Unable to load leaderboard. Please try again.";
    }

    leaderboardContainer.appendChild(errorMessage);
  }
};

// Load leaderboard when page opens
getLeaderboard();
