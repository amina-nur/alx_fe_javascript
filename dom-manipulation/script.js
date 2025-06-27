// Initial list of quotes
const quotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "This too shall pass.", category: "Life" },
];

// Get references to HTML elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// Function to show a random quote based on selected category
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;

  let filtered; // We'll store the filtered quotes here

  if (selectedCategory === "all") {
    filtered = quotes; // Use the full list
  } else {
    filtered = quotes.filter(function(q) {
      return q.category.toLowerCase() === selectedCategory.toLowerCase();
    });
  }

  // If no quotes in selected category
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  // Pick and show a random quote
  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = randomQuote.text;
}

// Function to add a new quote
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  // Add the new quote to the array
  quotes.push({ text, category });

  // Check if the category exists in the dropdown
  const exists = [...categoryFilter.options].some(function(opt) {
    return opt.value === category;
  });

  // If not, add the new category to the dropdown
  if (!exists) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  }

  // Clear the input fields
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("Quote added!");
}

// Listen for button clicks
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
