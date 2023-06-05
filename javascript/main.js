let criptosInformation = [];
let pageIndex = 0;
let expenses = [];
//https://docs.coincap.io/#ee30bea9-bb6b-469d-958a-d3e35d442d7a

function onLoadActions() {
  fetchCriptos();
  if (JSON.parse(localStorage.getItem("expenses"))) {
    expenses = JSON.parse(localStorage.getItem("expenses"));
  }
  populateExpenseList();
  createChart();
}

function fetchCriptos() {
  fetch("https://api.coincap.io/v2/assets")
    .then((res) => res.json())
    .then((data) => {
      data.data.map((cripto) => {
        let criptoElement = {
          name: cripto.name,
          id: cripto.id,
          price: parseFloat(cripto.priceUsd).toFixed(5),
          rank: cripto.rank,
          symbol: cripto.symbol,
          link: cripto.explorer,
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
  header.innerText = "Top 5 criptos";
  topFiveContainer.appendChild(header);
  const subTopFiveContainer = document.createElement("div");
  subTopFiveContainer.classList.add("criptos-top-subcontainer");
  let criptosOrdered = [...criptosInformation];
  criptosOrdered.sort((cripto, criptoTwo) => cripto.rank - criptoTwo.rank);
  criptosOrdered.map((cripto, index) => {
    if (index < 5) {
      let mainDivItem = document.createElement("div");
      let listDetailOne = document.createElement("h3");
      listDetailOne.innerText = "Name: " + cripto.name;
      let listDetailTwo = document.createElement("p");
      listDetailTwo.innerText = "ID: " + cripto.id;
      let listDetailThree = document.createElement("p");
      listDetailThree.innerText = "Price: US$ " + cripto.price;
      let listDetailFour = document.createElement("p");
      listDetailFour.innerText = "Symbol: " + cripto.symbol;
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
  const header = document.createElement("h3");
  header.innerText = "All criptos:";
  wholeListContainer.appendChild(header);

  //wholeListContainer.classList.add("criptos-top-container");
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

  criptosInformation.map((cripto, i) => {
    if (i >= index && i <= limit) {
      let mainTableRow = document.createElement("tr");
      let listDetailOne = document.createElement("td");
      listDetailOne.innerText = cripto.name;
      let listDetailTwo = document.createElement("td");
      listDetailTwo.innerText = cripto.id;
      let listDetailThree = document.createElement("td");
      listDetailThree.innerText = cripto.price;
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

  let prevButton = document.createElement("button");
  prevButton.innerText = "<";
  prevButton.disabled = index === 0;
  let nextButton = document.createElement("button");
  nextButton.innerText = ">";
  nextButton.disabled = index === 90;
  nextButton.addEventListener("click", () => nextPageCriptos());
  prevButton.addEventListener("click", () => prevPageCriptos());
  buttonContainer.appendChild(prevButton);
  buttonContainer.appendChild(nextButton);

  wholeListContainer.appendChild(wholeListCriptos);
  wholeListContainer.appendChild(buttonContainer);
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

function populateList() {
  const loader = document.querySelector(".criptos-loader-container");
  loader.remove();
  populateTopFive();
  populateAllCriptos(pageIndex, pageIndex + 10);
}

function enterExpense(e) {
  e.preventDefault();
  console.log(getLabels());
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
  } else {
    let errorMessage = document.createElement("p");
    errorMessage.classList.add("error-submit");
    errorMessage.innerText = "Please review the information and try again";
    document.querySelector(".form-container").appendChild(errorMessage);
  }
}

function populateExpenseList() {
  let list = document.createElement("ul");
  list.classList.add("expense-list");
  expenses.map((expense, i) => {
    let item = document.createElement("li");
    item.innerText = `$ ${expense.amount} - ${expense.date} - ${expense.description} `;
    list.appendChild(item);
  });
  document.querySelector(".expense-list-contaner").appendChild(list);
}

const ctx = document.getElementById("myChart");

function getLabels() {
  const expensesLabels = expenses.map((exp) => exp.description);
  return expensesLabels;
}

function getValues() {
  const expenseValues = expenses.map((exp) => exp.amount);
  return expenseValues;
}

function createChart() {
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: getLabels(),
      datasets: [
        {
          label: "# of Votes",
          data: getValues(),
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
