// import { fromBlankAsync} from 'xlsx-populate';
import helpers from "./allLinesFromXlsHelpers";
import * as XlsxPop from "xlsx-populate/browser/xlsx-populate";

/**
 * 2.1.Step: from form to tab, when click save;
 * usage in fileReader;
 * {Object} arraybuffer
 * @returns {Object} Object
 */
export async function allLinesFromXls(
    arraybuffer,//ArrayBuffer(5967);
) {
    const workbook = await XlsxPop.fromDataAsync(arraybuffer);

    const firstSheetName/*:string*/ = workbook.SheetNames[0];
    const worksheet/*:Worksheet*/ = workbook.Sheets[firstSheetName];
    const worksheetsObj = helpers.worksheetsParse(worksheet);
    const columnsKeyArr = helpers.sortKeysHelper(worksheetsObj);
    const [endIdxHead] = worksheetsObj['headers'];//"7"
    const fileData = helpers.fileDataHelper(worksheetsObj,endIdxHead);

    return {
        ...worksheetsObj,
        fileData: fileData,
        dataLines: null,
        fileName: '',
        columnsKeyArr
    };

}
