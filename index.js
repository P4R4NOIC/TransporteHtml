
class tvalue{
  constructor (val, posRow, posCol){
    this.value = val;
    this.asignV;
    this.flagA = false;
    this.col = posCol;
    this.row = posRow;
  }
  setAsignV(v){
    this.asignV = v;
  }
  setFlag(){
     this.flagA = !this.flagA;
  }

}
// let a = [[4, 3, 0, 5], 
//         [1, 2, 6, 1], 
//         [3, 6, 2, 3]];

// let demand = [15, 19, 18, 8];
let demand = JSON.parse(localStorage.getItem('demanda'));

// let offer = [24, 17, 19];
let offer = JSON.parse(localStorage.getItem('oferta'));
let matrixT = JSON.parse(localStorage.getItem('newMatrix'));
let modiFlagSolve = +localStorage.getItem('flagSolve');  //set items
let stepStoneDone = +localStorage.getItem('flagSolve');  //set items


// esta transformacion se hace a la matriz inicial 
// for (let i = 0; i < a.length; i++){
//   let c = []
//   for(let j = 0; j < a[i].length; j++){
//     let d = new tvalue(a[i][j], i, j);
//     c.push(d);
//   }
//   matrixT.push(c);
// }

// matrixT.forEach(element => {
//   element.forEach(value =>{
//     console.log(value.value+(value.flagA?"("+value.asignV+")":""));
//   });
// });
// la matrixT es la que se va a manejar para todo por lo que debe ser un item
//si quiere representarlo matrixT[i][j].value y la asignacion esta en matrixT[i][j].asignV
//podria utilizar esto matrixT[i][j].value+(matrixT[i][j].flagA?"("+matrixT[i][j].asignV+")":""); 
//que usa el ternario para ver si hay asignacion para concatenar el valor asignado
// console.log(matrixT[0][0].value+(matrixT[0][0].flagA?"("+matrixT[0][0].asignV+")":"") )

function defineMovements(colM, rowM, come){
  let way = [];
  if (come == 1 || come == 3){
    if(rowM>0){
      way.push(0);
    }
    if(rowM<matrixT.length-1){
      way.push(2);
    }
  }else{
    if (come == -1){
      if(rowM>0){
        way.push(0);
      }
      if(rowM<matrixT.length-1){
        way.push(2);
      }
    }
    if(colM > 0){
      way.push(1);
    }
    if(colM<matrixT[0].length-1){
      way.push(3);
    }
  }
  way.sort();
  return way;
  
  
}
/*
//revisar tambien si hay o no hay loop
let scx = loopAsign(0, 1);
console.log(scx);
if (scx.length){
  console.log("true");
}else{
  console.log("false");
}
*/
function loopAsign(x, y){

  let done = 1;
  let actual = matrixT[y][x];
  let movements = [];
  let move = -1;
  movements.push(defineMovements(x, y, move));
  
  let asignList = [];
  asignList.push(matrixT[y][x]);
  let posCol = x;
  let posRow = y;
  while (asignList.length < 4 || asignList[asignList.length-1] != matrixT[y][x]){
  //while(asd <13){
    
    if (movements.length){
      
      move = movements[movements.length-1][0];
    }else{
      return [];
    }
    do {
      if(move == 0){
        posRow--;
      }
      if(move == 1){
        posCol--;
      }
      if(move == 2){
        posRow++;
      }
      if(move == 3){
        posCol++;
      }
      if (posCol>=0 && posCol < matrixT[0].length && posRow >= 0 && posRow < matrixT.length){
        if (matrixT[posRow][posCol].flagA || (posCol == x && posRow == y)){
          done = 0;
        }
      }else{
        movements[movements.length-1].shift();
        posCol = actual.col;
        posRow = actual.row;
        if ((move = movements[movements.length-1][0]) == null){
          done = -1;
        }
        
      }
      
    }
    while(done == 1);
    if(done == 0){
      actual = matrixT[posRow][posCol];
      matrixT[posRow][posCol].flagA = true;
      asignList.push(matrixT[posRow][posCol]);
      movements.push(defineMovements(posCol, posRow, move));
      done =1;
    }
    if(done == -1){
      movements.pop();
      asignList.pop();
      posCol = actual.col;
      posRow = actual.row;
      actual = asignList[asignList.length-1];   
      done =1;
    } 
  }
  matrixT.forEach(elementR =>{
    elementR.map(element => element.asignV?element.flagA = true: element.flagA = false)
  });
  asignList.pop();
  return asignList;
}


function edgeNorWeast(){
  let row = 0;
  let col = 0;
  let dTemp = demand.slice();
  let oTemp = offer.slice();
  while (row < oTemp.length || col < dTemp.length){
    matrixT[row][col].asignV = Math.min(oTemp[row], dTemp[col]); 
    matrixT[row][col].flagA = 1;
    let t = Math.min(oTemp[row], dTemp[col]);
    oTemp[row]-= t;
    dTemp[col]-= t;
    if (oTemp[row] == 0){
      row++;
    }
    if(dTemp[col]== 0){
      col++;
    }
  }
  localStorage.setItem('newMatrix', JSON.stringify(matrixT));
}
function minCostMatrix( ){
  let dTemp = demand.slice();
  let oTemp = offer.slice();
  let checkMatrix = [];
  for (let i = 0; i < matrixT.length; i++) {
    checkMatrix.push(new Array(matrixT[0].length).fill(true));
  }
  
  let done = 1;
  while(done){
    let min = new tvalue(1000, -1, -1);
    let minAsignList = [];
    for(let i = 0; i < matrixT.length; i++){
      for (let j = 0; j < matrixT[0].length; j++) {
        if (matrixT[i][j].value < min.value && checkMatrix[i][j]){
          min = matrixT[i][j];
          minAsignList = [matrixT[i][j]];
        }else{
          if (matrixT[i][j].value == min.value && checkMatrix[i][j]){
            minAsignList.push(matrixT[i][j]);
          }
        } 
      }
    }
    if (minAsignList.length == 0){
      break;
    }
    let max = Math.min(dTemp[minAsignList[0].col], oTemp[minAsignList[0].row]);
    if (minAsignList.length > 1){
      min = minAsignList[0];
      let i = 0;
      for (let ai = 0; ai<minAsignList.length; ai++){
        if (max < Math.min(dTemp[minAsignList[ai].col], oTemp[minAsignList[ai].row])){
          min = minAsignList[ai];
          max = Math.min(dTemp[minAsignList[ai].col], oTemp[minAsignList[ai].row]);
        }
      }
    }
    matrixT[min.row][min.col].asignV = max; 
    console.log(matrixT[min.row][min.col].asignV);
    matrixT[min.row][min.col].flagA = 1;  
    oTemp[min.row]-= max;
    dTemp[min.col]-= max;
    for (let i = 0; i< checkMatrix.length;i++){
      for(let j = 0; j< checkMatrix[0].length; j++){
        if (i == min.row && oTemp[min.row] == 0 || j == min.col && dTemp[min.col] == 0){
          checkMatrix[i][j] = false;
        }
      }
    }
  }
  localStorage.setItem('newMatrix', JSON.stringify(matrixT));
}

function vogelMethod(){
  let dTemp = demand.slice();
  let oTemp = offer.slice();
  //definir matriz de boleanos
  let checkMatrix = [];
  for (let i = 0; i < matrixT.length; i++) {
    checkMatrix.push(new Array(matrixT[0].length).fill(true));
  }
  let lastAsign;
  while (1){
    let diffO = [];
    let flagDone = 1;
    //definir lista de valores por fila para encontra el par menor
    for(let i= 0; i< matrixT.length; i++){
      let rTemp = []
      for(let j = 0; j < matrixT[0].length; j++){
        if (checkMatrix[i][j]){
          rTemp.push(matrixT[i][j].value);
          lastAsign = matrixT[i][j];
        }
      }
      rTemp.sort((a, b) => a - b);
      //se pushea el costo si no hay un par se push un -1
      // ya que se ocupa la mayor diferenecia
      if (rTemp.length < 2){
        diffO.push(-1);
      }else{
        flagDone = 0;
        diffO.push(Math.abs(rTemp[0] - rTemp[1]));
      }

    }
    //el mismo proceso pero con columnas
    let diffD = [];
    for(let i= 0; i< matrixT[0].length; i++){
      let cTemp = []
      for(let j = 0; j < matrixT.length; j++){
        if (checkMatrix[j][i]){
          cTemp.push(matrixT[j][i].value);
        }
      }
      cTemp.sort((a, b) => a - b);
      if (cTemp.length < 2){
        diffD.push(-1);
      }else{
        flagDone = 0;
        diffD.push(Math.abs(cTemp[0] - cTemp[1]));
      }
    
    }

    if (flagDone){
      break;
    }
    //se encuentra en indice de la fila con menor diferencia
    let minRow = 0;
    for (let i = 0; i < diffO.length; i++) {
      if (diffO[i] > diffO[minRow]){
        minRow = i;
      }
    }
    //se encuentra la columna con la menor diferencia
    let minCol = 0;
    for (let i = 0; i < diffD.length; i++) {
      if (diffD[i]> diffD[minCol]){
        minCol = i;
      }
    }
    let foC; // true fila false Columna
    if (diffD[minCol] < diffO[minRow]){
      foC = 1;
    }else{
      if (diffD[minCol] == diffO[minRow]){
        if(minCol < minRow){
          foC = 0;
        }else{
          foC = 1;
        }
      }else{
        foC = 0;
      }
    }
    let minAsign;
    let minAsignList;
    if (foC){
      minAsign = new tvalue(matrixT[minRow][0].value*1000, -1, -1);
      minAsignList = [];
      for (let i = 0; i< checkMatrix[minRow].length;i++){
        if (minAsign.value > matrixT[minRow][i].value && checkMatrix[minRow][i]){
          minAsign = matrixT[minRow][i];
          minAsignList = [matrixT[minRow][i]];
        }else{
          if (minAsign == matrixT[minRow][i].value && checkMatrix[minRow][i]){
            minAsignList.push(matrixT[minRow][i]);
          }
        }
      }
    }else{
      minAsign = new tvalue(matrixT[0][minCol].value*1000, -1, -1);
      minAsignList = [];
      for (let i = 0; i< checkMatrix.length;i++){
        if (minAsign.value > matrixT[i][minCol].value && checkMatrix[i][minCol]){
          minAsign = matrixT[i][minCol];
          minAsignList = [matrixT[i][minCol]];
        }else{
          if (minAsign == matrixT[i][minCol].value && checkMatrix[i][minCol]){
            minAsignList.push(matrixT[i][minCol]);
          }
        }
      }
    }
    //asignar el valor
    let max = Math.min(dTemp[minAsign.col], oTemp[minAsign.row]);
    matrixT[minAsign.row][minAsign.col].asignV = max; 
    matrixT[minAsign.row][minAsign.col].flagA = 1;  
    
    oTemp[minAsign.row]-= max;
    dTemp[minAsign.col]-= max;
    for (let i = 0; i< checkMatrix.length;i++){
      for(let j = 0; j< checkMatrix[0].length; j++){
        if (i == minAsign.row && oTemp[minAsign.row] == 0 || j == minAsign.col && dTemp[minAsign.col] == 0){
          checkMatrix[i][j] = false;
        }
      }
    }
  }
  //asignar el ultimo valor
  let max = Math.min(dTemp[lastAsign.col], oTemp[lastAsign.row]);
  matrixT[lastAsign.row][lastAsign.col].asignV = max; 
  matrixT[lastAsign.row][lastAsign.col].flagA = 1;  
  oTemp[lastAsign.row]-= max;
  dTemp[lastAsign.col]-= max;
  localStorage.setItem('newMatrix', JSON.stringify(matrixT));
}


function modi(){
  if (!modiFlagSolve){
    if(applyDegradation()){
      degradationProcess();
      return;
    }
    let rAsign = new Array(matrixT.length).fill(0);
    let cAsign = new Array(matrixT[0].length).fill(0);
    for (let i = 0; i< matrixT.length; i++){
      for(let j = 0; j< matrixT[0].length; j++){
        if (matrixT[i][j].flagA){
          rAsign[i]++;
          cAsign[j]++;
        }
      }  
    }
    let maxR = 0;
    let maxC = 0;
    for (let i = 0; i < rAsign.length; i++){
      if(rAsign[i] > rAsign[maxR]){
        maxR = i;
      }
    }
    for (let i = 0; i < cAsign.length; i++){
      if(cAsign[i] > cAsign[maxC]){
        maxC = i;
      }
    }
    let uSubI = new Array(matrixT.length).fill(null);
    let vSubJ = new Array(matrixT[0].length).fill(null);

    if (cAsign[maxC] > rAsign[maxR]){
      vSubJ[maxC] = 0;
    }else{
      uSubI[maxR] = 0;
    }
    //sudoku
    while(uSubI.filter(valV => valV == null).length > 0 || vSubJ.filter(valV => valV == null).length){
      for (let i = 0; i < matrixT.length; i++){
        if (uSubI[i] != null){
          for (let j = 0; j < matrixT[0].length; j++){
            if (vSubJ[j] == null && matrixT[i][j].flagA){
              
              vSubJ[j] = matrixT[i][j].value - uSubI[i];
            }
          }
        }
      }
      for (let j = 0; j < matrixT[0].length; j++){
        if (vSubJ[j] != null){
          for (let i = 0; i < matrixT.length; i++){
            if (uSubI[i] == null && matrixT[i][j].flagA){
              
              uSubI[i] = matrixT[i][j].value - vSubJ[j];
            }
          }
        }
      }
    }
    let colValToFix = null;
    let rowValToFix = null;
    let minOpCost;
    for (let i = 0; i < matrixT.length; i++){
      for (let j = 0; j < matrixT[0].length; j++){
        let opCost;
        if (matrixT[i][j].flagA == false && (opCost = matrixT[i][j].value-(uSubI[i] + vSubJ[j])) < 0){
          if (rowValToFix == null){
            rowValToFix = i;
            colValToFix = j;
            minOpCost = opCost;
          }else{
            if(opCost < minOpCost){
              rowValToFix = i;
              colValToFix = j;
              minOpCost = opCost;
            }
          }
          
        }
      }
    }
    if (rowValToFix != null){
      let asignFixList = loopAsign(colValToFix, rowValToFix);
      let valueToFix = null;
      for(let i = 1; i < asignFixList.length; i++){
        if(i%2){
          if(valueToFix == null){
            valueToFix = asignFixList[i].asignV;
          }else{
            if(valueToFix > asignFixList[i].asignV){
              valueToFix = asignFixList[i].asignV;
              
            }
          }
        }
      }
      matrixT[asignFixList[0].row][asignFixList[0].col].asignV = valueToFix;
      matrixT[asignFixList[0].row][asignFixList[0].col].flagA = true;
      for(let i = 1; i < asignFixList.length; i++){
        if(i%2){
          matrixT[asignFixList[i].row][asignFixList[i].col].asignV = matrixT[asignFixList[i].row][asignFixList[i].col].asignV - valueToFix; 
          if (matrixT[asignFixList[i].row][asignFixList[i].col].asignV == 0){
            matrixT[asignFixList[i].row][asignFixList[i].col].asignV = null;
            matrixT[asignFixList[i].row][asignFixList[i].col].flagA = false;
            console.log(matrixT[asignFixList[i].row][asignFixList[i].col]);
          }
        }else{
          matrixT[asignFixList[i].row][asignFixList[i].col].asignV = matrixT[asignFixList[i].row][asignFixList[i].col].asignV + valueToFix;
        }
      }
      localStorage.setItem('newMatrix', JSON.stringify(matrixT));
    }else{
      localStorage.setItem('flagSolve', 1);
    }
  }
  
  
}


function steppingStone(){
  if (!stepStoneDone){
    if(applyDegradation()){
      degradationProcess();
    }
    let matrixRedChange = [];
    for (let i = 0; i < matrixT.length; i++){
      let mt = new Array(matrixT[0].length).fill(0);
      matrixRedChange.push(mt);
    }
    for (let i = 0; i < matrixT.length; i++){
      for(let j = 0; j < matrixT[0].length; j++){
        if (!matrixT[i][j].flagA){
          let asignList = loopAsign(j, i);
          let rcCost = asignList[0].value;
          for(let k = 1; k < asignList.length; k++){
            if(k%2){
              rcCost -= asignList[k].value;
            }else{
              rcCost += asignList[k].value;
            }
          }
          matrixRedChange[i][j] = rcCost;
        }else{
          matrixRedChange[i][j] = null;
        }
      }
    }
    let rcRow = null;
    let rcCol = null;
    let minRCValue = 0;
    for (let i = 0; i < matrixRedChange.length; i++){
      for(let j = 0; j < matrixRedChange[0].length; j++){
        if (matrixRedChange[i][j] != null){
          if (minRCValue > matrixRedChange[i][j]){
            rcCol = j;
            rcRow = i;
            minRCValue = matrixRedChange[i][j];
          }      
        }
      }
    }
    if(minRCValue == 0){
      localStorage.setItem('flagSolve', 1);
      return
    }else{
      let asignFixList = loopAsign(rcCol, rcRow);
      let valueToFix = null;
      for(let i = 1; i < asignFixList.length; i++){
        if(i%2){
          if(valueToFix == null){
            valueToFix = asignFixList[i].asignV;
          }else{
            if(valueToFix > asignFixList[i].asignV){
              valueToFix = asignFixList[i].asignV;
              
            }
          }
        }
      }
      matrixT[asignFixList[0].row][asignFixList[0].col].asignV = valueToFix;
      matrixT[asignFixList[0].row][asignFixList[0].col].flagA = true;
      for(let i = 1; i < asignFixList.length; i++){
        if(i%2){
          matrixT[asignFixList[i].row][asignFixList[i].col].asignV =matrixT[asignFixList[i].row][asignFixList[i].col].asignV - valueToFix; 
          if (matrixT[asignFixList[i].row][asignFixList[i].col].asignV == 0){
            matrixT[asignFixList[i].row][asignFixList[i].col].flagA = false;
            matrixT[asignFixList[i].row][asignFixList[i].col].asignV = null;
          }
        }else{
          matrixT[asignFixList[i].row][asignFixList[i].col].asignV=matrixT[asignFixList[i].row][asignFixList[i].col].asignV + valueToFix;
        }
      }
      localStorage.setItem('newMatrix', JSON.stringify(matrixT));
    }
  }
}
function degradationProcess(){
  let minRow;
  let minCol;
  let minVal= (matrixT[0][0].value+1)*100;
  for (let i = 0; i<matrixT.length; i++){
    for(let j = 0; j < matrixT[0].length; j++){
      let loop = loopAsign(j, i);
      if(matrixT[i][j].flagA == false && matrixT[i][j].value < minVal && loop.length < 2){
        minCol= j;
        minRow = i;
        minVal = matrixT[i][j].value;
      }
    }
  }
  matrixT[minRow][minCol].asignV = 0;
  matrixT[minRow][minCol].flagA = true;

  localStorage.setItem('newMatrix', JSON.stringify(matrixT));
}
function applyDegradation(){
  let counter = 0;
  for (let i = 0; i<matrixT.length; i++){
    for(let j = 0; j < matrixT[0].length; j++){
      if(matrixT[i][j].asignV != null && matrixT[i][j].flagA == false){
        matrixT[i][j].flagA = true;
      }
      if(matrixT[i][j].flagA){
        counter++;
      }
      
    }
  }
  if(counter == (matrixT.length+matrixT[0].length-1)){
    return false;
  }else{
    return true;
  }
}

function continueAlg(){
  let firstSolution = +localStorage.getItem('firstSol');
  let firstIteration = +localStorage.getItem('firstIteration');
  if(!firstIteration){
    if(firstSolution == 0){
      edgeNorWeast();
    }
    if(firstSolution == 1){
      minCostMatrix();
    }
    if(firstSolution == 2){
      vogelMethod();
    }
    firstIteration = 1;
    localStorage.setItem("firstIteration", firstIteration);
    console.log("firstSolution: "+firstSolution);
    console.log("firstIteration: "+firstIteration);
    window.location.reload();
  }else{
    steppingORmodi();
  }
}
function steppingORmodi(){
  let secondSolution = +localStorage.getItem('secondSol');
  let flagSolve = +localStorage.getItem('flagSolve');
  console.log("secondSolution: "+secondSolution);
  console.log("flagSolve: "+flagSolve);
  if(!flagSolve){
  
    if(secondSolution == 0){
      steppingStone();
    }
    if(secondSolution == 1){
      modi();
    }
    //window.location.reload();
  }
};
function restarMaxValue(){
  maxValue = +localStorage.getItem("maxValue");
  
  matrixT.forEach(element => {
    element.forEach(second => {
      second.value = Math.abs(second.value-maxValue);
    });
  });
  localStorage.setItem('newMatrix', JSON.stringify(matrixT));
  localStorage.setItem("negado",1);
  window.location.reload();
}