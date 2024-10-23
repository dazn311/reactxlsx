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

  // Get the B column, set its width and unhide it (assuming it was hidden).
  // const width = worksheet.column("B").width();//35.9766
  // const cell = worksheet.row(startAIdx+1).cell(3); // Returns the cell at C5.
  // const value = cell.value();
  // const value2 = worksheet.row(firstEmptyAIndex).cell(2).value();//'Булах Оксана Викторовна'
  const lengthForMerge = colNumTypeArr.findIndex((_,idx)=> worksheet.row(firstEmptyAIndex + 1).cell(idx + 1).value() !== undefined);


  return {
    titleIdx,
    headTabIdx,
    colNumTypeArr,
    startAIdx,
    endAIdx,
    lastTabIndex,
    lastIndex,
    lengthForMerge
  }
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