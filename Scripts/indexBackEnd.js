
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
         departmentDetailsAndImgToggle(department);
         window.location.href = 'department.html';
      })
      departmentList.appendChild(li);
   })
}

//* Exports selected department info and unavailable img toggle state
function departmentDetailsAndImgToggle(department){
   const imgToggle = imgToggleState();
   localStorage.setItem('selectedDepartmentAndImgToggle', JSON.stringify({
         id: department.departmentId,
         name: department.displayName,
         imgToggle
      }))
}

function imgToggleState(){
   const toggle = document.getElementById("imgToggle");
   toggle.addEventListener("change", async () => {
      const isChecked = toggle.checked;})
   return toggle.checked
}
