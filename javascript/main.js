let criptosInformation = [];
let pageIndex = 0;
let expenses = [];
let nextEnable = true;
let prevEnable = false;
let pages = 0;
let selectedFilter = "ALL";

function onLoadActions() {
  fetchCriptos();
  if (JSON.parse(localStorage.getItem("expenses"))) {
    expenses = JSON.parse(localStorage.getItem("expenses"));
  }
  populateExpenseList();
  createChart(document.getElementById("myChart"));
}

function fetchCriptos() {
  fetch("https://api.coincap.io/v2/assets")
    .then((res) => res.json())
    .then((data) => {
      data.data.map((cripto) => {
        let criptoElement = {
          name: cripto.name,
          id: cripto.id,
          price: parseFloat(cripto.priceUsd).toFixed(3),
          rank: cripto.rank,
          symbol: cripto.symbol,
          link: cripto.explorer,
          maxSupply: cripto.maxSupply,
        };
        criptosInformation.push(criptoElement);
      });
      populateList();
    })
    .catch((e) => console.log(e));
}

function populateTopFive() {
  const mainContainer = document.querySelector(".criptos-main-container");
  const topFiveContainer = document.createElement("div");
  topFiveContainer.classList.add("criptos-top-container");
  const header = document.createElement("h3");
  header.classList.add("top-container-header");
  header.innerText = "Top 5 criptos";
  topFiveContainer.appendChild(header);
  const subTopFiveContainer = document.createElement("div");
  subTopFiveContainer.classList.add("criptos-top-subcontainer");
  let criptosOrdered = [...criptosInformation];
  criptosOrdered.sort((cripto, criptoTwo) => cripto.rank - criptoTwo.rank);
  criptosOrdered.map((cripto, index) => {
    if (index < 5) {
      let mainDivItem = document.createElement("div");
      mainDivItem.classList.add("cripto-card");
      let listDetailOne = document.createElement("h4");
      listDetailOne.innerText = cripto.name;
      let listDetailTwo = document.createElement("p");
      listDetailTwo.innerText = "ID: " + cripto.id;
      let listDetailThree = document.createElement("p");
      listDetailThree.innerText = "Price: US$ " + cripto.price;
      let listDetailFour = document.createElement("p");
      listDetailFour.innerText = "Symbol: " + cripto.symbol;
      mainDivItem.addEventListener("click", () => {
        window.location.href = cripto.link;
      });
      mainDivItem.appendChild(listDetailOne);
      mainDivItem.appendChild(listDetailTwo);
      mainDivItem.appendChild(listDetailThree);
      mainDivItem.appendChild(listDetailFour);
      subTopFiveContainer.appendChild(mainDivItem);
    }
  });

  topFiveContainer.appendChild(subTopFiveContainer);
  mainContainer.appendChild(topFiveContainer);
}

function populateAllCriptos(index, limit) {
  const mainContainer = document.querySelector(".criptos-main-container");
  const wholeListContainer = document.createElement("div");
  wholeListContainer.classList.add("criptos-list-container");
  mainContainer.appendChild(wholeListContainer);
  const criptosSelector = document.createElement("select");
  criptosSelector.classList.add("selector-criptos");
  const optionOne = document.createElement("option");
  selectedFilter === "ALL" && optionOne.setAttribute("selected", true);
  optionOne.innerText = "All criptos";
  const optionTwo = document.createElement("option");
  selectedFilter === "MAX" && optionTwo.setAttribute("selected", true);
  optionTwo.innerText = "Criptos with max Supply";
  const optionThree = document.createElement("option");
  selectedFilter === "ETH" && optionThree.setAttribute("selected", true);
  optionThree.innerText = "Criptos from ETH network";

  criptosSelector.addEventListener("change", (e) => handleSelectionChange(e));

  criptosSelector.appendChild(optionOne);
  criptosSelector.appendChild(optionTwo);
  criptosSelector.appendChild(optionThree);
  wholeListContainer.appendChild(criptosSelector);

  const wholeListCriptos = document.createElement("table");
  wholeListCriptos.classList.add("criptos-list-subcontainer");

  let tableTitle = document.createElement("tr");
  let tableTitleOne = document.createElement("th");
  tableTitleOne.innerText = "Name";
  let tableTitleTwo = document.createElement("th");
  tableTitleTwo.innerText = "ID";
  let tableTitleThree = document.createElement("th");
  tableTitleThree.innerText = "Price";
  let tableTitleFour = document.createElement("th");
  tableTitleFour.innerText = "Symbol";

  tableTitle.appendChild(tableTitleOne);
  tableTitle.appendChild(tableTitleTwo);
  tableTitle.appendChild(tableTitleThree);
  tableTitle.appendChild(tableTitleFour);
  wholeListCriptos.appendChild(tableTitle);

  let filteredList = filterList(selectedFilter);

  filteredList.map((cripto, i) => {
    if (i >= index && i <= limit) {
      let mainTableRow = document.createElement("tr");
      let listDetailOne = document.createElement("td");
      listDetailOne.innerText = cripto.name;
      let listDetailTwo = document.createElement("td");
      listDetailTwo.innerText = cripto.id;
      let listDetailThree = document.createElement("td");
      listDetailThree.innerText = "$ " + cripto.price;
      let listDetailFour = document.createElement("td");
      listDetailFour.innerText = cripto.symbol;
      mainTableRow.appendChild(listDetailOne);
      mainTableRow.appendChild(listDetailTwo);
      mainTableRow.appendChild(listDetailThree);
      mainTableRow.appendChild(listDetailFour);
      mainTableRow.addEventListener("click", () => {
        window.location.href = cripto.link;
      });
      wholeListCriptos.appendChild(mainTableRow);
    }
  });

  let buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-page-container");

  validatePrevButton();
  validateNextButton(filteredList);

  let prevButton = document.createElement("button");
  prevButton.innerText = "<";
  prevButton.disabled = prevEnable;
  let nextButton = document.createElement("button");
  nextButton.innerText = ">";
  nextButton.disabled = nextEnable;
  nextButton.addEventListener("click", () => nextPageCriptos());
  prevButton.addEventListener("click", () => prevPageCriptos());
  buttonContainer.appendChild(prevButton);
  buttonContainer.appendChild(nextButton);

  wholeListContainer.appendChild(wholeListCriptos);
  wholeListContainer.appendChild(buttonContainer);
}

function filterList(filter) {
  let filteredArray = [...criptosInformation];
  switch (filter) {
    case "ALL":
      return filteredArray;
    case "ETH":
      return filteredArray.filter((cripto) => cripto?.link?.includes("ether"));
    case "MAX":
      return filteredArray.filter((cripto) => cripto.maxSupply !== null);
    default:
      return filteredArray;
  }
}

function handleSelectionChange(e) {
  switch (e.target.value) {
    case "All criptos":
      selectedFilter = "ALL";
      break;
    case "Criptos with max Supply":
      selectedFilter = "MAX";
      break;
    case "Criptos from ETH network":
      selectedFilter = "ETH";
      break;
    default:
      selectedFilter = "ALL";
      break;
  }
  const oldList = document.querySelector(".criptos-list-container");
  oldList.remove();
  pageIndex = 0;
  populateAllCriptos(pageIndex, pageIndex + 10);
}

function nextPageCriptos() {
  pageIndex += 10;
  const oldList = document.querySelector(".criptos-list-container");
  oldList.remove();
  populateAllCriptos(pageIndex, pageIndex + 10);
}

function prevPageCriptos() {
  if (pageIndex - 10 >= 0) {
    pageIndex -= 10;
    const oldList = document.querySelector(".criptos-list-container");
    oldList.remove();
    populateAllCriptos(pageIndex, pageIndex + 10);
  }
}

function validatePrevButton() {
  if (pageIndex <= 0) {
    prevEnable = true;
  } else {
    prevEnable = false;
  }
}

function validateNextButton(list) {
  pages = list.length / 10;
  if (pageIndex / 10 < pages - 1) {
    nextEnable = false;
  } else {
    nextEnable = true;
  }
}

function populateList() {
  const loader = document.querySelector(".criptos-loader-container");
  loader.remove();
  populateTopFive();
  populateAllCriptos(pageIndex, pageIndex + 10);
}

function enterExpense(e) {
  e.preventDefault();
  let date = document.getElementById("dateInput");
  let amount = document.getElementById("numberInput");
  let description = document.getElementById("descriptionInput");
  document.querySelector(".error-submit")?.remove();
  if (
    date !== undefined &&
    amount !== undefined &&
    amount.value > 0 &&
    description !== undefined &&
    description.value !== ""
  ) {
    let expense = {
      date: date.value,
      amount: amount.value,
      description: description.value,
    };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    date.value = "";
    amount.value = "";
    description.value = "";
    document.querySelector(".expense-list").remove();
    populateExpenseList();
    updateChart();
  } else {
    let errorMessage = document.createElement("p");
    errorMessage.classList.add("error-submit");
    errorMessage.innerText = "Please review the information and try again";
    document.querySelector(".form-container").appendChild(errorMessage);
  }
}

function populateExpenseList() {
  document.querySelector(".expense-list")?.remove();
  let list = document.createElement("ul");
  list.classList.add("expense-list");
  expenses.map((expense, i) => {
    let itemContainer = document.createElement("div");
    itemContainer.classList.add("list-item-container");
    let item = document.createElement("li");
    let trashIcon = document.createElement("img");
    trashIcon.addEventListener("click", () => deleteExpense(expense));
    trashIcon.setAttribute("src", "./../assets/trash-icon.png");
    item.innerText = `$ ${expense.amount} | ${expense.date} | ${expense.description} `;
    itemContainer.appendChild(item);
    itemContainer.appendChild(trashIcon);

    list.appendChild(itemContainer);
  });
  document.querySelector(".expense-total")?.remove();
  document.querySelector(".expense-list-contaner").appendChild(list);
  addExpenseTotal();
}

function addExpenseTotal() {
  let totalExpense = document.createElement("h5");
  totalExpense.classList.add("expense-total");
  totalExpense.innerText =
    "Total: $" + expenses.reduce((acc, current) => acc + +current.amount, 0);
  document.querySelector(".expense-list-contaner").appendChild(totalExpense);
}

function deleteExpense(e) {
  let newList = expenses.filter(
    (expense) => expense.description !== e.description
  );
  expenses = newList;
  localStorage.setItem("expenses", JSON.stringify(expenses));
  populateExpenseList();
  updateChart();
}

function getLabels() {
  const expensesLabels = expenses.map((exp) => exp.description);
  return expensesLabels;
}

function getValues() {
  const expenseValues = expenses.map((exp) => exp.amount);
  return expenseValues;
}

function createChart(ctx) {
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: getLabels(),
      datasets: [
        {
          label: "Amount spent",
          data: getValues(),
          borderWidth: 1,
        },
      ],
    },
  });
}

function updateChart() {
  document.getElementById("myChart").remove();
  let canvas = document.createElement("canvas");
  canvas.setAttribute("id", "myChart");
  createChart(canvas);
  document.querySelector(".canvas-container").appendChild(canvas);
}
