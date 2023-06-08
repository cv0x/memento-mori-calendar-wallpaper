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
  "“Imagine smiling after a slap in the face. Then think of doing it twenty-four hours a day.” ― Markus Zusak, The Book Thief",
  "“If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.” ― Marcus Aurelius, Meditations",
  "“Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present.” ― Marcus Aurelius, Meditations",
  "“It is the power of the mind to be unconquerable.”― Seneca, The Stoic Philosophy of Seneca: Essays and Letters",
  "“Warriors should suffer their pain silently.” ― Erin Hunter, Into the Wild",
  "“Until we have begun to go without them, we fail to realize how unnecessary many things are. We've been using them not because we needed them but because we had them.” ― Lucius Annaeus Seneca, Letters from a Stoic",
  "“Feeling too much is a hell of a lot better than feeling nothing.” ― Nora Roberts, Midnight Bayou",
  "“The things you think about determine the quality of your mind.” ― Marcus Aurelius, Meditations",
  "“Always resignation and acceptance. Always prudence and honour and duty. Elinor, where is your heart?” ― Jane Austen, Sense and Sensibility",
  "“Misfortune nobly born is good fortune.” ― Marcus Aurelius, Meditations",
  "“Regard [a friend] as loyal, and you will make him loyal.” ― Lucius Annaeus Seneca, Letters from a Stoic",
  "“What really frightens and dismays us is not external events themselves, but the way in which we think about them. It is not things that disturb us, but our interpretation of their significance.” ― Epictetus",
  "“You should … live in such a way that there is nothing which you could not as easily tell your enemy as keep to yourself.” ― Lucius Annaeus Seneca, Letters from a Stoic",
  "“Nothing is burdensome if taken lightly, and nothing need arouse one's irritation so long as one doesn't make it bigger than it is by getting irritated.” ― Lucius Annaeus Seneca, Letters from a Stoic",
  "“To be everywhere is to be nowhere.” ― Lucius Annaeus Seneca, Letters from a Stoic",
  "“Stop wandering about! You aren't likely to read your own notebooks, or ancient histories, or the anthologies you've collected to enjoy in your old age. Get busy with life's purpose, toss aside empty hopes, get active in your own rescue-if you care for yourself at all-and do it while you can.” ― Marcus Aurelius, Meditations",
  "“From the philosopher Catulus, never to be dismissive of a friend's accusation, even if it seems unreasonable, but to make every effort to restore the relationship to its normal condition.” ― Marcus Aurelius, Meditations",
  "“Today I escaped anxiety. Or no, I discarded it, because it was within me, in my own perceptions — not outside.” ― Marcus Aurelius, Meditations",
  "“If what you have seems insufficient to you, then though you possess the world, you will yet be miserable.” ― Seneca",
  "“It is more necessary for the soul to be cured than the body; for it is better to die than to live badly.” ― Epictetus",
  "“For death remembered should be like a mirror, Who tells us life’s but breath, to trust it error.” ― William Shakespeare, Pericles",
  "“Thoroughly convinced of the impossibility of his own suit, a high resolve constrained him not to injure that of another. This is a lover's most stoical virtue, as the lack of it is a lover's most venial sin.” ― Thomas Hardy, Far From the Madding Crowd",
  "“When a dog is tied to a cart, if it wants to follow, it is pulled and follows, making its spontaneous act coincide with necessity. But if the dog does not follow, it will be compelled in any case. So it is with men too: even if they don't want to, they will be compelled to follow what is destined.” ― Zeno of Citium",
  "“Philosophy does not promise to secure anything external for man, otherwise it would be admitting something that lies beyond its proper subject-matter. For as the material of the carpenter is wood, and that of statuary bronze, so the subject-matter of the art of living is each person's own life.” ― Epictetus",
  "“Concern should drive us into action and not into a depression. No man is free who cannot control himself.” ― Pythagoras, The Big Book of Ancient Classics: Contains the works of Aristotle, Plato, Homer, Aeschylus...",
  "“It is quite possible to be a good man without anyone realizing it.” ― Marcus Aurelius, Meditations: A New Translation",
  "“Nothing, to my way of thinking, is a better proof of a well ordered mind than a man’s ability to stop just where he is and pass some time in his own company.” ― Seneca",
  "“Maximum remedium est irae mora.” ― Lucius Annaeus Seneca",
  "“For in this Case, we are not to give Credit to the Many, who say, that none ought to be educated but the Free; but rather to the Philosophers, who say, that the Well-educated alone are free.” ― Epictetus, All the Works of Epictetus",
  "“And why should we feel anger at the world? As if the world would notice.” ― Marcus Aurelius, Meditations: A New Translation",
  "“Don't be overheard complaining ... not even to yourself.” ― Marcus Aurelius, Meditations by Marcus Aurelius",
  "“Sometimes silence is a sign, not of not knowing what to say, but of knowing when to say what you know.” ― Mokokoma Mokhonoana",
  "“Forever seeking, forever moving forward. To strive, to struggle.” ― Shonjuk Chakma",
  "“It is better to be despised for simplicity than to suffer agonies from everlasting pretense.” ― Seneca, Dialogues and Letters",
  "“If you are told that such an one speaks ill of you, make no defence against what was said, but answer, He surely knew not my other faults, else he would not have mentioned these only!” ― Epictetus",
  "“Associate with those who will make a better of man. Welcome those whom yourself can improve. Men learn while they teach.” ― Seneca",
  "“If it should ever happen to you to be turned to externals in order to please some person, you must know that you have lost your purpose in life.” ― Epictetus, Discourse of Epictetus: Selections",
  "“Every life without exception is a short one.” ― Seneca, Letters from a Stoic",
  "“You are scared of dying - and, tell me, is the kind of life you lead really any different from being dead?” ― Seneca, Letters from a Stoic",
  "“There was an iron simplicty in the seer. He was like a monolith of logic standing against waves of angry nonsense.” ― John Steinbeck",
  "“You could leave life right now. Let that determine what you do and say and think.” ― Marcus Aurelius",
  "“It isn't manly to be enraged. Rather gentleness and civility are more human, therefrom more manly.” ― Marcus Aurelius",
  "“Better to trip with the feet than with the tongue.” ― Zeno of Citium",
  "“We are food even before we are dead.” ― Mokokoma Mokhonoana",
  "“We cannot but obey the powers above us. Could I rage and roar as doth the sea She lies in, yet the end must be as ’tis.” ― William Shakespeare, Pericles",
  "“We live life passively whenever we are not practicing mindfulness.” ― Mokokoma Mokhonoana",
  "“Each of us lives only now, this brief instant. The rest has been lived already, or is impossible to see.” ― Marcus Aurelius, Meditations",
  "“Today I escaped from anxiety. Or no, I discarded it, because it was within me, in my own perceptions- not outside.” ― Marcus Aurelius, Meditations",
  "“He who has more money or possessions than you is not necessarily happier than you, happy more often than you, or happy like you.” ― Mokokoma Mokhonoana",
  "“Life cannot, not even for a millisecond, remain exactly how it is.” ― Mokokoma Mokhonoana",
];

// Random quote feature
function takeRandomQuotes() {
  var index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

// Update quote on page load
$(document).ready(function () {
  var todayQuotes = takeRandomQuotes();
  $("#quotes").text(todayQuotes);
});

// Quote update every day at midnight
setInterval(function () {
  var todayQuotes = takeRandomQuotes();
  $("#quotes").text(todayQuotes);
}, 24 * 60 * 60 * 1000); // 24 hodin * 60 minut * 60 sekund * 1000 milisekund
