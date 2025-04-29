// TODO: Fetch data from the PostgreSQL database (to be implemented later)
function fetchGradeData() {
  // This function will query the PostgreSQL database and return grade data
  console.log("Fetching grade data...");
  // Create HTTP data request
  let xhr = new XMLHttpRequest();
  // Address of the machine requesting data from
  let apiRoute = "/api/grades";
  // Run anonymous function once request makes change to status
  xhr.onreadystatechange = (function(){
    let results;
    // Is it completed?
    if(xhr.readyState === XMLHttpRequest.DONE){
      // Was it successful?
      if(xhr.status !== 200){ 
        console.error(`Could not get grades. \nStatus: ${xhr.status}`);
      }
      // Call function to update HTML with data
      populateGradebook(JSON.parse(xhr.responseText));
      }
  }).bind(this);
  xhr.open("get", apiRoute, true);
  xhr.send();

} 

// TODO: Populate the table with grade data
function populateGradebook(data) {
  //This function will take the fetched grade data and populate the table
  console.log("Populating gradebook with data:", data);
  let tableElm = document.getElementById("gradebook");
    data.forEach(function(assignment){
      let row = document.createElement("tr");
      let columns = [];
      columns.name = document.createElement('td');
      columns.name.appendChild(
        // Get full name by concatenating the first_name and last_name
        document.createTextNode(assignment.last_name + ", " + assignment.first_name)
      );
      columns.grade = document.createElement('td');
      columns.grade.appendChild(
        // Adding data
        document.createTextNode(assignment.total_grade)
      );
      // Adding data into table
      row.appendChild(columns.name);
      row.appendChild(columns.grade);
      // Adding the row into the HTML table
      tableElm.appendChild(row);
    });
    
}

// TODO REMOVE THIS
// Call the stubs to demonstrate the workflow
const gradeData = fetchGradeData();
// populateGradebook(gradeData);
// END REMOVE
