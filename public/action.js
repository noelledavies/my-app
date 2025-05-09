// variables

const pdfSelect = document.getElementById('pdf-select');
const optionsSelect = document.getElementById('options-select');
const displayPDF = document.getElementById('display-pdfs');

let selectedDiv = null;
let popup = document.getElementById('popup');
let mn_rules = [];

function updateModelNumber() {
  const allSelections = document.querySelectorAll('#popup-body-main select.selection');
  const type = selectedDiv?.dataset.type;
  let modelNumberParts = [];

  for (let select of allSelections) {
    const label = select.previousElementSibling?.textContent.trim();
    const val = select.value;

    const rule = mnRules.find(rule => rule.type === type && rule.field_name === label);

    if (val && val !== "null" && rule && rule.in_mn === 1) {
      modelNumberParts.push(val);
    }
  }

  const modelNumber = modelNumberParts.join('-');
  document.getElementById('mn').textContent = modelNumber;
}

function convertLumenValue(str) {
  const numericPartStart = str.match(/^\d+/); // get leading digits
  return numericPartStart ? `${numericPartStart[0]}00lm` : null;
}

function convertColorTempValue(str) {
  const numericPartEnd = str.match(/\d{2}$/); // get trailing 2 digits
  return numericPartEnd ? `${numericPartEnd[0]}00K` : null;
}



//loading in pdfs
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

  const displayPDFdetails = document.getElementById('popup-body-main');

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
                  

  function closePopup() {
    popup.classList.remove("open");
    document.querySelectorAll('.pdf_in_use').forEach(el => el.remove());
  }

  document.getElementById("open_button").addEventListener("click", function() {
    if (selectedDiv) {
        openPopup(selectedDiv);

    } else {
        alert("Please select a PDF.")
    }
  });

  document.getElementById("exit_button").addEventListener("click", function() {
    closePopup();
  });

  document.getElementById("add_button").addEventListener("click", function() {
    closePopup();
    
    // also do other things
  });
