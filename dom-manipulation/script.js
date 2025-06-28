// Dynamic Quote Generator with Web Storage, Filtering, and Simulated Server Sync 

// Simulated Server Data
let mockServerQuotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "This too shall pass.", category: "Life" }
];

// Local quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [...mockServerQuotes];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importFile");

// Session Storage: last viewed quote
if (sessionStorage.getItem("lastQuote")) {
  quoteDisplay.innerHTML = sessionStorage.getItem("lastQuote");
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = randomQuote.text;
  sessionStorage.setItem("lastQuote", randomQuote.text);
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  const exists = [...categoryFilter.options].some(opt => opt.value === category);
  if (!exists) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  }

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added!");
}
// Filter quotes and save selected category
function filterQuotes() {
  showRandomQuote();
  localStorage.setItem("lastSelectedCategory", categoryFilter.value);
}
// Populate categories in filter
function populateCategories() {
  const categories = new Set(quotes.map(q => q.category));
  categoryFilter.innerHTML = '<option value="all">All</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const saved = localStorage.getItem("selectedCategory");
  if (saved) categoryFilter.value = saved;
}


// Create form
function createAddQuoteForm() {
  const form = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter category";

  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  const exportButton = document.createElement("button");
  exportButton.textContent = "Export Quotes as JSON";
  exportButton.addEventListener("click", exportToJsonFile);

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.id = "importFile";
  importInput.accept = ".json";
  importInput.addEventListener("change", importFromJsonFile);

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);
  form.appendChild(exportButton);
  form.appendChild(importInput);

  document.body.appendChild(form);
}

// Export quotes to JSON
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch {
      alert("Error reading file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
// Simulate syncing to server
function syncToServer(newQuote) {
  setTimeout(() => {
    mockServerQuotes.push(newQuote);
    console.log("Synced to server:", newQuote);
  }, 500);
}
// Simulate fetching data from a server
function fetchQuotesFromServer() {
  // Simulate server data using JSONPlaceholder-like data
  const simulatedServerQuotes = [
    { text: "Do or do not. There is no try.", category: "Motivation" },
    { text: "Not all those who wander are lost.", category: "Adventure" },
  ];

  // Get current local quotes
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  // Conflict resolution: if a server quote isn't already in local, add it
  simulatedServerQuotes.forEach(serverQuote => {
    const exists = localQuotes.some(local =>
      local.text === serverQuote.text &&
      local.category === serverQuote.category
    );
    if (!exists) {
      localQuotes.push(serverQuote);
      console.log("Synced new quote from server:", serverQuote.text);
    }
  });

  // Save merged list to localStorage
  localStorage.setItem("quotes", JSON.stringify(localQuotes));

  // Refresh categories if any were new
  populateCategories();
}

// Simulate fetching updates from server
function fetchFromServer() {
  setTimeout(() => {
    const local = JSON.parse(localStorage.getItem("quotes")) || [];
    const newOnes = mockServerQuotes.filter(sq =>
      !local.some(lq => lq.text === sq.text && lq.category === sq.category)
    );
    if (newOnes.length > 0) {
      const merged = [...local, ...newOnes];
      localStorage.setItem("quotes", JSON.stringify(merged));
      quotes = merged;
      alert("New quotes synced from the server.");
      populateCategories();
    }
  }, 1000);
}
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    // Simulate converting fetched posts into quotes
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: 'Server'
    }));

    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // Merge without duplicates
    serverQuotes.forEach(serverQuote => {
      const exists = localQuotes.some(local =>
        local.text === serverQuote.text &&
        local.category === serverQuote.category
      );
      if (!exists) {
        localQuotes.push(serverQuote);
      }
    });

    // Update local storage and UI
    localStorage.setItem("quotes", JSON.stringify(localQuotes));
    populateCategories();

    console.log("Quotes synced from server.");
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
  }
}

// Periodic server sync
setInterval(fetchFromServer, 30000); 
setInterval(fetchQuotesFromServer, 10000); // every 10 seconds

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", filterQuotes);
exportBtn.addEventListener("click", exportQuotes);
importInput.addEventListener("change", importFromJsonFile);
populateCategories();
filterQuotes(); // auto-show a quote from the selected filter
fetchQuotesFromServer();

