import _get from 'lodash/get';

export function endTabIdx(worksheetKeysArr=[],mergeCells=[],worksheet={}) {
  const titleIdx = worksheetKeysArr.findIndex(valuesArr => valuesArr.some(Boolean));
  const headTabIdx = worksheetKeysArr.findIndex(valuesArr => valuesArr.some(v => /№|фио|дата/i.test(v)));
  const {colNumTypeArr, colHeaderNamesArr} = colNumTypeArrHelper(worksheetKeysArr,headTabIdx);
  const startAIdx = worksheetKeysArr.findIndex(valuesArr => /^\d+$/.test(valuesArr[0]));
  const endAIdx = worksheetKeysArr.findLastIndex(valuesArr => /^\d+$/.test(valuesArr[0]));
  const lastIndex = worksheetKeysArr.findLastIndex(valuesArr => valuesArr.some(Boolean));
  const lastTabIndex = worksheetKeysArr.findIndex((valuesArr,idx) => idx > startAIdx && !valuesArr.some(Boolean));//35
  const sequenceIndex = colHeaderNamesArr.findIndex(v => /№/.test(v));
  const fioIndex = colHeaderNamesArr.findIndex(v => /фио/i.test(v));

  // const width = worksheet.column("B").width();//35.9766
  // const cell = worksheet.row(startAIdx+1).cell(3); // Returns the cell at C5.
  // const value = cell.value();
  // const value2 = worksheet.row(firstEmptyAIndex).cell(2).value();//'Булах Оксана Викторовна'

  //for ServiceBlock;
  const lengthForMerge = lengthForMergeHelper(worksheetKeysArr,worksheet,colNumTypeArr,mergeCells,startAIdx,endAIdx,fioIndex);
  const widthColumns = colNumTypeArr.reduce((accArr, _, idx)=>{
    // Get the B column, set its width and unhide it (assuming it was hidden).
    const width = worksheet.column(String.fromCharCode(idx+65)).width();//35.9766
    accArr.push(width);
    return accArr;
  },[]);

  return {
    titleIdx,
    headTabIdx,
    colNumTypeArr,
    startAIdx,
    endAIdx,
    lastTabIndex,
    lastIndex,
    lengthForMerge,
    widthColumns,
    colHeaderNamesArr,
    sequenceIndex
  }
}

function emptyAIndexArrHelper(worksheet,colNumTypeArr,worksheetKeysArr,mergeCellsSt,startAIdx,endAIdx,fioIndex) {
  const firstEmptyAIndexArr = worksheetKeysArr.reduce((acc,valuesArr,idx) => {
    if (idx > startAIdx && idx <= endAIdx && !valuesArr[fioIndex]) {
      acc.push(idx);
    }
    return acc;
  },[]);

  let index = -1;
  for (const firstEmptyAIndexArrElement of firstEmptyAIndexArr) {
    if (index > 0) {
      break;
    }

    const idxCurr = findIndEmptyA(worksheet,colNumTypeArr,firstEmptyAIndexArrElement,mergeCellsSt);

    if (idxCurr > 0 && index === -1) {
      index = idxCurr;
    }
  }

  return index;
}

function findIndEmptyA(worksheet,colNumTypeArr,firstEmptyAIndexArrElement,mergeCellsSt) {
  return colNumTypeArr.findIndex((_,idx)=> {
    const currCol = idx +1;
    const val = worksheet.row(firstEmptyAIndexArrElement + 1).cell(currCol).value();

    if (val !== undefined) {
      const regx = new RegExp(`${String.fromCharCode(idx+65-1)}${firstEmptyAIndexArrElement}:\\w+`,'g');
      return mergeCellsSt.match(regx);
    }

    return false;
  });
}

function lengthForMergeHelper(worksheetKeysArr,worksheet,colNumTypeArr=[],mergeCells=[],startAIdx=0,endAIdx=0,fioIndex=0) {
  const mergeCellsSt = mergeCells.join('|');
  return emptyAIndexArrHelper(worksheet,colNumTypeArr,worksheetKeysArr,mergeCellsSt,startAIdx,endAIdx,fioIndex);
}

function colNumTypeArrHelper(worksheetKeysArr,headTabIdx) {
  return [..._get(worksheetKeysArr,[headTabIdx],[])].reduce((accArr,val) => {
    switch (true) {
        case /^№$/i.test(val):
        case /Сумма|Начислено|На руки/i.test(val):
            accArr['colNumTypeArr'].push('number');
            break;
        case /Дата|рождения/i.test(val):
          accArr['colNumTypeArr'].push('date');
            break;
        default:
          if (/^(\d+\.\d+\.\d+|\d+-\d+-\d+)$/i.test(val)) {
            accArr['colNumTypeArr'].push('date');
          } else if (/^(\d+(\.?|,?)\d+)$/i.test(val)) {
            accArr['colNumTypeArr'].push('number');
          } else {
            accArr['colNumTypeArr'].push('string');
          }
            break;
    }
    accArr['colHeaderNamesArr'].push(val);
   return accArr;
},{
  colNumTypeArr:[],
  colHeaderNamesArr:[]
});
}