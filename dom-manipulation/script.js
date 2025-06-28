// Dynamic Quote Generator with Web Storage, Filtering, and Simulated Server Sync 

// Simulated Server Data
let mockServerQuotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "This too shall pass.", category: "Life" }
];

// Load from localStorage or default 
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

//Restore last viewed quote
if (sessionStorage.getItem("lastQuote")) {
  quoteDisplay.innerHTML = sessionStorage.getItem("lastQuote");
}

//Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

//Show a random quote from selected category
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

// Add new quote and sync to server
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  syncToServer(newQuote);

  // Add category to filter if it's new
  if (![...categoryFilter.options].some(opt => opt.value === category)) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  }

  newQuoteText.value = "";
  newQuoteCategory.value = "";
  alert("Quote added!");
}

//Filter quotes and save selected category
function filterQuotes() {
  showRandomQuote();
  localStorage.setItem("lastSelectedCategory", categoryFilter.value);
}

//Populate categories from quotes
function populateCategories() {
  const categories = new Set(quotes.map(q => q.category));
  categoryFilter.innerHTML = '<option value="all">All</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const saved = localStorage.getItem("lastSelectedCategory");
  if (saved) categoryFilter.value = saved;
}

// Export quotes to a JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

//Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
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

//POST quote to mock server
async function syncToServer(newQuote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuote)
    });

    if (!response.ok) throw new Error('Failed to sync');
    console.log('Quote synced to server:', newQuote);
  } catch (error) {
    console.error('Sync error:', error);
  }
}

//Fetch and merge new quotes from mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: 'Server'
    }));

    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    serverQuotes.forEach(serverQuote => {
      const exists = localQuotes.some(local =>
        local.text === serverQuote.text &&
        local.category === serverQuote.category
      );
      if (!exists) {
        localQuotes.push(serverQuote);
        console.log("Quote added from server:", serverQuote.text);
      }
    });

    localStorage.setItem("quotes", JSON.stringify(localQuotes));
    quotes = localQuotes;
    populateCategories();
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
  }
}

//Periodic sync from server 
setInterval(fetchQuotesFromServer, 30000); // every 30s

//Initial Setup
populateCategories();
filterQuotes(); // show initial quote
fetchQuotesFromServer(); // get server updates

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categoryFilter.addEventListener("change", filterQuotes);
exportBtn.addEventListener("click", exportToJsonFile);
importInput.addEventListener("change", importFromJsonFile);
