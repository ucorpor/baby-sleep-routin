initWatch("startH", "startM", "07:00");
initWatch("wakeH", "wakeM", "02:00");
initWatch("wakeH", "wakeM", "00:15");

function initWatch(hoursId, minsId, time = "00:00") {
  const hours = document.getElementById(hoursId);
  const mins = document.getElementById(minsId);
  hours.length = 0;
  mins.length = 0;

  for (var i = 0; i < 24; i++) {
    const option = new Option(String(i).padStart(2, "0"), i);
    hours.add(option);
  }

  for (var i = 0; i < 60; i++) {
    const option = new Option(String(i).padStart(2, "0"), i);
    mins.add(option);
  }

  const timeArray = time.split(":").map((x) => parseInt(x));
  hours.value = timeArray[0];
  mins.value = timeArray[1];
}

function getMins(hoursId, minsId) {
  const hoursList = document.getElementById(hoursId);
  const minsList = document.getElementById(minsId);

  const hours = parseInt(hoursList.value);
  const mins = parseInt(minsList.value);
  const total = hours * 60 + mins;
  return total;
}

function setTime(hoursId, minsId, mins) {
  const h = Math.trunc(mins / 60);
  const m = mins - h * 60;

  const hoursList = document.getElementById(hoursId);
  const minsList = document.getElementById(minsId);

  hoursList.value = h;
  minsList.value = m;
}
