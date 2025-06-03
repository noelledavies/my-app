// auto populate fields for upload testing
// STEP 1: Open and populate MODEL NUMBER fields
document.getElementById('new_spec_edit_mn').click();

setTimeout(() => {
  const mnFields = {
    'series': ['BLWP2', 'BLWP4', 'BLWP8'],
    'lens': ['ADP', 'ADSM'],
    'voltage': ['MVOLT', '120'],
    'driver': ['EZ1', 'GZ1'],
    'color_temp': ['LP830', 'LP835'],
    'control': ['NES7', 'NESPDT7'],
    'finish': ['WH', 'PAF']
  };

  for (const [field, options] of Object.entries(mnFields)) {
    // Add field
    document.getElementById('add_field_input').value = field;
    document.getElementById('add_field_btn').click();

    const modelSection = document.querySelector('#edit_mn #field_section');
    const fields = modelSection.querySelectorAll('.md');
    const newField = fields[fields.length - 1];

    const input = newField.querySelector('input.basic_input');
    const button = newField.querySelector('button');

    options.forEach(option => {
      input.value = option;
      button.click();
    });
  }

  // STEP 2: Now populate DIMENSIONS in METADATA
  // Close MN popup, open MD popup
  document.getElementById('done_button_mn').click();
  document.getElementById('new_spec_edit_md').click();

  setTimeout(() => {
    const dimensionsField = document.querySelector('#edit_md .md[data-key="dimensions"]');
    if (!dimensionsField) {
      alert("Could not find 'dimensions' metadata field.");
      return;
    }

    const input = dimensionsField.querySelector('input.basic_input');
    const button = dimensionsField.querySelector('button');

    const dims = ['2\'-0" LONG', '4\'-0" LONG', '8\'-0" LONG'];

    dims.forEach(dim => {
      input.value = dim;
      button.click();
    });
  }, 300);

}, 300);
