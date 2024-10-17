import * as XlsxPop from "xlsx-populate/browser/xlsx-populate";
import {isArrayLength} from "../isArrayLength";
import {utils, write} from "xlsx";
import {getBlobsUrl} from "../../api/helpers/getBlobsUrl";
import {s2ab} from "../../api/helpers/forXls/s2ab";

export const sheetWidthHelper = (sheet, strArr=[], width=10) => {
    if (Boolean(sheet?.column) && isArrayLength(strArr,0)) {
        strArr.forEach(head => {
            if (Boolean(sheet.column(head).width())) {
                sheet.column(head).width(width);
            }
        })
    }
}

export const addStylesVar = {
    baseStyles : {
        border: true,
        wrapText: true,
        // verticalAlignment: 'top',
        verticalAlignment: "center",
        horizontalAlignment: 'left',
        borderStyle: 'thin',
        diagonalBorderStyle: 'thin',
        borderColor: '000000',
        fontColor: '464b4a',
        fontSize: 10,
    }
}

export function rangeOfArr(sheet={}, dataArr=[]) {
    let a = 65;
    let max = 0;
    let maxAllLine = 0;
    let idxStart = 0;

    dataArr.forEach((column, index) => {
        if (column.length > 1) {
            max = column.length > max ? column.length: max;
            maxAllLine = maxAllLine > max ? maxAllLine: max;
            idxStart = idxStart > 0 ? idxStart : index + 1;
        }else {
            if (idxStart && max) {
                const columnEnd = String.fromCharCode(a + max - 1);
                let range = `A${idxStart}:${columnEnd}${index}`;

                sheet.range(range).style(addStylesVar.baseStyles);

                idxStart = 0;
                max = 0;
            }
        }
    })

    return maxAllLine;
}

export function addStylesLst(blob, title, dataArr) {
    return XlsxPop.fromDataAsync(blob)
        .then(wb => {
            wb.sheets().forEach((sheet, inx) => {
                sheet.usedRange().style({
                    fontFamily: 'Arial',
                    verticalAlignment: 'center'
                })

                let a = 65;
                let maxAllLine = rangeOfArr(sheet,dataArr);

                sheet.column("A").width(30); //GLN
                sheet.column("B").width(40); //dscr
                sheet.column("C").width(80); //addr
                sheet.column("D").width(20); //code;
                sheet.column("E").width(40); //inn;
                sheet.column("F").width(40); //comment;


                // посчить ширину для заголовка документа.
                let rangeOfTitle = 'A1:' + String.fromCharCode(a + maxAllLine - 1) + '1';

                sheet.range(rangeOfTitle).merged(true).style({
                    bold: true,
                    horizontalAlignment: "center",
                    verticalAlignment: "center",
                    fill: 'BFBFBF',
                    fontColor: '2772bf',
                    fontSize: 10
                });

                let styleHead = {
                    bold: true,
                    border: true,
                    borderStyle: 'medium',
                    horizontalAlignment: "center",
                    verticalAlignment: "center"
                }


                let styleTabData = {
                    horizontalAlignment: "left",
                    verticalAlignment: "center",
                    border: true,
                    borderStyle: 'thin'
                }
                // посчить ширину для таблицы.
                let rangeOfHeaderTab3 = 'A6:' + String.fromCharCode(a + maxAllLine - 1) + `${dataArr.length}`;
                sheet.range(rangeOfHeaderTab3).style(styleTabData);

                // посчить ширину для заголовка таблицы.
                let rangeOfHeaderTab2 = 'A5:' + String.fromCharCode(a + maxAllLine - 1) + '5';
                sheet.range(rangeOfHeaderTab2).style(styleHead);

                // посчить ширину для заголовка tab info.
                sheet.range('A3:C3').style(styleHead);

            })
            return wb.outputAsync().then(workbookBlob => URL.createObjectURL(workbookBlob));
        });
}

export function saveXlsLst(texts, title, docType, fileName) {
    const book = utils.book_new();

    const ws = utils.aoa_to_sheet(texts, {
        skipHeader: true,
        cellDates:true,
        cellStyles:true
    })

    utils.book_append_sheet(book, ws, docType)

    const fileName2 = fileName + '.xlsx';

    const wOpts = {
        bookType: "xlsx",
        bookSST: false,
        type: "binary"
    }

    const wbOut = write(book, wOpts);
    const blob = getBlobsUrl('.xls', s2ab(wbOut));

    addStylesLst(blob, title, texts)
        .then(url => {
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", url);
            downloadAnchorNode.setAttribute("download", fileName2);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        })
}
