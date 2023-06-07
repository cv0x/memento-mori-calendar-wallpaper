function generateTable() {
  var tableContainer = document.getElementById("tableContainer");
  var weeksInYear = 52;
  var years = 80 + 7;
  var cols = weeksInYear;

  var tableHTML = "<table>";
  for (var i = 0; i < years; i++) {
    tableHTML += "<tr>";
    if ((i + 1) % 11 === 0 && i !== years - 1) {
      tableHTML += "<td class='empty-row' colspan='" + cols + "'></td>";
    } else {
      for (var j = 0; j < cols; j++) {
        tableHTML += "<td></td>";
      }
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";

  tableContainer.innerHTML = tableHTML;

  highlightCells();
}

function highlightCells() {
  var dateInput = document.getElementById("dateInput");
  var tableContainer = document.getElementById("tableContainer");
  var cells = tableContainer.getElementsByTagName("td");

  var selectedDate = new Date(dateInput.value);
  if (isNaN(selectedDate)) {
    alert("Enter a valid date.");
    return;
  }

  var today = new Date();

  for (var i = 0; i < cells.length; i++) {
    var cellDate = new Date(
      selectedDate.getTime() + i * (1000 * 60 * 60 * 24 * 7)
    );
    if (cellDate <= today && !cells[i].classList.contains("empty-row")) {
      cells[i].classList.add("highlight");
    } else {
      cells[i].classList.remove("highlight");
    }
  }

  // save data to localStorage
  localStorage.setItem("selectedDate", dateInput.value);
}

window.onload = function () {
  // load data from localStorage
  var savedDate = localStorage.getItem("selectedDate");
  if (savedDate) {
    document.getElementById("dateInput").value = savedDate;
  }

  generateTable();
};

//toggle icon menu
let menuIcon = document.querySelector("#menu-icon");
let menu = document.querySelector(".menu");

menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  menu.classList.toggle("active");
};

//daily quotes
var quotes = [
  " I learned that courage was not the absence of fear, but the triumph over it. The brave man is not he who does not feel afraid, but he who conquers that fear.  -Nelson Mandela",
  " If you believe it will work, you'll see opportunities. If you believe it won't, you will see obstacles. -Wayne Dyer",
  " Believe you can and you're halfway there. -Theodore Roosevelt",
];

// Funkce pro náhodný výběr citátu
function takeRandomQuotes() {
  var index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

// Aktualizace citátu při načtení stránky
$(document).ready(function () {
  var todayQuotes = takeRandomQuotes();
  $("#quotes").text(todayQuotes);
});

// Aktualizace citátu každý den v půlnoci
setInterval(function () {
  var todayQuotes = takeRandomQuotes();
  $("#quotes").text(todayQuotes);
}, 24 * 60 * 60 * 1000); // 24 hodin * 60 minut * 60 sekund * 1000 milisekund
