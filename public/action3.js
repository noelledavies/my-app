let popup = document.getElementById('edit_mn');
// Store category-wise arrays
const metadataOptions = {
    voltage: [],
    source: [],
    driver: [],
    dimensions: [],
    mounting: [],
    luminaire: []
  };


/* 
Function: openPopup

Parameters: popup to open

Returns: none

Description: opens popup by adding the "open" class
*/
function openPopup() {
    popup.classList.add("open");
}

/* 
Function: closePopup

Parameters: none

Returns: none

Description: closes the currently open popup by removing the "open" class
*/
function closePopup() {
    popup.classList.remove("open");
}



document.getElementById("new_spec_edit_mn").addEventListener("click", function() {
    popup = document.getElementById('edit_mn');
    openPopup();
});
document.getElementById("new_spec_edit_md").addEventListener("click", function() {
    popup = document.getElementById('edit_md');
    openPopup();
});

document.getElementById("exit_button_mn").addEventListener("click", function() {
    closePopup();
});


document.getElementById("exit_button_md").addEventListener("click", function() {
    closePopup();
});

document.getElementById("done_button_md").addEventListener("click", function() {
    const typeValue = document.getElementById("type_input").value.trim();
    // save data to db
    for (const key in metadataOptions) {
        metadataOptions[key].forEach(value => {
          console.log(`'${typeValue}', '${key}', '${value}', 'NULL'`);
        });
    }
    closePopup();
});


document.querySelectorAll('.md').forEach(group => {
    const key = group.dataset.key;
    const input = group.querySelector('input');
    const button = group.querySelector('button');
    const listDiv = group.querySelector('.option-list');
  
    function addOption() {
      const value = input.value.trim();
      if (value && !metadataOptions[key].includes(value)) {
        metadataOptions[key].push(value);
        const p = document.createElement('p');
        p.textContent = value;
        listDiv.appendChild(p);
        input.value = '';
      }
    }
  
    button.addEventListener('click', addOption);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addOption();
      }
    });
  });
  