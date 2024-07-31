init();

function init() {
  const calcBtn = document.getElementById("calc-btn");
  calcBtn.addEventListener("click", (e) => calc());

  const copyBtn = document.getElementById("copy-btn");
  copyBtn.addEventListener("click", (e) => copy());

  load();
}

function load() {
  // get
  let start = localStorage.getItem("start");
  let wake = localStorage.getItem("wake");
  let offset = localStorage.getItem("offset");

  const dayDreams = [];
  const dayDreamCount = getDayDreamCount();
  for (let i = 1; i <= dayDreamCount; i++) {
    dayDreams[i] = localStorage.getItem(`day-dream-${i}`);
  }

  // defaults
  if (!start) start = "07:00";
  if (!wake) wake = "02:00";
  if (!offset) offset = "00:15";
  if (!dayDreams[1]) dayDreams[1] = "01:30";
  for (let i = 2; i <= dayDreamCount; i++) {
    if (!dayDreams[i]) dayDreams[i] = "00:00";
  }

  // set
  setTime("start-h", "start-m", start);
  setTime("wake-h", "wake-m", wake);
  setTime("offset-h", "offset-m", offset);
  for (let i = 1; i <= dayDreamCount; i++) {
    setTime(`day-dream-h-${i}`, `day-dream-m-${i}`, dayDreams[i]);
  }
}

function save() {
  const start = getTime("start-h", "start-m");
  const wake = getTime("wake-h", "wake-m");
  const offset = getTime("offset-h", "offset-m");

  localStorage.setItem("start", start);
  localStorage.setItem("wake", wake);
  localStorage.setItem("offset", offset);

  const dayDreamCount = getDayDreamCount();
  for (let i = 1; i <= dayDreamCount; i++) {
    const dayDreamTime = getTime(`day-dream-h-${i}`, `day-dream-m-${i}`);
    localStorage.setItem(`day-dream-${i}`, dayDreamTime);
  }
}

function getTime(hoursId, minsId) {
  const hoursList = document.getElementById(hoursId);
  const minsList = document.getElementById(minsId);
  const h = String(hoursList.value).padStart(2, "0");
  const m = String(minsList.value).padStart(2, "0");
  const time = `${h}:${m}`;
  return time;
}

function getMins(hoursId, minsId) {
  const time = getTime(hoursId, minsId);
  const mins = timeToMins(time);
  return mins;
}

function setTime(hoursId, minsId, time) {
  const timeArray = time.split(":");
  const h = timeArray[0];
  const m = timeArray[1];

  const hoursList = document.getElementById(hoursId);
  const minsList = document.getElementById(minsId);

  hoursList.value = h;
  minsList.value = m;
}

function timeToMins(time) {
  const timeArray = time.split(":").map((x) => parseInt(x));
  const hours = timeArray[0];
  const mins = timeArray[1];
  const total = hours * 60 + mins;
  return total;
}

function minsToTime(mins) {
  let h = Math.trunc(mins / 60);
  const m = mins - h * 60;
  while (h >= 24) h -= 24;
  const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return time;
}

function calc() {
  const button = document.getElementById("calc-btn");
  button.disabled = true;

  const start = getMins("start-h", "start-m");
  const wake = getMins("wake-h", "wake-m");
  const offset = getMins("offset-h", "offset-m");

  const dayDreams = [];
  const dayDreamCount = getDayDreamCount();
  for (let i = 1; i <= dayDreamCount; i++) {
    const dayDreamMins = getMins(`day-dream-h-${i}`, `day-dream-m-${i}`);
    dayDreams.push(dayDreamMins);
  }

  let curOffset = 0;
  let time = start;
  let result = `${minsToTime(time)} — подъём\n`;
  for (let i = 0; i < dayDreams.length; i++) {
    const dayDream = dayDreams[i];
    if (dayDream > 0) {
      const dreamStart = time + wake + curOffset;
      const dreamEnd = dreamStart + dayDream;
      result = `${result}${minsToTime(dreamStart)}-${minsToTime(dreamEnd)} — сон №${i + 1}\n`;
      curOffset += offset;
      time = dreamEnd;
    }
  }

  time = time + wake + curOffset;
  result = `${result}${minsToTime(time)}  — отбой\n`;
  document.getElementById("output").value = result;
  save();

  button.disabled = false;
}

async function copy() {
  const button = document.getElementById("copy-btn");
  button.disabled = true;
  const result = document.getElementById("output").value;
  await navigator.clipboard.writeText(result);
  button.disabled = false;
}

function getDayDreamCount() {
  const { length } = document.querySelectorAll("[id^='day-dream-h-']");
  return length;
}
