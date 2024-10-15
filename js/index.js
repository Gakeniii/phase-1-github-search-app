document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const userList = document.getElementById("user-list");
  const repoList = document.getElementById("repo-list");

  // Function to search users by name
  async function searchUsers(query) {
    const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }
    });
    const data = await response.json();
    return data.items; // Return user items
  }

  // Function to fetch repositories for a user
  async function fetchUserRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }
    });
    const data = await response.json();
    return data; // Return repositories
  }

  // Event listener for form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    userList.innerHTML = ""; // Clear previous results
    const query = event.target.elements[0].value; // Get the search input value

    // Fetch users
    const users = await searchUsers(query);
    
    // Display users
    users.forEach(user => {
      const userItem = document.createElement("div");
      userItem.classList.add("user-item");
      userItem.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" width="50">
        <a href="${user.html_url}" target="_blank">${user.login}</a>
      `;
      userItem.addEventListener("click", async () => {
        const repos = await fetchUserRepos(user.login);
        displayRepos(repos);
      });
      userList.appendChild(userItem);
    });
  });

  // Function to display user repositories
  function displayRepos(repos) {
    repoList.innerHTML = ""; // Clear previous repositories
    repos.forEach(repo => {
      const repoItem = document.createElement("div");
      repoItem.classList.add("repo-item");
      repoItem.innerHTML = `
        <strong>${repo.name}</strong>: <a href="${repo.html_url}" target="_blank">View Repo</a>
      `;
      repoList.appendChild(repoItem);
    });
  }
});
