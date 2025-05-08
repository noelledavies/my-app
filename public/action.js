// variables

const pdfSelect = document.getElementById('pdf-select');
const optionsSelect = document.getElementById('options-select');
const displayPDF = document.getElementById('display-pdfs');

let selectedDiv = null;
let popup = document.getElementById('popup');

function updateModelNumber() {
    const allSelections = document.querySelectorAll('#popup-body-main select.selection');
    let modelNumberParts = [];
  
    for (let select of allSelections) {
      const label = select.previousElementSibling?.textContent.trim();
  
      // Change "Max Field" to whatever label text should cause it to stop
      if (label === "FINISH") break;
  
      const val = select.value;
      modelNumberParts.push(val);
    }
  
    const modelNumber = modelNumberParts.join('-');
    document.getElementById('mn').textContent = modelNumber;
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

    fetch('/api/selections')
    .then(res => res.json())
    .then(selections => {
        selections.forEach(sel => {
            if (sel.type == selectedDiv.dataset.type) {
                const display_div = document.createElement('div');
                if (sel.field_name != "notes") {
                    const display_label = document.createElement('label');
                display_label.textContent = sel.field_name;
                display_div.appendChild(display_label);

                const display_select = document.createElement('select');
                display_select.textContent = sel.field_name;
                display_select.classList.add('selection');
                display_div.appendChild(display_select);

                fetch('/api/options')
                .then(res => res.json())
                .then(options => {
                    options.forEach(opt => {
                        if (opt.field_name == sel.field_name) {
                            const new_opt = document.createElement('option');
                            new_opt.textContent = opt.option_name;
                            new_opt.option = opt.option_name;
                            display_select.appendChild(new_opt);
                        }   
                    });
                    display_select.addEventListener('change', updateModelNumber);
                    updateModelNumber();
                });
                displayPDFdetails.appendChild(display_div);
                }
            }   
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






