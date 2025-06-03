
// GLOBAL VARIABLES
const pdfSelect = document.getElementById('pdf-select');
const optionsSelect = document.getElementById('options-select');
const displayPDF = document.getElementById('display-pdfs');
const displayPDFdetails = document.getElementById('popup-body-main');

let selectedDiv = null;
let popup = document.getElementById('popup');



// FUNCTIONS
/* 
Function: updateModelNumber

Parameters: none

Returns: none

Description: updates the model number string with current .values of each select element with in_mn set to 1
*/
function updateModelNumber() {
  
}


/* 
Function: convertLumenValue

Parameters: str - string to be converted

Returns: converted string with everything after first 2 digits replaced by "00lm"

Description: corrects the formatting from the input lumen value to properly populate lumen level field
*/
function convertLumenValue(str) {
  // regex to get leading digits
  const numericPartStart = str.match(/^\d+/);
  if (numericPartStart) {
    return `${numericPartStart[0]}00lm`;
  } else {
    return null;
  }
}

/* 
Function: convertColorTempValue

Parameters: str - string to be converted

Returns: converted string with everything before last 2 digits removed and concat "00lm" at end

Description: corrects the formatting from the input lumen value to properly populate lumen level field
*/
function convertColorTempValue(str) {
  // regex to get trailing 2 digits
  const numericPartEnd = str.match(/\d{2}$/);
  if (numericPartEnd) {
    return `${numericPartEnd[0]}00K`;
  } else {
    return null;
  }
}


/* 
Function: closePopup

Parameters: none

Returns: none

Description: closes the currently open popup by removing the "open" class
*/
function closePopup() {
  popup.classList.remove("open");
  document.querySelectorAll('.pdf_in_use').forEach(el => el.remove());
}


/* 
Function: exportEntry

Parameters: none

Returns: none

Description: collects all current .values of each select element and formats into database ready format
*/
function exportEntry() {
  // variables
  const allSelections = document.querySelectorAll('#popup-body-main select.selection');
  const type = selectedDiv?.dataset.type;
  let exportArray = [];
  let modelNumberParts = [];
  let otherParts = [];

  // iterate through select elements
  for (let select of allSelections) {
    // variables
    const label = select.previousElementSibling?.textContent.trim();
    const val = select.value;
    const rule = mnRules.find(rule => rule.type === type && rule.field_name === label);

    // check if qualfies
    if (val && val !== "null" && rule && rule.in_mn === 1) {
      modelNumberParts.push(val);
    } else if (label == "voltage_req" || 
                label == "source" || 
                label == "wattage" || 
                label == "lumen_level" || 
                label == "color_temp_k" || 
                label == "driver_req" || 
                label == "dimensions" || 
                label == "mounting_type" ||
                label == "luminaire_type") {
      otherParts.push(val);
    }
  }

  // separater
  const modelNumber = modelNumberParts.join('-');

  exportArray.push(modelNumber);

  for (let each of otherParts) {
    exportArray.push(each);
  }

  const [
    model_num, voltage_req, source, wattage,
    lumen_level, color_temp_k, driver_req,
    dimensions, mounting_type, luminaire_type
  ] = exportArray;
  
  fetch('/api/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model_num, voltage_req, source, wattage,
      lumen_level, color_temp_k, driver_req,
      dimensions, mounting_type, luminaire_type
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log('Entry added:', data);
      // maybe show a confirmation to the user?
    })
    .catch(err => {
      console.error('Failed to add entry:', err);
    });
}



// DB OPERATIONS ON INDEX.HTML
/* 
Operation: fetch and display PDF metadata

Parameters: none

Returns: none directly - modifies DOM

Description: calls the backend API endpoint `/api/pdfs` to retrieve a list of PDF records then for each PDF
creates a clickable DOM element showing its type, manufacturer, and link used to populate the popup interface
*/
fetch('/api/pdfs')
.then(res => res.json())
.then(pdfs => {
  pdfs.forEach(pdf => {
      // div holding all display meta data for pdf
      const display = document.createElement('div');
      display.className = "file";

      display.addEventListener('click', () => {
          document.querySelectorAll('.file').forEach(d => d.classList.remove('selected'));
          display.classList.add('selected');
          selectedDiv = display;
      });

      // title of file
      const display_title = document.createElement('p');
      display_title.textContent = pdf.type;
      display.appendChild(display_title);

      // title of file
      const display_manu = document.createElement('p');
      display_manu.textContent = pdf.manufacturer;
      display.appendChild(display_manu);

      // link to pdf
      const display_link = document.createElement('a');
      display_link.href = pdf.spec_sheet;
      display_link.textContent = pdf.type;
      display_link.target = '_blank';
      display.appendChild(display_link);

      displayPDF.appendChild(display);

      display.setAttribute("data-type", pdf.type);
      display.setAttribute("data-manufacturer", pdf.manufacturer);
      display.setAttribute("data-link", pdf.spec_sheet);
  });
});



  // popup functions
  function openPopup(selectedDiv) {

    popup.classList.add("open");

    let currentSelections = {};

    document.getElementById('popup-body-main').innerHTML = '';

    const type = selectedDiv.dataset.type;
    const manufacturer = selectedDiv.dataset.manufacturer;
    const link = selectedDiv.dataset.link;

    const mn = document.getElementById("popup-header-mn");
    const display_mn = document.createElement('p');
    display_mn.textContent = "________________________";
    display_mn.id = "mn";
    display_mn.className = "pdf_in_use";
    mn.appendChild(display_mn);

    const manu = document.getElementById("popup-header-manu");
    const display_manu = document.createElement('p');
    display_manu.textContent = `${manufacturer}`;
    display_manu.className = "pdf_in_use";
    manu.appendChild(display_manu);

    const lk = document.getElementById("popup-header-link");
    const display_lk = document.createElement('a');
    display_lk.href = `${link}`;
    display_lk.textContent = `${link}`;
    display_lk.target = '_blank';
    display_lk.className = "pdf_in_use";
    lk.appendChild(display_lk);
    
    let voltage_flag = 0;
    let lumens_flag = 0;
    let color_flag = 0;

    function getVoltage() {
      const labels = document.querySelectorAll('#popup-body-main label');
      labels.forEach(label => {
        if (label.textContent.trim().toLowerCase() === 'voltage') {
          const select = label.nextElementSibling;
          if (select && select.tagName === 'SELECT') {
            const voltageValue = select.value;

            const voltageReqP = document.querySelector('[data-field="voltage"]');
            if (voltageReqP) {
              voltageReqP.textContent = voltageValue;
            }
          }
        }
      });
    }

    function getLumens() {
      const labels = document.querySelectorAll('#popup-body-main label');
      labels.forEach(label => {
        if (label.textContent.trim().toLowerCase() === 'lumens') {
          const select = label.nextElementSibling;
          if (select && select.tagName === 'SELECT') {
            const lumensValue = select.value;

            const lumensLevP = document.querySelector('[data-field="lumens"]');
            if (lumensLevP) {
              lumensLevP.textContent = convertLumenValue(lumensValue);
            }
          }
        }
      });
    }

    function getColor() {
      const labels = document.querySelectorAll('#popup-body-main label');
      labels.forEach(label => {
        if (label.textContent.trim().toLowerCase() === 'color temperature' || label.textContent.trim().toLowerCase() === 'color_temp') {
          const select = label.nextElementSibling;
          if (select && select.tagName === 'SELECT') {
            const colorValue = select.value;

            const colorTempP = document.querySelector('[data-field="color temperature"]');
            if (colorTempP) {
              colorTempP.textContent = convertColorTempValue(colorValue);
            }
          }
        }
      });
    }

    function buildBox(title, p, fieldKey = "") {
      const display_div = document.createElement('div');
      const display_label = document.createElement('label');
      display_label.textContent = title;
      display_div.appendChild(display_label);

      if(p === true) {
        const display_p = document.createElement('p');
        if (fieldKey) display_p.setAttribute('data-field', fieldKey);
        display_div.appendChild(display_p);
      } else {
        const display_input = document.createElement('input');
        display_input.type = "text";
        display_div.appendChild(display_input);
      }

      displayPDFdetails.appendChild(display_div);
    }

    fetch('/api/unique_selections')
    .then(res => res.json())
    .then(selections => {
      fetch('/api/selections')
        .then(res => res.json())
        .then(options => {
          selections.forEach(sel => {
            if (sel.type === selectedDiv.dataset.type) {
              const display_div = document.createElement('div');
              const display_label = document.createElement('label');
              display_label.textContent = sel.field_name;
              display_div.appendChild(display_label);

              const display_select = document.createElement('select');
              display_select.classList.add('selection');
              display_div.appendChild(display_select);

              // Filter once, then add options
              const matchingOptions = options.filter(opt =>
                opt.field_name === sel.field_name && opt.type === selectedDiv.dataset.type
              );
              matchingOptions.forEach(opt => {
                const new_opt = document.createElement('option');
                new_opt.textContent = opt.option_name;
                new_opt.value = opt.option_name;
                display_select.appendChild(new_opt);
              });


              display_select.addEventListener('change', updateModelNumber);
              displayPDFdetails.appendChild(display_div);

              if (sel.field_name.trim().toLowerCase() == "voltage") {
                voltage_flag = 1;
                display_select.addEventListener('change', getVoltage);
              }
              if (sel.field_name.trim().toLowerCase() == "lumens") {
                lumens_flag = 1;
                display_select.addEventListener('change', getLumens);
              }
              if (sel.field_name.trim().toLowerCase() == "color temperature" || sel.field_name.trim().toLowerCase() == "color_temp" ) {
                color_flag = 1;
                display_select.addEventListener('change', getColor);
              }
            }
          });
          if (voltage_flag == 1) {
            buildBox("VOLTAGE REQUIREMENT", true, "voltage");
            getVoltage();
          } else {
            buildBox("VOLTAGE REQUIREMENT", false);
          }

          if (lumens_flag == 1) {
            buildBox("LUMEN LEVEL", true, "lumens");
            getLumens();
          } else {
            buildBox("LUMEN LEVEL", false);
          }

          if (color_flag == 1) {
            buildBox("COLOR TEMPERATURE", true, "color temperature");
            getColor();
          } else {
            buildBox("COLOR TEMPERATURE", false);
          }
        });
      });

      // add to schedule listener
      document.getElementById("add_button").addEventListener("click", function() {
        closePopup();
        exportEntry();
      });
    }



// EVENT LISTENERS
  // open pdf selection listener
  document.getElementById("open_button").addEventListener("click", function() {
    if (selectedDiv) {
        openPopup(selectedDiv);

    } else {
        alert("Please select a PDF.")
    }
  });
  // close pdf selection listener
  document.getElementById("exit_button").addEventListener("click", function() {
    closePopup();
  });