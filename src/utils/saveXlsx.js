import XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import _get from 'lodash/get';
import {writeToFile} from "./writeToFile.js";

export const saveXlsx = async (data) => {
    const worksheetArr = [..._get(data,['worksheetArr'],[])];
    const mergeCells = [..._get(data,['mergeCells'],[])];
    const startAIdx = _get(data,['startAIdx'],0);
    const endAIdx = _get(data,['endAIdx'],0);
    const widthColumns = _get(data,['widthColumns'],[]);
    const fileName = _get(data,['fileName'],'filename.xlsx');

    // Load a new blank workbook
    const workbook = await XlsxPopulate.fromBlankAsync();
    // Modify the workbook.
    // workbook.sheet("Sheet1").cell("A1").value("This is neat!");
    const sheet = workbook.sheet(0);
    sheet
        .cell("A1")
        .value(worksheetArr.map((x) => x.map((v) => v.value)));
    // посчить ширину для заголовка документа.
    // let rangeOfTitle = 'A5:H5';

    // sheet.range(rangeOfTitle).merged(true).style({
    //     // bold: true,
    //     horizontalAlignment: "center",
    //     verticalAlignment: "center",
    //     fill: 'BFBFBF',
    //     fontColor: '2772bf',
    //     fontSize: 12,
    //     wrapText: true
    // });
    mergeCells.forEach((mergeCell,idx) => {
        const horizontalAlignment = idx >= startAIdx && idx <= endAIdx ? 'left' : 'center';

        sheet.range(mergeCell).merged(true).style({
            // bold: true,
            horizontalAlignment: horizontalAlignment,
            verticalAlignment: "center",
            // fontSize: 12,
            wrapText: startAIdx > idx || endAIdx < idx
        });
    });

    // Get the B column, set its width and unhide it (assuming it was hidden).
    // sheet.column("B").width(25).hidden(false);
    //width cases;
    let parent = document.querySelectorAll('[data-col="6"]');
    if (parent) {
      const widthArr = [];
      for (let node of parent) {
        const width2 = Math.floor(node.getBoundingClientRect().width /6);
        widthArr.push(Math.max(width2));
      }

      widthColumns.forEach((_,idx) => {
        const columnKey = String.fromCharCode(idx + 65);
        sheet.column(columnKey).width(widthArr[idx]);
      });
     
    } else {
      //width from xlsx document;
      widthColumns.forEach((width,idx) => {
        const columnKey = String.fromCharCode(idx + 65);
        sheet.column(columnKey).width(width);
      });
    }

    // Write to file.
    return writeToFile(workbook,fileName);
}


//return workbook.outputAsync()
//                 .then(workbookBlob => {
//                     const url = URL.createObjectURL(workbookBlob);
//                     const downloadAnchorNode = document.createElement("a");
//                     downloadAnchorNode.setAttribute("href", url);
//                     downloadAnchorNode.setAttribute("download", fileName);
//                     downloadAnchorNode.click();
//                     downloadAnchorNode.remove();
//                 });