let popup = document.getElementById('edit_mn');
let add_field = document.getElementById('field_location');
let flag = 0;
// Store category-wise arrays
const metadataOptions = {
    voltage: [],
    source: [],
    driver: [],
    dimensions: [],
    mounting: [],
    luminaire: []
  };
let rows = [];

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

/* 
Function: addField

Parameters: none

Returns: none

Description: creates new div, filed_name entry, and options entry
*/
function addField() {
  const field_div = document.createElement('div');
  const upper_div = document.createElement('div');
  const field_name_input = document.createElement('input');
  const add_field_btn = document.createElement('button');
  const options_div = document.createElement('div');
  const option_input = document.createElement('input');
  const remove_field_btn = document.createElement('button');

  field_div.className = "md";
  upper_div.className = "upper";

  field_name_input.type = "text";
  field_name_input.className = "field_name";
  field_name_input.placeholder = "Field Name";

  add_field_btn.textContent = "Add Option";

  options_div.className = "option-list";

  option_input.type = "text";
  option_input.className = "basic_input";
  option_input.placeholder = "Option";

  remove_field_btn.textContent = "Remove Field";
  remove_field_btn.className = "remove_btn_field";

  remove_field_btn.addEventListener("click", (e) => {
    e.stopPropagation(); // important if you ever nest clickable things
    field_div.remove();
  });

  upper_div.appendChild(field_name_input);
  upper_div.appendChild(add_field_btn);


  field_div.appendChild(upper_div);
  field_div.appendChild(options_div);
  field_div.appendChild(option_input);
  field_div.appendChild(remove_field_btn);

  add_field.appendChild(field_div);

  field_name_input.addEventListener("blur", () => {
    const key = field_name_input.value.trim();
    
    if (key) {
      field_div.dataset.key = key;
      if (!metadataOptions[key]) {
        metadataOptions[key] = [];
      }

      setupOptionEntry(field_div);
    }
  });
}

function setupOptionEntry(group) {
  const input = group.querySelector('input.basic_input');
  const button = group.querySelector('button');
  const listDiv = group.querySelector('.option-list');

  function addOption() {
    const key = group.dataset.key;
    
    if (!key) {
      alert("Please enter a field name first!");
      input.focus();
      return;
    }

    const value = input.value.trim();
    if (value && !metadataOptions[key].includes(value)) {
      metadataOptions[key].push(value);

      const optionWrapper = document.createElement('div');
      optionWrapper.className = 'option-item';

      const p = document.createElement('p');
      p.textContent = value;

      const b = document.createElement('button');
      b.textContent = '-';
      b.className = 'remove_btn';

      optionWrapper.appendChild(p);
      optionWrapper.appendChild(b);
      listDiv.appendChild(optionWrapper);

      input.value = '';

      b.addEventListener('click', (e) => {
        optionWrapper.remove();

        const index = metadataOptions[key].indexOf(value);
        if (index > -1) {
          metadataOptions[key].splice(index, 1);
        }
      });
    }
  }

  button.addEventListener('click', addOption);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOption();
    }
  });
}

function clearAll() {
  document.querySelectorAll('input').forEach(input => {
    if (input.type === 'file' || input.type === 'text') {
      input.value = '';
    }
  });
}

function checkAll() {
  flag = 0;
  document.querySelectorAll('input').forEach(input => {
    if (!input.value) {
      flag = 1;
    }
  });
  if (flag != 1) {
    alert("Submitted.");
  } else {
    alert("Missing field. Please review upload details.");
  }
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
    const type_value = document.getElementById("type_input").value.trim();
    // save data to db
    for (const key in metadataOptions) {
        metadataOptions[key].forEach(value => {
          rows.push({
            type: type_value,
            field_name: key,
            option_name: value,
            dependent: null
          });
        });
    }
    closePopup();
});



document.getElementById("done_button_mn").addEventListener("click", function() {
  const type_value = document.getElementById("type_input").value.trim();
  const field_divs = document.querySelectorAll('#field_location .md');

  const model_number_options = {};
  
  field_divs.forEach( field =>  {
    const key = field.dataset.key;
    const option_elements = field.querySelectorAll('.option-list p');

    if (key) {
      model_number_options[key] = [];
      option_elements.forEach(p => {
        const value = p.textContent.trim();
        if (value) {
          rows.push({
            type: type_value,
            field_name: key,
            option_name: value,
            dependent: null // or some other value if needed
          });
        }
      });
    }
  });
  closePopup();
});

document.getElementById("add_field_btn").addEventListener("click", function() {
  addField();
});

document.querySelectorAll('.md').forEach(setupOptionEntry);
  
document.getElementById("save_button").addEventListener("click", function() {
  const type_value = document.getElementById("type_input").value.trim();
  const manufacturer = document.getElementById("manu_input").value.trim();
  const link_path = document.getElementById("basic_input_link").value.trim();
  let basics = [];
  basics.push({
    type: type_value,
    spec_sheet: link_path,
    manufacturer: manufacturer
  });

  fetch('/api/pdfs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(basics)
  })
  .then(response => {
    if (!response.ok) throw new Error("Failed to save metatdata");
    return response.json();
  })
  .then(data => {
    console.log("Saved to DB:", data);
    closePopup();
  })
  .catch(err => {
    console.error("Error posting to DB:", err);
  });
  

  fetch('/api/selections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rows)
  })
  .then(response => {
    if (!response.ok) throw new Error("Failed to save basic info");
    return response.json();
  })
  .then(data => {
    console.log("Saved to DB:", data);
    closePopup();
  })
  .catch(err => {
    console.error("Error posting to DB:", err);
  });

  clearAll();
  checkAll();

  // add it some kind of 1 submittion limit so multiple uploads can't occur
});