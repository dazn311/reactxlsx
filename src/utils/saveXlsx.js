import XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import _get from 'lodash/get';
import {writeToFile} from "./writeToFile.js";

export const saveXlsx = async (data) => {
    const worksheetArr = [..._get(data,[0,'worksheetArr'],[])];
    const mergeCells = [..._get(data,[0,'mergeCells'],[])];
    const startAIdx = _get(data,[0,'startAIdx'],0);
    const endAIdx = _get(data,[0,'endAIdx'],0);
    const fileName = _get(data,[0,'fileName'],'filename.xlsx');

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
    })

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