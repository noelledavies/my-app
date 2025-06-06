

// GLOBAL VARIABLES
const pdfSelect = document.getElementById('pdf-select');
const optionsSelect = document.getElementById('options-select');
const displayPDF = document.getElementById('display-pdfs');
const displayPDFdetails = document.getElementById('popup-body-main');
let curValueSet = [];
let curOptions = [];

let selectedDiv = null;
let popup = document.getElementById('popup');



// FUNCTIONS
/* 
Function: updateModelNumber

Parameters: none

Returns: none

Description: updates the model number string with current .values of each select element with in_mn set to 1
*/
function updateModelNumber(cur) {
  const mn_update = document.getElementById("mn");
  mn_update.textContent = cur.join('-');
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
Function: convertVoltageValue

Parameters: str - string to be converted

Returns: concat "V" at end

Description: corrects the formatting from the input lumen value to properly populate lumen level field
*/
function convertVoltageValue(str) {
  // regex to get trailing 2 digits
  const numericPart = str.match(/\d+/);
  if (numericPart) {
    return `${numericPart}V`;
  } else {
    return str;
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
  // here need to isolate and assign all data to variables for use in the db post below
  // plan out how to isolate and structure the passing of this data for the excel sheet
  

  // const entries = [{
  //   type: type_value,
  //   spec_sheet: filePath,
  //   manufacturer: manufacturer,
  //   model_num: curValueSet,
  //   voltage_req: /*var here */,
  //   source: /*var here */,
  //   wattage: /*var here */,
  //   lumen_level /*var here */,
  //   color_temp: /*var here */,
  //   driver_req: /*var here */,
  //   dimensions: /*var here */,
  //   mounting_type:/*var here */,
  //   luminaire_type: /*var here */,
  //   notes: /*var here */
  // }];

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
    display_mn.textContent = "------------------------";
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
      let selected = '';

      labels.forEach(label => {
        if (label.textContent.trim().toLowerCase() === 'voltage') {
          const selected_div = label.nextElementSibling;
          selected = selected_div.querySelector('.selected-div');
        }
      });

      let selected_div = document.querySelector('.voltage-requirement');

      if (selected_div) {
        const input = selected_div.querySelector('input');
        if (input) {
          input.remove();
        }
        const existing_p = selected_div.querySelector('p');
        if (existing_p) {
          existing_p.remove();
        }

        const new_p = document.createElement('p');
        new_p.textContent = convertVoltageValue(selected.dataset.value);
        selected_div.appendChild(new_p);
      } else {
        console.log("No element with class 'voltage' found.");
      }
    }

    function getLumens() {
      const labels = document.querySelectorAll('#popup-body-main label');
      let selected = '';
      labels.forEach(label => {
        if (label.textContent.trim().toLowerCase() === 'lumens') {
          const selected_div = label.nextElementSibling;
          selected = selected_div.querySelector('.selected-div');
        }
      });
      let selected_div = document.querySelector('.lumen-level');

      if (selected_div) {
        const input = selected_div.querySelector('input');
        if (input) {
          input.remove();
        }
        const existing_p = selected_div.querySelector('p');
        if (existing_p) {
          existing_p.remove();
        }

        let new_p = document.createElement('p');
        new_p.textContent = convertLumenValue(selected.dataset.value);
        selected_div.appendChild(new_p);
      } else {
        console.log("No element with class 'lumen level' found.");
      }
    }

    function getColor() {
      const labels = document.querySelectorAll('#popup-body-main label');
      let selected = '';

      labels.forEach(label => {
        if (
          label.textContent.trim().toLowerCase() === 'color temperature' ||
          label.textContent.trim().toLowerCase() === 'color temp'
        ) {
          const selected_div = label.nextElementSibling;          
          selected = selected_div.querySelector('.selected-div');
        }
      });

      let selected_div = document.querySelector('.color-temperature-k');

      if (selected_div) {
        const input = selected_div.querySelector('input');
        if (input) {
          input.remove();
        }
        const existing_p = selected_div.querySelector('p');
        if (existing_p) {
          existing_p.remove();
        }

        const new_p = document.createElement('p');
        new_p.textContent = convertColorTempValue(selected.dataset.value);
        selected_div.appendChild(new_p);
      } 
    }

    function buildBox(title, p, fieldKey = "") {
      const dynamic_div = document.createElement('div');
      dynamic_div.className = "dynamic-box";

      const display_div = document.createElement('div');
      display_div.className = title.replace(/\s+/g, '-').toLowerCase();
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

      dynamic_div.appendChild(display_div);

      displayPDFdetails.appendChild(dynamic_div);
    }



    async function updateCurrentValueSet() {
      try {
        curValueSet.length = 0;

      let mn_array = [];

        const response = await fetch(`/api/in_mn`);
        const data = await response.json();
        const matching_mn = data.filter(obj => obj.type === selectedDiv.dataset.type);
        matching_mn.forEach(obj => {
          mn_array.push(obj.field_name.replace(/[-_]+/g, ' ').trim().toUpperCase());
        });
        document.querySelectorAll('.dropdown-wrapper').forEach(sel => {
          if (mn_array.includes(sel.querySelector('label').textContent)) {
            const custom_select = sel.querySelector('div')
            
            if (custom_select.querySelector('div').dataset.value == "NONE") {
              curValueSet.push(null);
            } else {
              curValueSet.push(custom_select.querySelector('div').dataset.value);
            }            
          }
        });

      } catch (err) {
        console.error("Fetch error:", err);
        return false;
      }

      updateModelNumber(curValueSet);
      
      // curValueSet.length = 0;

      // let mn_array = [];

      // fetch('/api/in_mn')
      //   .then(res => res.json())
      //   .then(mn => {
      //     matching_mn = mn.filter(obj => obj.type === selectedDiv.dataset.type);
      //     matching_mn.forEach(obj => {
      //       mn_array.push(obj.field_name.replace(/[-_]+/g, ' ').trim().toUpperCase());
      //     });
      //     document.querySelectorAll('.dropdown-wrapper').forEach(sel => {
      //       if (mn_array.includes(sel.querySelector('label').textContent)) {
      //         if (sel.dataset.value == "NONE") {
      //           curValueSet.push(null);
      //         } else {
      //           curValueSet.push(sel.dataset.value);
      //         }            
      //       }
      //     });
      //   });

        
      }

    // function updateRestrictions() {
      
    //   curOptions.forEach(opt => {
    //     if (curValueSet.includes(opt.dependent)) {
    //       const labels = document.querySelectorAll('#popup-body-main label');
    //       labels.forEach(label => {
    //         if (label.textContent.trim().toLowerCase() === opt.field_name) {
    //           const select = label.nextElementSibling;
    //           if (select && select.tagName === 'SELECT') {
    //             console.log("This doesn't work right now."); 
    //             // need to find a way to make the dependencies generalized such 
    //             // that if multiplke exist they are all handled properly. This current 
    //             // implementation would only work for one being lumens and it is very 
    //             // resource intensive imo.
    //           }
    //         }
    //       });
    //     }
    //   });
    // }

    fetch('/api/unique_selections')
    .then(res => res.json())
    .then(selections => {
      fetch('/api/selections')
        .then(res => res.json())
        .then(options => {
          selections.forEach(sel => {
            if (sel.type === selectedDiv.dataset.type) {

              const wrapper_div = document.createElement('div');
              wrapper_div.className = "dropdown-wrapper";

              const display_label = document.createElement('label');
              display_label.textContent = sel.field_name
              .replace(/[-_]+/g, ' ')
              .trim()
              .toUpperCase();
              wrapper_div.appendChild(display_label);

              const dropdown = document.createElement('div');
              dropdown.className = 'custom-dropdown selection';

              const selected = document.createElement('div');
              selected.className = 'selected-div';
              selected.textContent = 'Select...';
              dropdown.appendChild(selected);

              const ul = document.createElement('ul');
              ul.className = 'dropdown-options';

              const matchingOptions = options.filter(opt =>
                opt.field_name === sel.field_name && opt.type === selectedDiv.dataset.type
              );
              matchingOptions.forEach(opt => {
                curOptions.push(opt);
                const li = document.createElement('li');
                if (opt.option_name == null) {
                  li.textContent = "NONE";
                } else {
                  li.textContent = opt.option_name;
                }

                li.addEventListener('click', () => {
                  if (opt.option_name == null) {
                    selected.textContent = "NONE";
                    selected.dataset.value = "NONE";
                  } else {
                    selected.textContent = opt.option_name;
                    selected.dataset.value = opt.option_name;
                  }

                  updateCurrentValueSet();

                  ul.classList.remove('show');

                  if (sel.field_name.trim().toLowerCase() == "voltage") {
                    voltage_flag = 1;
                    getVoltage();
                  }
                  if (sel.field_name.trim().toLowerCase() == "lumens") {
                    lumens_flag = 1;
                    getLumens();
                  }
                  if (sel.field_name.trim().toLowerCase() == "color temperature" || sel.field_name.trim().toLowerCase() == "color_temp" ) {
                    color_flag = 1;
                    getColor();
                  }
                });
                ul.appendChild(li);
              });

              selected.addEventListener('click', () => {
                document.querySelectorAll('.dropdown-options').forEach(u => u.classList.remove('show'));
                ul.classList.toggle('show');
              });

              dropdown.appendChild(ul);
              wrapper_div.appendChild(dropdown);
              displayPDFdetails.appendChild(wrapper_div);

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
            buildBox("COLOR TEMPERATURE K", true, "color temperature k");
            getColor();
          } else {
            buildBox("COLOR TEMPERATURE K", false);
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
