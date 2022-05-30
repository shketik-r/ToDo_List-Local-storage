fetch('http://api.openweathermap.org/data/2.5/weather?id=630336&appid=0a6f81c14e894f9e469514bed702c0b9')
  .then(function (resp) { return resp.json() })
  .then(
    function (wt) {
      document.querySelector('.temperature').innerHTML = Math.round(wt.main.temp - 273) + "&deg" + "C";
      document.querySelector('.icon').innerHTML = '<img src = "http://openweathermap.org/img/wn/' + wt.weather[0]['icon'] + '@2x.png">';
    }
  )


const monthName = document.getElementById("monthName");
const navMonth = document.getElementById("navMonth");
const numbersMonth = document.getElementById("numbersMonth");

let listHeader = document.getElementById("listHeader");
let span = document.createElement("span");
let addTask = document.getElementById("add");
let input = document.getElementById("input");

let wrapperList = document.getElementById("wrapperList");
let taskSheet = document.getElementById("taskSheet");
let todo = document.getElementById("ol");

let btnDeletList = document.getElementById("btnClear");

const arrMonth = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear()

let arrayTd = []

function calendar() {
  let date = new Date();
  let currentMonth = date.getMonth();
  let currentYear = date.getFullYear();

  date.setYear(year);
  date.setMonth(month);
  date.setDate(1);
  arrayTd = [];

  monthName.textContent = `${arrMonth[month]} ${year}`

  let dayCount = new Date(year, month + 1, 0).getDate();
  let Firstweek = date.getDay() == 0 ? 7 : date.getDay();
  let list = [];
  
  let yindex = 0;
  let index = 1;

  while (index <= dayCount) {
    list[yindex] = [];
    if (yindex == 0) {
      for (let i = 0; i < 7; i++) {
        if (i + 1 < Firstweek) {
          list[yindex][i] = '';
        } else {
          list[yindex][i] = index;
          index++;
        }
      }
    }
    else {
      for (let i = 0; i < 7 && index <= dayCount; i++) {
        list[yindex][i] = index;
        index++;
      }
    }
    yindex++;
  }

  for (let i = 0; i < list.length; i++) {
    let tr = document.createElement("tr");
    numbersMonth.append(tr);
    for (let j = 0; j < list[i].length; j++) {
      let td = document.createElement("td");
      tr.append(td);
      td.innerHTML = list[i][j];
      arrayTd.push(td);
    }
  }

  if (currentMonth == month && currentYear == year) {     // проверка на текущий месяц и год в календаре
    setColorToday(arrayTd);
  }

  addColorWeekends(date);
  notificationTasks()
  
}
calendar();

/*--------------notification Tasck-------------------------*/

function notificationTasks() {

  let arrayKeys = []
  let arrayTdnums = []
  let newArrayTd = []

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    arrayKeys.push(key)
  }

  for (let i = 0; i < arrayTd.length; i++) {
    if (arrayTd[i].innerHTML !== "") {
      newArrayTd.push(arrayTd[i])
      arrayTdnums.push(`${arrayTd[i].innerText}.${month + 1}.${year}`)
    }
  }

  arrayKeys.forEach((key) => {
    arrayTdnums.forEach((num, i) => {
      if (num == key) {
        console.log('key: ', key);
        console.log('num: ', num);
        let notification = document.createElement('div');
        notification.classList.add("not");
        newArrayTd[i].append(notification)
      }
    })
  })
}


/*------------------выходные дни---------------*/

function addColorWeekends(date) {
  for (let i = 0; i < arrayTd.length; i++) {
    if (arrayTd[i].innerHTML) {
      date.setDate(arrayTd[i].innerHTML)
      let dayOfTheWeek = date.getDay()
      
      if (dayOfTheWeek == 0 || dayOfTheWeek == 6) {
        arrayTd[i].classList.add('weekend')
      }
    }
  }
}

/*----------текущий день---------------*/

function setColorToday() {
  for (let i = 0; i < arrayTd.length; i++) {
    if (arrayTd[i].innerHTML == day) {
      arrayTd[i].classList.add('today')
    }
  }
}

let navleft = navMonth.children[0];   // кнопка влево
let navRight = navMonth.children[2];    //кнопка вправо

/*-------------обновить месяц-----------*/

function updateMonth(year, month) {
  monthName.textContent = `${arrMonth[month]} ${year}`
}

/*--------------прошлый месяц---------------*/

navleft.addEventListener("click", () => {
  numbersMonth.innerHTML = "";
  if (month > 0) {
    month--
    updateMonth(year, month)
    calendar(year, month)
  } else {
    month = 12
    year--
    month--
    updateMonth(year, month)
    calendar(year, month)
  }
});

/*----------------следующий месяц--------------*/
navRight.addEventListener("click", () => {
  numbersMonth.innerHTML = "";
  if (month < 11) {
    month++;
    updateMonth(year, month)
    calendar(year, month)
  } else {
    month = -1
    year++
    month++
    updateMonth(year, month)
    calendar(year, month)
  }
});

/*---------------выбор дня + задачи------------*/

numbersMonth.addEventListener("click", clickDay);

let arrayTask = []
let currenDay = '';

function clickDay(event) {
  arrayTask = []
  input.value = ""
  todo.innerHTML = ""

  if (event.target.innerHTML) {
    span.innerHTML = `${event.target.innerText.toString().padStart(2, 0)}.${(month + 1).toString().padStart(2, 0)}.${year}г.`
    listHeader.append(span);
  }
  currenDay = `${event.target.innerText}.${month + 1}.${year}`

  localGet()
}

/*--------добавление задачи клавишей "Enter" --------------------*/

input.addEventListener("keyup", function (event) {

  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("add").click();
  }
});


addTask.addEventListener("click", (event) => {
  if (input.value) {
    let newTask = {
      task: input.value,
      check: false
    }
    arrayTask.push(newTask)
  }
  displayMessages()
  input.value = ""
  localSet();
  notificationTasks()
});

function displayMessages() {
  let li = document.createElement("li");
  let label = document.createElement("label");
  let checkBox = document.createElement('input');
  checkBox.type = "checkbox";
  checkBox.classList.add("check")

  arrayTask.forEach((val, i) => {
    label.setAttribute('for', `id_${i}`)
    checkBox.id = `id_${i}`
    checkBox.checked = (val.check ? true : false);
    label.innerHTML = val.task;

    todo.append(li);
    li.append(checkBox);
    li.append(label);

    localSet()
  })
}

function localSet() {
  localStorage.setItem(currenDay, JSON.stringify(arrayTask));
}

function localGet() {

  let raw = localStorage.getItem(currenDay)
  if (raw) {
    arrayTask = JSON.parse(raw);

    arrayTask.forEach((val, i) => {
      let li = document.createElement("li")
      let label = document.createElement("label");
      let checkBox = document.createElement('input');
      checkBox.type = "checkbox";
      checkBox.classList.add("check")
      checkBox.id = `id_${i}`
      label.setAttribute('for', `id_${i}`)

      checkBox.checked = (val.check ? true : false);
      label.innerHTML = val.task;

      todo.append(li);
      li.append(checkBox);
      li.append(label);

      taskCompleted(checkBox, label)
    })
  }
}

todo.addEventListener('change', (event) => {

  let checkBox = event.target
  let idChack = event.target.getAttribute('id')
  let forLabel = ol.querySelector(`[for = ${idChack}] `)
  let valueLabel = forLabel.innerText

  arrayTask.forEach((val) => {
    if (val.task === valueLabel) {
      val.check = !val.check

      localSet()
    }
  });

  taskCompleted(checkBox, forLabel)
})


/*--------очистить список задач------ */

btnDeletList.addEventListener("click", () => {
  todo.innerHTML = ""
  localStorage.removeItem(currenDay);
})

/*-------зачеркнуть выполненную задачу---------*/

function taskCompleted(checkBox, label) {
  if (checkBox.checked == true) {
    label.classList.add('change_task')
  } else {
    label.classList.remove('change_task')
  }
}
