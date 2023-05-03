const dataContainer = document.getElementById("centre-data");
const input = document.querySelector("input");
const btnOne = document.getElementById("City");
const btnTwo = document.getElementById("State");
const btnThree = document.getElementById("centre");
const searchLogo = document.querySelector("i");

let activeBtn = null;

let centersData = {};
async function getCentreData() {
  const apiUrl = "https://isro.vercel.app/api/centres";
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Not Found");
    }
    centersData = await response.json();
    printCentreData();
  } catch (error) {
    console.log(error.message);
  }
}

async function printCentreData() {
  dataContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (const center of centersData.centres) {
    const parent = document.createElement("div");
    parent.classList.add("centre-info");
    for (const key in center) {
      if (key !== "id") {
        const child = document.createElement("article");
        child.textContent = center[key];
        parent.appendChild(child);
      }
    }
    fragment.appendChild(parent);
  }
  dataContainer.append(fragment);
}

getCentreData();

function searchData() {
  const inputKey = input.value.toLowerCase();
  //console.log(inputKey);

  if (!inputKey) {
    //dataContainer.innerHTML = `<p class="not-found">Please enter a ${activeBtn.id} name </p>`;
    return;
  }

  dataContainer.innerHTML = "";

  if (!activeBtn) {
    dataContainer.innerHTML = `<div class="not-found">Please select a search category</div>`;
    return;
  }

  let finderKey = activeBtn.value;
  const fragment = document.createDocumentFragment();

  //console.log(finderKey);

  for (const center of centersData.centres) {
    if (center[finderKey].toLowerCase().includes(inputKey)) {
      const parent = document.createElement("div");
      parent.classList.add("centre-info");
      for (const key in center) {
        if (key !== "id") {
          const child = document.createElement("article");
          child.textContent = center[key];
          parent.appendChild(child);
        }
      }
      fragment.appendChild(parent);
    }
  }

  if (!fragment.childElementCount) {
    dataContainer.innerHTML = `<div class="not-found">Please enter a valid ${activeBtn.id} name </div>`;
    return;
  }

  dataContainer.append(fragment);
}

function action(event) {
  event.target.classList.toggle("selected");
  if (activeBtn && event.target.id === activeBtn.id) {
    activeBtn = null;
    printCentreData();
    //console.log(activeBtn);
    return;
  }
  if (activeBtn) activeBtn.classList.toggle("selected");

  activeBtn = event.target;
  //console.log(activeBtn);
}

btnOne.addEventListener("click", action);
btnTwo.addEventListener("click", action);
btnThree.addEventListener("click", action);

searchLogo.addEventListener("click", searchData);

input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") searchData();
  if (input.value === "") printCentreData();
});