// import { fromBlankAsync} from 'xlsx-populate';
import helpers from "./allLinesFromXlsHelpers";
import XlsxPop from "xlsx-populate/browser/xlsx-populate";

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
    const worksheet/*:Worksheet*/ = workbook.sheet(0);
    const worksheetsObj = helpers.worksheetsParse(worksheet,XlsxPop.numberToDate);

    return {
        ...worksheetsObj,
        fileName: ''
    };
}

// const columnsKeyArr = helpers.sortKeysHelper(worksheetsObj);
// const [endIdxHead] = worksheetsObj['headers'];//"7"
// const fileData = helpers.fileDataHelper(worksheetsObj,endIdxHead);
// eslint-disable-next-line no-debugger