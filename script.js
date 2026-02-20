let prayerData;

async function getData() {
  const url = "https://www.londonprayertimes.com/api/times/?format=json&24hours=true&key=5a8f0931-fbd1-41e9-840a-9f44eee10830";
  const response = await fetch(url);
  const data = await response.json();
  prayerData = data
  displayInfo();
}

getData();

function displayInfo() {
  displayTime();
  displaySunrise();
  displayJammah();
  displayPrayerCards();
  displayDate();
}

function displayTime() {
  const time = document.querySelector(".time");

  const timeValue = new Date();
  const hours = timeValue.getHours();
  let minutes = timeValue.getMinutes();
  let seconds = timeValue.getSeconds();

  minutes = checkTime(minutes);
  seconds = checkTime(seconds);

  time.textContent = `${hours}:${minutes}:${seconds}`;
  setTimeout(displayTime, 1000);
}

function checkTime(value) {
  value < 10 ? value = "0" + value : null;
  return value;
}

function displaySunrise() {
  const sunrise = document.querySelector(".sunrise");
  sunrise.innerHTML = ``;
  const card = document.createElement("div");
  card.classList.add("sunrise-card");

  card.innerHTML = `
    <div class="sunrise-tag">Sunrise</div>
    <div class="sunrise-value">${prayerData.sunrise}</div>
  `;

  const sunriseIcon = document.createElement("div");
  sunriseIcon.textContent = "🌆";
  sunriseIcon.classList.add("sunrise-icon");

  sunrise.appendChild(card);
  sunrise.appendChild(sunriseIcon);
}

const prayerNames = ["Fajr", "Dhuhr", "Asr",  "Maghrib", "Isha"];

function displayJammah() {
  const jammah = document.querySelector(".jammah");
  const arr = [prayerData.fajr_jamat, prayerData.dhuhr_jamat, prayerData.asr_jamat, prayerData.magrib_jamat, prayerData.isha_jamat];
  arr.forEach(prayer => {
    const card = document.createElement("div");
    card.classList.add("jammah-times");
    const index = arr.indexOf(prayer);

    card.innerHTML = `
      <div class="jammah-prayer">
        <p>${prayerNames[index]}</p>
        <p>${arr[index]}</p>
      </div>
    `;

    jammah.appendChild(card);
  });
}

function displayPrayerCards() {
  const prayerSection = document.querySelector(".prayer-cards");
  const arr = [prayerData.fajr, prayerData.dhuhr, prayerData.asr, prayerData.magrib, prayerData.isha];
  const iconsArr = ["🌇", "☀️", "🤲", "🕌", "🌙"];
  arr.forEach(prayer => {
    const card = document.createElement("div");
    card.classList.add("prayer-card");
    const index = arr.indexOf(prayer);

    card.innerHTML = `
      <h2 class="prayer-name">${prayerNames[index]}</h2>
      <div class="prayer-icon">${iconsArr[index]}</div>
      <h4 class="prayer-time">${arr[index]}</h4>
    `;

    prayerSection.appendChild(card);
  });
}

function displayDate() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const date = new Date();

  const dayIndex = date.getDay() - 1;
  const day = dayIndex === -1 ? "Sun" : days[dayIndex]

  const monthIndex = date.getMonth();
  const month = months[monthIndex];

  const dateDiv = document.querySelector(".date");
  dateDiv.textContent = `${day}, ${month} ${date.getDate()}`;
}

function showNotification() { 
  const arr = [prayerData.fajr, prayerData.dhuhr, prayerData.asr, prayerData.magrib, prayerData.isha];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  arr.forEach((prayer, index) => {
    const split = prayer.split(":");
    const hour = Number(split[0]);
    const minute = Number(split[1]);

    const prayerDate = new Date();
    prayerDate.setHours(hour);
    prayerDate.setMinutes(minute);
    prayerDate.setSeconds(0);

    const time = new Date(prayerDate.getTime() - 10 * 60000);

    if (now.getHours() === time.getHours() && now.getMinutes() === time.getMinutes()) {
      new Notification(`${prayerNames[index]} in 10 minutes`);
    }

    if (currentHour === hour && currentMinutes === minute) {
      new Notification(`It is ${prayerNames[index]} go pray`);
    }

  });
}

const enableNotifications = document.querySelector(".enable-notifications");

enableNotifications.addEventListener("click", () => {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      new Notification("Notifications enabled!", {
        body: "You will be notified 10 minutes before each prayer",
      });
      
      setInterval(showNotification, 60000);
    } else {
      alert("Permission denied");
    }
  });
});