// Initial list of quotes
const quotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "This too shall pass.", category: "Life" },
];

// Get references to HTML elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// Function to show a random quote based on selected category
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;

  let filtered;

  if (selectedCategory === "all") {
    filtered = quotes;
  } else {
    filtered = quotes.filter(function (q) {
      return q.category.toLowerCase() === selectedCategory.toLowerCase();
    });
  }

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = randomQuote.text;
}

// Function to add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });

  const exists = [...categoryFilter.options].some(function (opt) {
    return opt.value === category;
  });

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

// Function to create the form for adding a new quote
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

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);

  document.body.appendChild(form);

  addButton.addEventListener("click", addQuote);
}

// Run on load
newQuoteBtn.addEventListener("click", showRandomQuote);
createAddQuoteForm();

