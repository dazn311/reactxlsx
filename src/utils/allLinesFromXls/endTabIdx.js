import _get from 'lodash/get';

export function endTabIdx(worksheetKeysArr=[],mergeCells,worksheet) {
  const titleIdx = worksheetKeysArr.findIndex(valuesArr => valuesArr.some(Boolean));
  const headTabIdx = worksheetKeysArr.findIndex(valuesArr => valuesArr.some(v => /№|фио|дата/i.test(v)));
  const colNumTypeArr = colNumTypeArrHelper(worksheetKeysArr,headTabIdx);
  const startAIdx = worksheetKeysArr.findIndex(valuesArr => /^\d+$/.test(valuesArr[0]));
  const endAIdx = worksheetKeysArr.findLastIndex(valuesArr => /^\d+$/.test(valuesArr[0]));
  const lastIndex = worksheetKeysArr.findLastIndex(valuesArr => valuesArr.some(Boolean));
  const lastTabIndex = worksheetKeysArr.findIndex((valuesArr,idx) => idx > startAIdx && !valuesArr.some(Boolean));//35
  const firstEmptyAIndex = worksheetKeysArr.findIndex((valuesArr,idx) => idx > startAIdx && !valuesArr[0]);//35

  // const width = worksheet.column("B").width();//35.9766
  // const cell = worksheet.row(startAIdx+1).cell(3); // Returns the cell at C5.
  // const value = cell.value();
  // const value2 = worksheet.row(firstEmptyAIndex).cell(2).value();//'Булах Оксана Викторовна'

  //for ServiceBlock;
  const lengthForMerge = lengthForMergeHelper(worksheet,colNumTypeArr,mergeCells,firstEmptyAIndex);
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
    widthColumns
  }
}

function lengthForMergeHelper(worksheet,colNumTypeArr=[],mergeCells=[],firstEmptyAIndex=0) {
  const mergeCellsSt = mergeCells.join('|');
  return colNumTypeArr.findIndex((_,idx)=> {
    const currCol = idx +1;
    const val = worksheet.row(firstEmptyAIndex + 1).cell(currCol).value();

    if (val !== undefined) {
      const regx = new RegExp(`${String.fromCharCode(idx+65-1)}${firstEmptyAIndex}:\\w+`,'g');
      return mergeCellsSt.match(regx);
    }

    return false;
  });
}

function colNumTypeArrHelper(worksheetKeysArr,headTabIdx) {
  return [..._get(worksheetKeysArr,[headTabIdx],[])].reduce((accArr,val) => {
    switch (true) {
        case /^№$/i.test(val):
        case /Сумма|Начислено|На руки/i.test(val):
            accArr.push('number');
            break;
        case /Дата|рождения/i.test(val):
            accArr.push('date');
            break;
        default:
          if (/^(\d+\.\d+\.\d+|\d+-\d+-\d+)$/i.test(val)) {
            accArr.push('date');
          } else if (/^(\d+(\.?|,?)\d+)$/i.test(val)) {
            accArr.push('number');
          } else {
            accArr.push('string');
          }
            break;
    }
   return accArr;
},[]);
}