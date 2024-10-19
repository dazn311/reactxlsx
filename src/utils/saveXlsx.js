import XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import _get from 'lodash/get';

export const saveXlsx = (data) => {
    const worksheetArr = [..._get(data,[0,'worksheetArr'],[])];
    const fileName = _get(data,[0,'fileName'],'filename.xlsx');

    // Load a new blank workbook
    XlsxPopulate.fromBlankAsync()
        .then(workbook => {
            // Modify the workbook.
            // workbook.sheet("Sheet1").cell("A1").value("This is neat!");
            workbook
                .sheet(0)
                .cell("A1")
                .value(worksheetArr.map((x) => x.map((v) => v.value)));

            // Write to file.
            return workbook.outputAsync()
                .then(workbookBlob => {
                    const url = URL.createObjectURL(workbookBlob);
                    const downloadAnchorNode = document.createElement("a");
                    downloadAnchorNode.setAttribute("href", url);
                    downloadAnchorNode.setAttribute("download", fileName);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                });
        });
}