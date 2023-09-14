/***** VARIABLES *****/
const addTaskIcon = document.querySelector(".addTaskIcon");
const formInputCategory = document.querySelector(".formInputCategory");
const formInputName = document.querySelector(".formInputName");
const formInputDescription = document.querySelector(".formInputDescription");
const formInputDescriptionParagraph = document.querySelector(".formInputDescriptionParagraph");
const formInputAmount = document.querySelector(".formInputAmount");
const formInputAmountParagraph = document.querySelector(".formInputAmountParagraph");
const formButton = document.querySelector(".formButton");
const toDoList = document.querySelector(".toDoList");
let toDoListArr = [];
const doneList = document.querySelector(".doneList");
const toDoListTask = {};
const doneListArr = [];
const ls = localStorage.getItem("Key");


if (ls !== null) {
  toDoListArr = JSON.parse(ls);
}
window.addEventListener("load", () => {
  showFilteredTaskList();
});

let currentFilter = "notDone";

/***** EVENT LISTENERS *****/
document.addEventListener("DOMContentLoaded", function () {
  toggleTaskElements();
});

addTaskIcon.addEventListener("click", toggleTaskVisibility);

const filterButtons = document.querySelectorAll(".filter");
filterButtons.forEach((filterButton) => {
  filterButton.addEventListener("click", filterList);
});

function filterList(event) {
  currentFilter = event.target.dataset.status;
  showFilteredTaskList();
}

function showFilteredTaskList() {
  let filteredTasks;
  if (currentFilter === "all") {
    filteredTasks = toDoListArr;
   heading="All";
  } else if (currentFilter === "done") {
    filteredTasks = toDoListArr.filter(filterTasksDone);
    heading="Done";
  } else {
    filteredTasks = toDoListArr.filter(filterTasksNotDone);
    heading="To-Do";
  }

  showList(filteredTasks, toDoList);
}

function filterTasksDone(task) {
  if (task.status) {
    return true;
  } else {
    return false;
  }
}

function filterTasksNotDone(task) {
  if (task.status) {
    return false;
  } else {
    return true;
  }
}

formButton.addEventListener("click", () => {
  const inputCategoryContent = formInputCategory.value;
  const inputNameContent = formInputName.value;
  const inputAmountContent = formInputAmount.value;
  const inputDescriptionContent = formInputDescription.value;
  prepareTask(inputCategoryContent, inputNameContent, inputAmountContent, inputDescriptionContent);
  showList(toDoListArr, toDoList);
  formInputName.value = "";
  formInputAmount.value = "";
  formInputDescription.value = "";
  toggleTaskVisibility();
});

formInputCategory.addEventListener("change", toggleTaskElements);

/***** FUNCTIONS *****/

function prepareTask(taskCategory, taskName, taskAmount, taskDescription) {
  const task = Object.create(toDoListTask);
  let newID = toDoListArr.length;
  task.category = taskCategory;
  task.name = taskName;
  task.amount = taskAmount;
  task.description = taskDescription;
  task.status = false;
  task.id = newID;
  toDoListArr.unshift(task);
  setStorage();
}

function toggleTaskVisibility() {
  const form = document.querySelector(".form");

  if (form.style.display === "none" || form.style.display === "") {
    form.style.display = "flex";
    addTaskIcon.innerHTML = '<i class="fas fa-minus"></i>';
  } else {
    form.style.display = "none";
    addTaskIcon.innerHTML = '<i class="fas fa-plus"></i>';
  }
}

function toggleTaskElements() {
  const selectedCategory = formInputCategory.value;

  if (selectedCategory === "value" || selectedCategory === "stringValue") {
    formInputAmount.style.display = "block";
    formInputAmountParagraph.style.display = "block";
  } else {
    formInputAmount.style.display = "none";
    formInputAmountParagraph.style.display = "none";
  }

  if (selectedCategory === "string" || selectedCategory === "stringValue") {
    formInputDescription.style.display = "block";
    formInputDescriptionParagraph.style.display = "block";
  } else {
    formInputDescription.style.display = "none";
    formInputDescriptionParagraph.style.display = "none";
  }
}

function showList(arr, targetElement) {
  targetElement.innerHTML = "";
  if (arr.length > 0) {
    targetElement.innerHTML = `<h2 class="toDoHeading">${heading}</h2>`;
  }
  arr.forEach((each) => {
    targetElement.innerHTML += `<div class="taskContainer">
    <div class="taskElements">
    <div class="taskElementsTop">
    <input data-id=${each.id} class="checkBox" type="checkbox" ${each.status ? "checked" : ""}>
    <li>${each.name}</li>
    </div>
    <div class="taskElementsBottom">
    <i data-noget="${each.name}" class="fa-solid fa-circle-xmark delete"></i>
    </div>
    </div>
     ${
       each.category === "value" || each.category === "stringValue"
         ? `
    <div class="taskValues">
      <i data-minus=${each.id} class="fa-solid fa-circle-minus minus "></i>
      <li class="taskAmount">${each.amount || "N/A"}</li>
      <i data-plus=${each.id} class="fa-solid fa-circle-plus plus "></i>
       </div>
    `
         : ""
     }
    <div class="taskDescription">
    <p>${each.description}</p>
    </div>
    </div>`;
  });

  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      const nameToFind = event.target.getAttribute("data-noget");
      const index = toDoListArr.findIndex((task) => task.name === nameToFind);
      if (index !== -1) {
        toDoListArr.splice(index, 1);
        showFilteredTaskList();
        setStorage();
      }
    });
  });

  const plusButtons = document.querySelectorAll(".plus");
  plusButtons.forEach((plusButton) => {
    plusButton.addEventListener("click", (event) => {
      const idToFind = event.target.getAttribute("data-plus");
      const taskToUpdate = arr.find((task) => task.id == idToFind);

      if (taskToUpdate) {
        taskToUpdate.amount = parseInt(taskToUpdate.amount) + 1;
        showFilteredTaskList();
        setStorage();
      }
    });
  });

  const minusButtons = document.querySelectorAll(".minus");
  minusButtons.forEach((minusButton) => {
    minusButton.addEventListener("click", (event) => {
      const idToFind = event.target.getAttribute("data-minus");
      const taskToUpdate = arr.find((task) => task.id == idToFind);

      if (taskToUpdate) {
        taskToUpdate.amount = parseInt(taskToUpdate.amount) - 1;
        showFilteredTaskList();
        setStorage();
      }
    });
  });

  const checkBoxes = document.querySelectorAll(".checkBox");
  checkBoxes.forEach((checkBox) => {
    checkBox.addEventListener("change", (event) => {
      const taskID = parseInt(event.target.getAttribute("data-id"));
      const taskContainer = event.target.parentElement.parentElement.parentElement;
      console.log(taskID);
      const statusToUpdate = toDoListArr.find((task) => task.id === taskID);
      console.log(checkBox.checked);
      console.log(statusToUpdate);
      if (checkBox.checked) {
        statusToUpdate.status = true;
if(currentFilter==="notDone"){
taskContainer.classList.add("remove1")
}
else if(currentFilter==="done"){
  taskContainer.classList.add("remove2")
}
      } else {
        statusToUpdate.status = false;
        if(currentFilter==="notDone"){
          taskContainer.classList.add("remove1")
          }
          else if(currentFilter==="done"){
            taskContainer.classList.add("remove2")
      }
    }
    setTimeout(() => {
      taskContainer.classList.remove("remove", "remove2");
      showFilteredTaskList();
    }, 700);
      setStorage();
    });
  });
}
/*
toDoList.innerHTML = localStorage.getItem("nøgle");

toDoList.addEventListener("load", storage);

function storage() {
  
  toDoList.innerHTML = localStorage.getItem("nøgle");
  let stringArr = JSON.parse(stringArr);
}*/

function setStorage() {
  localStorage.setItem("Key", JSON.stringify(toDoListArr));
}

/* Todo-task’en skal være kompleks og objektet skal indeholde mindst disse properties:

Task-string - hvad er der skal gøres/købes
Hvor mange - hvis det er et indkøb
done - er indkøbet udført / er tasken done
ID


Minimumskrav
Din ToDo-app skal være i stand til at:

Oprette en ny opgave med et unikt ID og en beskrivelse.
- createElement / appendChild
Gemme mere end en simpel streng for hver opgave for at øge kompleksiteten. Dette kunne være kvantitet (antal) eller anden relevant information.
Tillade brugerne at markere opgaver som "færdige", hvorefter de flyttes til en "Færdig"-liste.
- boolean / if-statements
Tillade brugerne at fortryde færdiggørelsen af en opgave, så den ryger tilbage til "ToDo"-listen.
- boolean / if-statements
Tillade brugerne at slette opgaver.
- remove/delete


Evt. ekstra funktioner
Brug localStorage til at gemme opgaverne. Når en bruger opretter en ny opgave, sletter en opgave, eller ændrer status for en opgave, 
skal disse ændringer gemmes i localStorage. Når brugeren besøger appen igen, skal opgaverne hentes fra localStorage, 
så de stadig kan se deres opgaveliste, selv efter at de har lukket og genåbnet browseren.

- Inputfield med tilhørende knap
- Tomt array (med objekter i)
- Displayfunktion
- +/- der opdaterer en let der holder styr på antal af varen
- done / ikke done knap

*/
