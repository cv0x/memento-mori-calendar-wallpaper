function generateTable() {
  var tableContainer = document.getElementById("tableContainer");
  var weeksInYear = 52;
  var years = 80;
  var cols = weeksInYear;

  var tableHTML = "<table>";
  for (var i = 0; i < years; i++) {
    tableHTML += "<tr>";
    if ((i + 1) % 5 === 0 && i !== years - 1) {
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
    alert("Zadejte platné datum.");
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

  // Uložení vybraného data do localStorage
  localStorage.setItem("selectedDate", dateInput.value);
}

window.onload = function () {
  // Načtení uloženého data z localStorage
  var savedDate = localStorage.getItem("selectedDate");
  if (savedDate) {
    document.getElementById("dateInput").value = savedDate;
  }

  generateTable();
};
