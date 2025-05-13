// GLOABL VARIABLES
const displaySchedule = document.getElementById('display-schedule');

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

// DB OPERATIONS ON SCHEDULE.HTML
fetch('/api/entries')
  .then(res => res.json())
  .then(entries => {
    entries.forEach(entry => {
        // div holding all display meta data for pdf
        const display = document.createElement('div');
        display.className = "file";

        display.addEventListener('click', () => {
            document.querySelectorAll('.file').forEach(d => d.classList.remove('selected'));
            display.classList.add('selected');
            selectedDiv = display;
        });

        // ONLY DISPLAYS THE MN RIGHT NOW - UPDATE DB AND DISPLAY NAME, PROJECT, AND CREATED
        const display_title = document.createElement('p');
        display_title.textContent = entry.model_num;
        display.appendChild(display_title);

        displaySchedule.appendChild(display);
    });
  });


document.getElementById("export_button").addEventListener("click", function() {
    downloadExcel();
    // also do other things
  });
