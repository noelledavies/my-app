
// GLOBAL VARIABLES
const pdfSelect = document.getElementById('pdf-select');
const optionsSelect = document.getElementById('options-select');
const displayPDF = document.getElementById('display-pdfs');
const displayPDFdetails = document.getElementById('popup-body-main');

let selectedDiv = null;
let popup = document.getElementById('popup');
let mn_rules = [];


// FUNCTIONS
/* 
Function: updateModelNumber

Parameters: none

Returns: none

Description: updates the model number string with current .values of each select element with in_mn set to 1
*/
function updateModelNumber() {
  // variables
  const allSelections = document.querySelectorAll('#popup-body-main select.selection');
  const type = selectedDiv?.dataset.type;
  let modelNumberParts = [];

  // iterate through select elements
  for (let select of allSelections) {
    // variables
    const label = select.previousElementSibling?.textContent.trim();
    const val = select.value;
    const rule = mnRules.find(rule => rule.type === type && rule.field_name === label);

    // check if qualfies
    if (val && val !== "null" && rule && rule.in_mn === 1) {
      modelNumberParts.push(val);
    }
  }

  // seperater
  const modelNumber = modelNumberParts.join('-');

  // update document with new model number
  document.getElementById('mn').textContent = modelNumber;
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

  // seperater
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

    let seriesSelect = null;
    let lumensSelect = null;
    let lumen_levelSelect = null;
    let color_temp_kSelect = null;
    let color_tempSelect = null;

    fetch('/api/mn-rules')
    .then(res => res.json())
    .then(rules => {
      mnRules = rules;

      fetch('/api/unique_selections')
      .then(res => res.json())
      .then(selections => {
          selections.forEach(sel => {
              if (sel.type == selectedDiv.dataset.type) {
                  const display_div = document.createElement('div');
                  const display_label = document.createElement('label');
                  display_label.textContent = sel.field_name;
                  display_div.appendChild(display_label);

                  const display_select = document.createElement('select');
                  display_select.textContent = sel.field_name;
                  display_select.classList.add('selection');
                  display_div.appendChild(display_select);

                  fetch('/api/selections')
                  .then(res => res.json())
                  .then(options => {
          
                      // First pass: build selects and keep references
                      options.forEach(opt => {
                          if (opt.field_name == sel.field_name) {
                            // non dependent
                              if (sel.field_name == "series") {
                              seriesSelect = display_select;
                              }
                              if (sel.field_name == "color_temp") {
                                color_tempSelect = display_select;
                              }
                              // dependent
                              if (sel.field_name == "lumens") {
                              lumensSelect = display_select;
                              }
                              if (sel.field_name == "lumen_level") {
                                lumen_levelSelect = display_select;
                              }
                              if (sel.field_name == "color_temp_k") {
                                color_temp_kSelect = display_select;
                              }

                              // Add non-dependent fields (or all for now, and filter later)
                              if (sel.field_name != "lumens" || sel.field_name != "lumen_level" || sel.field_name != "color_temp_k") {
                              const new_opt = document.createElement('option');
                              new_opt.textContent = opt.option_name;
                              new_opt.value = opt.option_name;
                              display_select.appendChild(new_opt);
                              }
                          }
                      });

                      // After all selects are created and attached
                      if (seriesSelect && lumensSelect && lumen_levelSelect && color_temp_kSelect && color_tempSelect) {
                      const updateLumensOptions = () => {

                          // Clear existing lumens options
                          lumensSelect.innerHTML = '';

                          const selectedSeries = seriesSelect.value;

                          options.forEach(opt => {
                          if (opt.field_name == "lumens") {
                              if (!opt.dependent || opt.dependent === selectedSeries) {
                              const new_opt = document.createElement('option');
                              new_opt.textContent = opt.option_name;
                              new_opt.value = opt.option_name;
                              lumensSelect.appendChild(new_opt);
                              }
                          }
                          
                      });
                      
                      updateModelNumber();
                  };
                  const updateLumenLevelOptions = () => {

                    // Clear existing lumens options
                    lumen_levelSelect.innerHTML = '';

                    const lumens_val = document.createElement('option');
                    lumens_val.textContent = convertLumenValue(lumensSelect.value);
                    lumens_val.value = convertLumenValue(lumensSelect.value);
                    lumen_levelSelect.appendChild(lumens_val);
                  };
                  const updateColorTempKOptions = () => {

                    // Clear existing lumens options
                    color_temp_kSelect.innerHTML = '';

                    const color_temp_val = document.createElement('option');
                    color_temp_val.textContent = convertColorTempValue(color_tempSelect.value);
                    color_temp_val.value = convertColorTempValue(color_tempSelect.value);
                    color_temp_kSelect.appendChild(color_temp_val);
                  };

                  // Initial populate
                  updateLumensOptions();
                  updateLumenLevelOptions();
                  updateColorTempKOptions();

                  // When series changes, update lumens options
                  seriesSelect.addEventListener('change', () => {
                      updateLumensOptions();
                  });
                  lumensSelect.addEventListener('change', () => {
                    updateLumenLevelOptions();
                  });
                  color_tempSelect.addEventListener('change', () => {
                    updateColorTempKOptions();
                  });
                }
                display_select.addEventListener('change', updateModelNumber);
                updateModelNumber();
              });
              displayPDFdetails.appendChild(display_div);
            }   
          });
        });
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

  // add to schedule listener
  document.getElementById("add_button").addEventListener("click", function() {
    closePopup();
    exportEntry();
    // also do other things
  });