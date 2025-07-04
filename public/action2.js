// GLOABL VARIABLES
const displaySchedule = document.getElementById('display-schedule');
const popup = document.getElementById('popup');
const schedule_popup = document.getElementById('schedule_popup');
const over = document.getElementById('overlay');
loadSchedules();

function downloadExcel() {
    fetch('/api/export-entries')
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'entries.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => {
        console.error('Download failed:', err);
      });
}

function loadSchedules() {
  fetch('/api/schedules')
  .then(res => res.json())
  .then(entries => {
    displaySchedule.innerHTML = '';
    entries.forEach(entry => {
        // div holding all display meta data for pdf
        const display = document.createElement('div');
        display.className = "schedule";

        display.addEventListener('click', () => {
            document.querySelectorAll('.schedule').forEach(d => d.classList.remove('selected'));
            display.classList.add('selected');
            selectedDiv = display;
        });

        // ONLY DISPLAYS THE MN RIGHT NOW - UPDATE DB AND DISPLAY NAME, PROJECT, AND CREATED
        const display_title = document.createElement('p');
        display_title.textContent = entry.name;
        display.appendChild(display_title);

        displaySchedule.appendChild(display);
    });
  });

}

function submitSchedule() {
  const new_schedule = [];
  const inputs = document.querySelectorAll("#popup input");

  for (const input of inputs) {
    if (!input || !input.value.trim()) {
      alert("Missing field. Please ensure name and project are filled out.");
      return;
    }
    new_schedule.push(input.value);
  }

  fetch('/api/schedules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(new_schedule)
  })
  .then(response => {
    if (!response.ok) throw new Error("Failed to save metadata");
    return response.json();
  })
  .then(data => {
    console.log("Saved to DB:", data);
    closePopup();
  })
  .catch(err => {
    console.error("Error posting to DB:", err);
  });

  closePopup();
}



function getDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function createPopup(box) {
  box.classList.add("open");
  
  over.classList.remove('hidden');
}


function createSchedulePopup() {

  const created_div = document.getElementById("sched_created");
  const date_p = document.createElement('p');
  date_p.textContent = getDate();
  created_div.appendChild(date_p);

}



function schedulePopup(box) {

  const created_div = document.getElementById("sched_created");
  const date_p = document.createElement('p');
  date_p.textContent = getDate();
  created_div.appendChild(date_p);
  
}



function clearScheduleEntry() {
  const name_input = document.getElementById("sched_name");
  if (name_input) name_input.value = '';

  const project_input = document.getElementById("sched_project");
  if (project_input) project_input.value = '';

  const created_value = document.getElementById("sched_created");
  if (created_value) created_value.innerHTML = '';
}



function closePopup() {
  clearScheduleEntry();
  loadSchedules();

  popup.classList.remove("open");
  schedule_popup.classList.remove("open");

  document.getElementById('overlay').classList.add('hidden');
}


// document.getElementById("export_button").addEventListener("click", function() {
//     downloadExcel();
//     // also do other things
//   });

document.getElementById("add_schedule_button").addEventListener("click", function() {
  if (popup.classList.contains("open")) {
    return;
  } else {
    createPopup(popup);
    createSchedulePopup();
  }
  // also do other things
});

const exits = document.getElementsByClassName('exit_button');

for (const ex of exits) {
  ex.addEventListener("click", closePopup);
}



document.getElementById("add_button").addEventListener("click", submitSchedule);

document.getElementById("open_button").addEventListener("click", function() {
  if (schedule_popup.classList.contains("open")) {
    return;
  } else {
    createPopup(schedule_popup);
    schedulePopup();
  }
  // also do other things
});