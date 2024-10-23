import _get from 'lodash/get';
// import _has from 'lodash/has';
import _isObjectLike from "lodash/isObjectLike";
import {mergeParse} from './mergeParse';
import {valueHelper} from './valueHelper';
import {endTabIdx} from './endTabIdx';

const allLinesFromXlsHelpers = {
    worksheetsParse
};

export default allLinesFromXlsHelpers;

// const fontName = 'Times New Roman';


function worksheetsParse(worksheet,numberToDate) {
    const mergeCells = Object.keys(worksheet['_mergeCells'] ?? {});
    const mergesObj  = mergeParse(mergeCells);
    // const b11_value = worksheet.cell('B11').value();//Алексеева Наталья Александровна
    const worksheetKeysArr  = worksheet.usedRange().value();

    if (!Array.isArray(worksheetKeysArr)) return null;

    const {
        titleIdx,
        headTabIdx,
        colNumTypeArr,
        startAIdx,
        endAIdx,
        lastTabIndex,
        lastIndex
      } = endTabIdx(worksheetKeysArr,mergeCells,worksheet);

    worksheetKeysArr.forEach((valuesArr,row) => {
        (valuesArr ?? []).forEach((value,col) => {
            worksheetKeysArr[row][col] = valueHelper(value,colNumTypeArr[col],numberToDate);
        })
    });
    Object.keys(mergesObj).forEach((row/*"18"*/) => {
        Object.keys(mergesObj[row] ?? {}).forEach((col) => {
            if (_isObjectLike(worksheetKeysArr[row][col]))
            Object.setPrototypeOf(worksheetKeysArr[row][col], mergesObj[row][col]);
        })
    });

    // const {rangeTab} = worksheetKeysArr.reduce((acc, cellsArr,idx) => {
    //
    //     return acc;
    // },{
    //     rangeTab:'A10:H33',
    //     colWidth:worksheetKeysArr[0].length,
    // });
    // worksheet.range(rangeTab).style({
    //     fontFamily: 'Times New Roman',
    //     verticalAlignment: 'center',
    //     // alignment:{ wrapText: false }
    //     wrapText: false
    //     // textWrap:'nowrap'
    // });

    // Modify the workbook.
    // worksheet.cell("A1").value("This is neat!");

    // const num = cell.value(); // 42788
    // const date = numberToDate(31427); // Wed Jan 15 1986 00:00:00 GMT+0300 (Moscow Standard Time)
    // eslint-disable-next-line no-debugger
// debugger
    return {
        worksheetArr: worksheetKeysArr,
        titleIdx,
        headTabIdx,
        startAIdx,
        endAIdx,
        lastTabIndex,
        lastIndex,
        mergesObj,
        mergeCells
    };
}

// worksheet.usedRange().style({
//     fontFamily: 'Times New Roman',
//     verticalAlignment: 'center'
// });

// function sortKeysHelper(worksheetsObj={}) {
//     return Object.keys(worksheetsObj['columns']).sort((a, b) => {
//         if(a < b) { return -1; }
//         if(a > b) { return 1; }
//         return 0;
//     });
// }

// function stylesHelper(obj={},columns={},isBold=false,merge= null) {
//     return Object.keys(obj).length === 0
//         ? { font: { name: fontName, bold: isBold, sz: 18,colSpan:Object.keys(columns).length },alignment: { wrapText: true,horizontal:'center'} ,merge}
//         : { font: { name: fontName, sz: 11, bold: isBold },alignment: { wrapText: true,horizontal:'center'} ,merge};
// }

// function fileDataHelper(worksheetsObj={},endIdxHead='0') {
//     return Object.keys(worksheetsObj['fileDataObj'])
//         .filter(bodyTab(worksheetsObj,endIdxHead))
//         .map(createBody(worksheetsObj));
// }
// function bodyTab(worksheetsObj={},endIdxHead='0') {
//     return key => Object.keys(worksheetsObj['fileDataObj'][key] ?? {}).length > 0 && parseInt(key) >= parseInt(endIdxHead);
// }
// function createBody(worksheetsObj) {
//     return key => worksheetsObj['fileDataObj'][key];
// }

//Here s = start, r = row, c=col, e= end
// const merge = {
//     "s": { "c": 0,  "r": 6  },
//     "e": {  "c": 0, "r": 7  }
// };

// const merges  = worksheet._mergeCells;
// const mergesKeys = Object.keys(merges);
//merges: {
//     "A18:A19": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "A18:A19"
//         },
//         "children": []
//     },
//     "B18:B19": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "B18:B19"
//         },
//         "children": []
//     },
// }

//     [].reduce((accObj,key,idx)=> {
//     const [,c,r] = /([A-Z])(\d+)/.exec(key);
//     accObj['columns'][c] = c;
//     // if (key === 'E20') debugger;
//
//     let isHeader = accObj['headers'].includes(r);
//     const value = worksheet[key]?.v;
//
//     if (accObj['headers'].length > 0) {
//         const lastRow = accObj['headers'][accObj['headers'].length - 1];
//         if (lastRow === r) {
//             const nameCol = nameColHelper(value);
//             accObj['headersInColumns'][nameCol] = {c};
//             accObj['headersInColumns'][c] = !!accObj['headersInColumns'][c]
//                 ? [...accObj['headersInColumns'][c],nameCol]
//                 : [nameCol];
//         }
//     }
//
//     if (/ФИО/.test(value) || /^№\s?$/.test(value)) {
//         accObj['headers'].push(r);
//         isHeader = true;
//         const nameCol = nameColHelper(value);
//         accObj['headersInColumns'][nameCol] = {c};
//         accObj['headersInColumns'][c] = !!accObj['headersInColumns'][c]
//             ? [...accObj['headersInColumns'][c],nameCol]
//             : [nameCol];
//     }
//
//     if (merges[key] !== 'delete') {
//         if (!accObj['fileDataObj'][r]) {
//             if (!/^A$/.test(c)) {// && !accObj['lastRowName']
//                 // debugger
//                 accObj['endRowTab'] = r;
//             }
//             accObj['fileDataObj'][r] = {};
//         }
//
//         const v = valueHelper(worksheet,key,c,accObj);
//         // if (r === '34') debugger;
//
//         if (v === 1) {
//             accObj['startRowTab'] = r;
//         }
//
//         const s = stylesHelper(accObj['fileDataObj'],accObj['columns'],isHeader,merges[key]);
//         accObj['fileDataObj'][r] = {
//             ...accObj['fileDataObj'][r],
//             [c]:{...worksheet[key],s,v}
//         };
//
//         // if (accObj['fileDataObj'][idx] === undefined) {
//         //     accObj['fileDataObj'][idx] = {};
//         // }
//
//         if (/^A$/.test(c)) {
//             if (typeof v === 'number') {
//                 accObj['sec'] = accObj['sec'] + 1;
//             } else {
//                 // accObj['sec'] = accObj['sec'];
//             }
//         }
//     }
//
//     // if (value === 12) debugger;
//
//     if (isHeader ) {//|| accObj['endRowTab']
//         return accObj;
//     }
//
//     //title;
//     if (!accObj['title'] && !!worksheet[key]) {
//         const s = stylesHelper(accObj['fileDataObj'],accObj['columns'],isHeader,merges[key]);
//         accObj['title'] = {...worksheet[key],s};
//         return accObj;
//     }
//
//     // if (key === 'E8') debugger;
//
//     //add custom merges;
//     if (accObj['prevKey'][c] ) {
//         const {r:prevRow} = _get(accObj,['prevKey',c]);
//
//         if (_has(accObj,['fileDataObj',prevRow,c])) {
//             // if (Array.isArray(accObj['headersInColumns'][c]) && accObj['headersInColumns'][c].some(head => /sum/i.test(head))) {
//             //     //for sum amount 1726980;
//             //     accObj['prevKey'][c] = null;
//             //     return accObj;
//             // }
//             const stylePrev = _get(accObj,['fileDataObj',prevRow,c,'s']);
//             const rowSpan = r - prevRow;
//             if (rowSpan < 2) {
//                 accObj['prevKey'][c] = {value:worksheet[key],key, r};
//                 return accObj;
//             }
//             const s = stylesHelper(accObj['fileDataObj'],accObj['columns'],false,{rowSpan: r - prevRow});
//             accObj['fileDataObj'][prevRow] = {
//                 ...accObj['fileDataObj'][prevRow],
//                 [c]:{...accObj['fileDataObj'][prevRow][c],
//                     s: {...stylePrev, ...s}
//                 }
//             };
//         }
//
//         accObj['prevKey'][c] = null;
//
//     } else if (!!worksheet[key]) {
//         if (Array.isArray(accObj['headersInColumns'][c]) && accObj['headersInColumns'][c].some(head => /sum/i.test(head))) {
//             //for sum amount 1726980;
//             // debugger
//             // return accObj;
//         }
//         accObj['prevKey'][c] = {value:worksheet[key],key, r};
//     }
//
//     if (/^A$/.test(c)) {
//         accObj['lastRowA'] = r;
//         if (merges[key]) {
//             accObj['lastRowName'] = c;
//         } else {
//             accObj['lastRowName'] = null;
//         }
//     }
//
//     return accObj;
// },{
//     fileDataObj: {},
//     columns:{},
//     title:null,
//     headers:[],
//     headersInColumns: {},
//     colSpan:0,
//     merges,
//     sec:1,
//     prevKey: {},
//     currRowTab:0,
//     lastRowA:0,
//     lastA:lastA,
//     lastRowName:'0',
//     startRowTab:0,
//     endRowTab:null,
// });

// function workKeys(worksheetKey/*A5;A7...*/) {
//     return !/!/.test(worksheetKey);
// }
//
// function valueHelper(worksheet,key,c,accObj) {
//     const value = _get(worksheet,[key,'v']);
//     const valueInt = c === 'A' && typeof value === 'number' ? accObj['sec'] :_get(worksheet,[key,'v']);
//     return typeof value === 'string' ? value.trim() : valueInt;
// }
//
// function nameColHelper(value) {
//     switch (true) {
//         case /(Сумма|На руки)/i.test(value) :
//             return 'sum';
//         case /Дата/i.test(value) :
//             return 'date';
//         case /спортсмен/i.test(value) :
//             return 'men';
//         case /ФИО/i.test(value) :
//             return 'fio';
//         case /^№\s?$/.test(value) :
//             return 'sec';
//         default:
//             return value;
//     }
// }

// function headerArr(worksheet) {
//     const [,rangeF] = /^\w+:([A-Z])\d+.$/.exec(worksheet["!ref"]);
//     const last = rangeF.charCodeAt(0) - 65 +1;
//     return [...Array(last).fill('').map((v,idx) => String.fromCharCode(idx + 65))];
// }

//rowspan="2"

// const rowForSave = [
//     { v: "Courier: 24", t: "s", s: { font: { name: "Courier", sz: 24 } } },
//     { v: "bold & color", t: "s", s: { font: { bold: true, color: { rgb: "FF0000" } } } },
//     { v: "fill: color", t: "s", s: { fill: { fgColor: { rgb: "E9E9E9" } } } },
//     { v: "line\nbreak", t: "s", s: { alignment: { wrapText: true } } },
// ];

// const worksheetsObj = Object.keys(worksheet).filter(worksheetKey => {
//     return !/!/.test(worksheetKey);
// }).reduce((accObj,key)=> {
//     // accObj[key] = /d/.test(worksheet[key].t) ? '':'';
//     accObj[key] = worksheet[key];
//    return accObj;
// },{});

// const rows = XLSX.utils.sheet_to_json(worksheet, {
//         raw: true,
//         defval: null,
//         header:helpers.headerArr(worksheet)
//     }); //'raw: false' for read format 4/29/26;
//
// return rows.map(helpers.formatData);
// return rows.map(row => _isObject(row) ? Object.values(row).map(formatData) : []);

// return rows.map(row => {
//     const res = Object.values(row);
//
//     return _isObject(row) ? Object.values(row).map(formatData) : []
// });

// @param {Array|null} template - Array<Object>
// @param {Object} keyMap - object with keys

// let headerKeysArr = Object.keys(keyMap ?? {}).reduce((accArr,km) => {
//     accArr[keyMap[km]] = km;
//     return accArr;
// },[])

// if (isArrayLength(rows,0)) {
// let headersCaptionsArr = Array.isArray(template)
//     ? template.filter(t => t.label?.length > 3).map(t => t.label.toLowerCase())
//     : [];

// headersCaptionsArr = new Set(headersCaptionsArr);

// const rows0 = rows['0'] ?? {};
// const isHaveHead = Object.keys(rows0)
//     .some(rKey => headersCaptionsArr.has(rKey.toLowerCase()) || headersCaptionsArr.has(String(rows0[rKey]).toLowerCase()));

// if not have head when add first line;
// if (isHaveHead) {
//     rows = rows.slice(1);
// }
// }

//merges: {
//     "A18:A19": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "A18:A19"
//         },
//         "children": []
//     },
//     "B18:B19": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "B18:B19"
//         },
//         "children": []
//     },
//     "C18:C19": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "C18:C19"
//         },
//         "children": []
//     },
//     "A23:A24": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "A23:A24"
//         },
//         "children": []
//     },
//     "B23:B24": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "B23:B24"
//         },
//         "children": []
//     },
//     "C23:C24": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "C23:C24"
//         },
//         "children": []
//     },
//     "G1:H1": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "G1:H1"
//         },
//         "children": []
//     },
//     "A5:H5": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "A5:H5"
//         },
//         "children": []
//     },
//     "D2:H2": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "D2:H2"
//         },
//         "children": []
//     },
//     "D7:F7": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "D7:F7"
//         },
//         "children": []
//     },
//     "C7:C8": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "C7:C8"
//         },
//         "children": []
//     },
//     "B7:B8": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "B7:B8"
//         },
//         "children": []
//     },
//     "A7:A8": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "A7:A8"
//         },
//         "children": []
//     },
//     "G7:H7": {
//         "name": "mergeCell",
//         "attributes": {
//             "ref": "G7:H7"
//         },
//         "children": []
//     }
// }