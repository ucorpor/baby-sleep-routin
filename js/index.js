setTime("start-h", "start-m", timeToMins("07:00"));
setTime("wake-h", "wake-m", timeToMins("02:00"));
setTime("offset-h", "offset-m", timeToMins("00:15"));
setTime("day-dream-h-1", "day-dream-m-1", timeToMins("01:30"));
setTime("day-dream-h-2", "day-dream-m-2", timeToMins("00:00"));
setTime("day-dream-h-3", "day-dream-m-3", timeToMins("00:00"));
setTime("day-dream-h-4", "day-dream-m-4", timeToMins("00:00"));

const calcBtn = document.getElementById("calc-btn");
calcBtn.addEventListener("click", (e) => calc());

const copyBtn = document.getElementById("copy-btn");
copyBtn.addEventListener("click", (e) => copy());

function getMins(hoursId, minsId) {
  const hoursList = document.getElementById(hoursId).value;
  const minsList = document.getElementById(minsId).value;
  const time = `${hoursList}:${minsList}`;
  const mins = timeToMins(time);
  return mins;
}

function setTime(hoursId, minsId, mins) {
  const h = Math.trunc(mins / 60);
  const m = mins - h * 60;

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
  const dayDreamsCount = document.querySelectorAll("[id^='day-dream-h-']").length;
  for (let i = 1; i <= dayDreamsCount; i++) {
    const dayDreamMins = getMins(`day-dream-h-${i}`, `day-dream-m-${i}`);
    dayDreams.push(dayDreamMins);
  }

  let curOffset = 0;
  let time = start;
  let result = `${minsToTime(time)} — Подъём\n`;
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
  result = `${result}${minsToTime(time)}  — Отбой\n`;
  document.getElementById("output").value = result;
  button.disabled = false;
}

async function copy() {
  const button = document.getElementById("copy-btn");
  button.disabled = true;
  const result = document.getElementById("output").value;
  await navigator.clipboard.writeText(result);
  button.disabled = false;
}
