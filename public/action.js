// new section for getting db data

const pdfSelect = document.getElementById('pdf-select');
const optionsSelect = document.getElementById('options-select');
const displayPDF = document.getElementById('display-pdfs');

let selectedDiv = null;

// 1. Load the PDFs on page load
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

    });

    // Automatically trigger first dropdown's options if available
    if (pdfs.length > 0) {
      loadOptionsForPDF(pdfs[0].id);
    }
  });

  // TO BE UPDATED BUT BUTTON AND SELECTION WORKS
  document.getElementById("open_button").addEventListener("click", function() {
    if (selectedDiv) {
        alert(`Selected div says: ${selectedDiv.textContent}`);
    }
  });
// // 2. Load dropdown options for selected PDF
// function loadOptionsForPDF(pdfId) {
//   fetch(`/api/pdfs/${pdfId}/options`)
//     .then(res => res.json())
//     .then(options => {
//       optionsSelect.innerHTML = ''; // clear previous options
//       options.forEach(opt => {
//         const option = document.createElement('option');
//         option.value = opt.id;
//         option.textContent = opt.option_text;
//         optionsSelect.appendChild(option);
//       });
//     });
// }

// // 3. When user selects a different PDF, load its options
// pdfSelect.addEventListener('change', (e) => {
//   const selectedPdfId = e.target.value;
//   loadOptionsForPDF(selectedPdfId);
// });





/* THIS WILL NEED TO BE HOW DB IS SET UP TO RETRIEVE INFO */
const data = {
    FA: {Series: ["BLPW2", "BLPW4", "BLPW8"],
        Lumens: ["8L", "20L", "33L"],
        Lens: ["ADP", "ADSM", "SDP"]
        },
    FB: {Series: ["CLX"],
        Length: ["L24", "L36", "L48"],
        Lumens: ["1500", "20L", "33L"]
        }
}

// Populating PDF Dropdown Details
document.getElementById("pdfName").addEventListener("change", function() {
    const pdfName = this.value;
    const pdfCategories = document.getElementById("pdfCategories");

    pdfCategories.innerHTML = "";

    if (pdfName && data[pdfName]) {
        Object.keys(data[pdfName]).forEach(item => {
            // div
            let newEntry = document.createElement("div");
            // label
            let label = document.createElement("label");
            label.textContent = item;
            // select
            let select = document.createElement("select");
            // options
            data[pdfName][item].forEach(options => {
                let option = document.createElement("option");
                option.value = options;
                option.textContent = options;
                select.append(option);
            });
            // adding label and select to div
            newEntry.appendChild(label);
            newEntry.appendChild(select);
            // add div to parent div
            pdfCategories.appendChild(newEntry);
        });
    }
});


document.getElementById("pdfCategories").addEventListener("change", function() {
    StringID = "";

    prodID.innerHTML = "";

    document.querySelectorAll("#pdfCategories select").forEach(select => {
        StringID += select.value + " ";
    });

    let DisplayID = document.createElement("p");
    DisplayID.textContent = StringID;
    prodID.appendChild(DisplayID);
});

