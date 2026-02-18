let prayerData;

async function getData() {
  const url = "https://www.londonprayertimes.com/api/times/?format=json&24hours=true&key=5a8f0931-fbd1-41e9-840a-9f44eee10830";
  const response = await fetch(url);
  const data = await response.json();
  prayerData = data
  console.log(data);
  displayInfo();
}

getData();

function displayInfo() {
  displayTime();
  displaySunrise();
  displayJammah();
  displayPrayerCards();
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