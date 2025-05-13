let popup = document.getElementById('edit_mn');

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




document.getElementById("new_spec_edit_button").addEventListener("click", function() {
    popup = document.getElementById('edit_mn');
    openPopup();
});

  document.getElementById("exit_button_mn").addEventListener("click", function() {
    closePopup();
  });

