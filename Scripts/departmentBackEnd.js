
const selectedDepartment = JSON.parse(localStorage.getItem('selectedDepartment'));


generatePage();
getArtPieces();

//* Fill out currently available elements of page
function generatePage(){
   document.title = selectedDepartment.name;
   document.querySelector('#departmentName').textContent = `Welcome to ${selectedDepartment.name}`;
}

//* Fetch # art piece Ids for the selected department
async function getArtPieces(){
   const itemCount = 15;
   const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${selectedDepartment.id}`
   );
   const json = await response.json();

   const piecesIdList = (json.objectIDs || []).slice(0, itemCount);
   populatePiecesList(piecesIdList);
}

//* Populates the list of art pieces
async function populatePiecesList(piecesIdList){
   const piecesList = document.querySelector('#piecesList');
   piecesList.innerHTML = '';

   // makes all 20 piece data requests in parallel
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
            <p>image: ${pieceInfo.img}</p>
            <img src="${pieceInfo.img}" alt="Image unavailable"/>
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
   //! Skip pieces without imgs
   if (!img) return null;

   return {
      title : json.title,
      author : `${json.artistRole} ${json.artistDisplayName}`,
      img : img
   }
}

