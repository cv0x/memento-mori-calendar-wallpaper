// Import quotes from external file
import quotes from "./quotes.js";

// Main function to generate the life calendar table
function generateTable() {
  const tableContainer = document.getElementById("tableContainer");
  const weeksInYear = 52; // Number of weeks in a year
  const years = 87; // Total years to display (80 + 7 buffer years)
  const cols = weeksInYear;

  let tableHTML = "<table>"; // Start building table HTML

  // Generate rows for each year of life
  for (let i = 0; i < years; i++) {
    tableHTML += "<tr>";

    // Add empty spacer row every 11 years for better readability
    if ((i + 1) % 11 === 0 && i !== years - 1) {
      tableHTML += `<td class="empty-row" colspan="${cols}"></td>`;
    } else {
      // Generate week cells for each year
      for (let j = 0; j < cols; j++) {
        tableHTML += "<td></td>";
      }
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";

  tableContainer.innerHTML = tableHTML; // Insert table into DOM
  highlightCells(); // Apply initial highlighting
}

// Initialize date selection inputs
function initializeDateInputs() {
  const daySelect = document.getElementById("dayInput");
  const monthSelect = document.getElementById("monthInput");
  const yearSelect = document.getElementById("yearInput");

  // Populate day dropdown (1-31)
  for (let i = 1; i <= 31; i++) {
    daySelect.appendChild(new Option(i, i));
  }

  // Populate month dropdown with names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  months.forEach((month, index) => {
    monthSelect.appendChild(new Option(month, index + 1));
  });

  // Populate year dropdown (current year to 1900)
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 1900; i--) {
    yearSelect.appendChild(new Option(i, i));
  }

  // Add event listeners for real-time updates
  [daySelect, monthSelect, yearSelect].forEach((input) => {
    input.addEventListener("change", highlightCells);
  });
}

// Highlight cells based on selected birthdate
function highlightCells() {
  const day = document.getElementById("dayInput").value;
  const month = document.getElementById("monthInput").value;
  const year = document.getElementById("yearInput").value;

  // Exit if any date component is missing
  if (!day || !month || !year) return;

  // Create Date object (months are 0-based in JS)
  const selectedDate = new Date(year, month - 1, day);
  const today = new Date();

  // Validate date (handle invalid dates like February 30)
  if (
    selectedDate.getDate() != day ||
    selectedDate.getMonth() + 1 != month ||
    selectedDate.getFullYear() != year
  )
    return;

  const cells = document.querySelectorAll("#tableContainer td");
  let weekCounter = 0; // Track actual weeks (ignores spacer rows)

  cells.forEach((cell) => {
    if (cell.classList.contains("empty-row")) return;

    // Calculate date for current cell (each cell = 1 week)
    const cellDate = new Date(selectedDate);
    cellDate.setDate(selectedDate.getDate() + weekCounter * 7);

    // Toggle highlight based on whether date is in past
    cell.classList.toggle("highlight", cellDate <= today);

    weekCounter++; // Increment week counter
  });

  // Save to localStorage as single JSON object
  localStorage.setItem("birthDate", JSON.stringify({ day, month, year }));
}

// Load saved date from localStorage
function loadSavedDate() {
  const saved = localStorage.getItem("birthDate");
  if (saved) {
    const { day, month, year } = JSON.parse(saved);
    document.getElementById("dayInput").value = day;
    document.getElementById("monthInput").value = month;
    document.getElementById("yearInput").value = year;
  }
}

// Initialize application when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  initializeDateInputs();
  loadSavedDate();
  generateTable();
});

// Mobile menu toggle functionality
document.querySelector("#menu-icon").addEventListener("click", () => {
  document.querySelector(".menu").classList.toggle("active");
});

// Get random quote from quotes array
function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Initialize quotes functionality
document.addEventListener("DOMContentLoaded", () => {
  const quoteElement = document.getElementById("quotes");
  // Set initial quote
  quoteElement.textContent = getRandomQuote();

  // Update quote every 24 hours
  setInterval(() => {
    quoteElement.textContent = getRandomQuote();
  }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
});
