
const selectedDepartmentAndImgToggle = JSON.parse(localStorage.getItem('selectedDepartmentAndImgToggle'));

//Generate page and every 5s add 10 items
let numItems = 10;
generatePage();
for (let i = 0; i < 6; i++) {
   setTimeout(() => {
      getArtPieces(numItems * i, numItems * (i + 1));
   }, 5000 * i);
}


//* Fill out currently available elements of page
function generatePage(){
   document.title = selectedDepartmentAndImgToggle.name;
   document.querySelector('#departmentName').textContent = `Welcome to ${selectedDepartmentAndImgToggle.name}`;
}

//* Fetch # art piece Ids for the selected department
async function getArtPieces(firstItemIndex,itemCount){
   const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${selectedDepartmentAndImgToggle.id}`
   );
   const json = await response.json();

   const piecesIdList = (json.objectIDs || []).slice(firstItemIndex, itemCount);
   populatePiecesList(piecesIdList);
}

//* Populates the list of art pieces
async function populatePiecesList(piecesIdList){
   const piecesList = document.querySelector('#piecesList');

   // makes all # piece data requests in parallel
   const piecesResult = await Promise.all(
      piecesIdList.map(id => getPieceInfo(id))
   );
   // Filter out null entries (generated due to no img)
   const piecesData = piecesResult.filter(x => x !== null);

   piecesData.forEach(pieceInfo => {
      let li = document.createElement('li');
      li.innerHTML = `
         <div class="pieceHeader">
            <p class="pieceName">${pieceInfo.title}</p>
            <p class="pieceAuthor">${pieceInfo.author}</p>
         </div>

         <div class="pieceImg">
            <img src="${pieceInfo.img}" alt="Image unavailable"/>
         </div>
         <div class="descriptionContainer">
            <p class="description">${pieceInfo.description}</p>
         </div>
      `;

      piecesList.appendChild(li);
   })
}

//* Retrieve and return specified art piece's information
async function getPieceInfo(pieceId) {
   const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${pieceId}`
   );
   const json = await response.json();

   const img = json.primaryImageSmall?.trim() || json.primaryImage;

   //! Skip pieces without imgs (when toggle off)
   if (!selectedDepartmentAndImgToggle.imgToggle){
      if (!img) return null;
   }

   return {
      title : json.title,
      author : `${json.artistRole} ${json.artistDisplayName}`,
      img : img,
      description : `${json.objectBeginDate} - ${json.objectEndDate}\n` + `${json.medium}\n` + `${json.creditLine}\n` + `${json.repository}`
   }
}

