
const departmentList = document.querySelector('#departmentList');

getDepartments();

var selectedDepartmentId = 0;
var selectedDepartmentName = '';


//* Retrieve departments json from api
async function getDepartments(){
   fetch(`https://collectionapi.metmuseum.org/public/collection/v1/departments`)
      .then(response => response.json())
      .then(json => populateDepartmentsList(json));
}

//* Generates the HTML list with the departments retrieved from the api
function populateDepartmentsList(departmentsJson){
   departmentList.innerHTML = "";
   departmentsJson['departments'].forEach(department => {
      let li = document.createElement('li');
      li.textContent = department.displayName;
      li.addEventListener("click", () => {
         departmentDetails(department);
         window.location.href = 'department.html';
      })
      departmentList.appendChild(li);
   })
}

//* Overrides info about selected department
function departmentDetails(department){
   localStorage.setItem('selectedDepartment', JSON.stringify({
         id: department.departmentId,
         name: department.displayName
      }))
}
