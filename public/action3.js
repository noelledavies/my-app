let popup = document.getElementById('edit_mn');
let add_field = document.getElementById('field_location');
let flag = 0;

// Store category-wise arrays
const metadataOptions = {
    source: [],
    driver_requirements: [],
    dimensions: [],
    mounting_type: [],
    luminaire_type: []
  };
let selection_rows = [];
let mn_rows = [];

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
  document.querySelectorAll('.option_box').forEach(box => {
    box.style.visibility = 'hidden';
  });

  popup.classList.remove("open");
}

/* 
Function: addField

Parameters: none

Returns: none

Description: creates new div, filed_name entry, and options entry
*/
function addField() {

  const check_valid = document.getElementById("add_field_input");
  if (!check_valid.value) {
    alert("Please enter a name for the field.")
    return;
  }

  const duplicate = Array.from(document.querySelectorAll('.md')).some(el => {
    return el.dataset.key?.trim().toLowerCase() === check_valid.value.trim().toLowerCase();
  });

  if (duplicate) {
    alert("A field with that name already exists.");
    return;
  }

  const field_section = document.getElementById("field_section");

  const md_div = document.createElement('div');
  md_div.className = "md";
  md_div.dataset.key = check_valid.value.trim().toLowerCase();

  const upper_div = document.createElement('div');
  upper_div.className = "upper";

  const upper_heading = document.createElement('p');
  upper_heading.textContent = check_valid.value.trim().toUpperCase();;

  const option_div = document.createElement('div');
  option_div.className = "option_box";

  const option_list_div = document.createElement('div');
  option_list_div.className = "option-list";

  const options_header = document.createElement('p');
  options_header.className = "options_header";
  options_header.textContent = "OPTIONS";

  const input_div = document.createElement('div');
  input_div.className = "input_section";

  const input_field = document.createElement('input');
  input_field.className = "basic_input";
  input_field.type = "text";

  const option_button = document.createElement('button');
  option_button.textContent = "Add Option";

  option_list_div.appendChild(options_header);
  input_div.appendChild(input_field);
  input_div.appendChild(option_button);

  option_div.appendChild(option_list_div);
  option_div.appendChild(input_div);

  upper_div.appendChild(upper_heading);

  md_div.appendChild(upper_div);
  md_div.appendChild(option_div);

  md_div.addEventListener('click', (e) => {
     e.preventDefault();

  });

  field_section.appendChild(md_div);

  check_valid.value = '';

  setupOptionEntry(md_div); 
}

function setupOptionEntry(group) {
  const input = group.querySelector('input.basic_input');
  const button = group.querySelector('button');
  const listDiv = group.querySelector('.option-list');
  const key = group.dataset.key;

  // Ensure the metadataOptions entry exists
  if (!metadataOptions[key]) {
    metadataOptions[key] = [];
  }

  function addOption() {
    const value = input.value.trim();
    
    if (!value) return;

    // Prevent duplicates
    if (metadataOptions[key].includes(value)) {
      alert("This option already exists.");
      input.value = '';
      return;
    }

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

    b.addEventListener('click', () => {
      optionWrapper.remove();

      const index = metadataOptions[key].indexOf(value);
      if (index > -1) {
        metadataOptions[key].splice(index, 1);
      }
    });
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
  let missingFields = [];

  document.querySelectorAll('.md').forEach(md => {
    const key = md.dataset.key || "Unnamed field";
    const options = md.querySelectorAll('.option-list .option-item');

    if (options.length === 0) {
      // No options added to this field
      const label = md.querySelector('.upper p')?.textContent.trim() || key;
      missingFields.push(label);
    }
  });

  if (missingFields.length === 0) {
    return true;
  } else {
    alert("Missing field(s):\n\n" + missingFields.join("\n"));
    return false;
  }
}

async function checkInDatabase(type) {
  try {
    const response = await fetch(`/api/check-pdf-exists?type=${encodeURIComponent(type)}`);
    const data = await response.json();
    return data.exists;
  } catch (err) {
    console.error("Fetch error:", err);
    return false;
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
    closePopup();
});


document.getElementById('edit_mn').addEventListener('click', function (e) {
  const clickedBox = e.target.closest('.md');
  if (!clickedBox) return;

  document.querySelectorAll('.md').forEach(box => {
    box.style.border = 'none'; // or the original border if you had one
    box.style.width = '40%';   // reset to original width
  });

  // Hide all option boxes
  document.querySelectorAll('.option_box').forEach(box => {
    box.style.visibility = 'hidden';
  });

  // Show the clicked box's option box
  const optionBox = clickedBox.querySelector('.option_box');
  if (optionBox) {
    optionBox.style.visibility = 'visible';
    clickedBox.style.border = 'solid #6eb236 1px';
    clickedBox.style.width = '44%';
  }
});




document.getElementById('edit_md').addEventListener('click', function (e) {
  const clickedBox = e.target.closest('.md');
  if (!clickedBox) return;

  document.querySelectorAll('.md').forEach(box => {
    box.style.border = 'none'; // or the original border if you had one
    box.style.width = '40%';   // reset to original width
  });

  // Hide all option boxes
  document.querySelectorAll('.option_box').forEach(box => {
    box.style.visibility = 'hidden';
  });

  // Show the clicked box's option box
  const optionBox = clickedBox.querySelector('.option_box');
  if (optionBox) {
    optionBox.style.visibility = 'visible';
    clickedBox.style.border = 'solid #6eb236 1px';
    clickedBox.style.width = '44%';
  }
});

document.getElementById("done_button_mn").addEventListener("click", function() {
  closePopup();
});


document.getElementById("add_field_btn").addEventListener("click", function() {
  addField();
});
document.getElementById("add_field_input").addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addField();
    }
  });

document.querySelectorAll('.md').forEach(setupOptionEntry);
  
document.getElementById("save_button").addEventListener("click", async function() {

  const type_value = document.getElementById("type_input").value.trim();
  const manufacturer = document.getElementById("manu_input").value.trim().toUpperCase();
  const fileInput = document.getElementById("basic_input_link");
  const file = fileInput.files[0];
  let filePath = null;

  if (!type_value) {
    alert("Please enter a valid type name.");
    return;
  }

  if (!manufacturer) {
    alert("Please enter a valid manufacturer name.");
    return;
  }

  if (!file) {
    alert("Please select a PDF file.");
    return;
  }

  const exists = await checkInDatabase(type_value);
  if (exists) {
    alert("This type value already exists in the database. Please review your entry.");
    return;
  }

  const allFieldsFilled = checkAll();
  if (!allFieldsFilled) return;

  const formData = new FormData();
  formData.append("specsheet", file); // 'specsheet' must match the multer field name

  try {
    const response = await fetch('/upload-pdf', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload failed. Server said:", errorText);
      throw new Error("Failed to upload PDF");

    }
    const data = await response.json();
    console.log("PDF saved at:", data.filePath);
    filePath = data.filePath;
  } catch (err) {
    console.error("Upload error:", err);
  }

  const basics = [{
    type: type_value,
    spec_sheet: filePath,
    manufacturer: manufacturer
  }];

  fetch('/api/pdfs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(basics)
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

  selection_rows = [];
  mn_rows = [];

  const field_divs = document.querySelectorAll('.md');
  field_divs.forEach(field => {
    const key = field.dataset.key;
    const option_elements = field.querySelectorAll('.option-list .option-item p');

    if (key) {
      const in_mn_value = document.getElementById('edit_mn').classList.contains('open') ? 1 : 0;

      option_elements.forEach(p => {
        const value = p.textContent.trim().toUpperCase();
        if (value) {
          selection_rows.push({
            type: type_value,
            field_name: key.toUpperCase(),
            option_name: value,
            dependent: null
          });
        }
      });
    }
  });
  const mdFieldsInMN = document.querySelectorAll('#edit_mn #field_section .md');

  mdFieldsInMN.forEach(md => {
    // Do something with each .md inside the model number editor section
    const key = md.dataset.key;
    mn_rows.push({
      type: type_value,
      field_name: key.toUpperCase(),
      in_mn: 1
    });
  });

  fetch('/api/selections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(selection_rows)
  })
  .then(response => {
    if (!response.ok) throw new Error("Failed to save selection info");
    return response.json();
  })
  .then(data => {
    console.log("Saved to DB:", data);
    closePopup();
  })
  .catch(err => {
    console.error("Error posting to DB:", err);
  });

  fetch('/api/in_mn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mn_rows)
  })
  .then(response => {
    if (!response.ok) throw new Error("Failed to save selection info");
    return response.json();
  })
  .then(data => {
    console.log("Saved to DB:", data);
    closePopup();
  })
  .catch(err => {
    console.error("Error posting to DB:", err);
  });

  alert("Submitted.");
  clearAll();
});

document.getElementById('exit_upload_button').addEventListener('click', function () {
  window.location.href = 'index.html';
});