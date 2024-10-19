import React from "react";
import _get from 'lodash/get';
import ServiceBlock from "./ServiceBlock/ServiceBlock.jsx";
import './tablesXlsx.scss';

export default function TablesXlsx({fileD = {}}) {
    const tabRef = React.useRef(null);
    const fileDataArr = Object.values(fileD);

    return (
        <div className='group cursor-pointer sm:m-2'>
            <ServiceBlock fileDataArr={fileDataArr}/>
            {
                fileDataArr.map(({worksheetArr, startAIdx, lastIndex, endAIdx, titleIdx}, idx) => (
                    <div key={'tables_' + idx} className='p-2'>
                        <table
                            ref={tabRef}
                            cellPadding={"0"}
                            cellSpacing={"0"}
                            id={"table_resize"}
                            className={"table_resize"}
                        >
                            <tbody>

                            {
                                worksheetArr.slice(1).map((LineArr, idx, fArr) => (
                                    <TrLine
                                        fArr={fArr}
                                        key={idx}
                                        worksheetArr={worksheetArr}
                                        idx={idx}
                                        startAIdx={startAIdx}
                                        endAIdx={endAIdx}
                                        LineArr={LineArr}/>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>))
            }
        </div>
    );
}

function TrLine({LineArr = [], idx = 0, startAIdx=0, endAIdx=0}) {
    if (!Array.isArray(LineArr)) return null;

    return (<tr>
        {
            LineArr.map((valueObj, index) => {
                const mergeObj = _get(valueObj, ['merge'],{});

                return (<td
                        key={`${valueObj.value + index}-${index}-${idx}`}
                        data-col={idx}
                        style={stylesHelper(valueObj,idx,startAIdx,endAIdx)}
                        // style={{...style,...bold, padding: 4,textAlign:textAlign}}
                        {...mergeObj}
                    >
                        <div contentEditable={true} data-column={index}>{String(valueObj.value)}</div>
                    </td>
                )
            })
        }
    </tr>);
}

function stylesHelper(valueObj,idx,startAIdx,endAIdx) {
    return {..._get(valueObj, ['style'],{}),
        padding: 4,
        textAlign:'center',
        ...(idx >= startAIdx && idx < endAIdx) ? {textWrap:'nowrap'}:{}
    };
}
// if (value === undefined) {
//     // return null;
//     value = null;
// }

// const bold = _get(LineArr,[key,'s','font','bold'],false) ? {fontWeight: 'bold'}: {};
// const textAlign = _get(LineArr,[key,'s','alignment','horizontal'],'left');
// const style = worksheetArr.length === index +1 ? {} :{borderRight: '1px solid grey'};
// const value = !!LineArr[key] ? valueOf(LineArr[key]) : ' ';

// <tr>
//     <th
//         colSpan={/*set over btn*/worksheetArr[titleIdx][0].colSpan ?? 1}
//         style={{fontSize/*set over btn*/: 18, fontWeight: 500, paddingBottom: 10, paddingTop: 10}}
//     >
//         <div contentEditable={true}>{worksheetArr[titleIdx][0]}</div>
//     </th>
// </tr>

// function valueOf(obj) {
//     switch (obj?.t) {
//         case 's':
//             return obj['v'];//.trim();
//         case 'n':
//             return !!obj['w'] ? String(obj['v']) : '0';
//         case 'd':
//             // return obj['w'];
//             const date = obj['w'];
//             const [m, d, yy] = date.split('/');
//             const mo = m.length === 2 ? m : `0${m}`;
//             const day = d.length === 2 ? d : `0${d}`;
//             return `${day}.${mo}.${yy}`;
//         // const timezone = new Date().getTimezoneOffset();//-180
//         // date.setDate(date.getDate() + 1);
//         // return date.toLocaleDateString('ru-RU');
//         default:
//             return ' ';
//     }
// }

// const fObj = fileDataArr[0].fileData[0];
// const fKeys = Object.keys(fObj ?? {});
// const columns = [...Array(fKeys.length).fill('').map((_, i) => ({
//   title: fKeys[i],
//       dataIndex: fKeys[i],
//       key: fKeys[i],
// }))
// ];

// {
//   fileDataArr.map(({fileData}) => (<Table bordered={true} showHeader={false} dataSource={fileData.slice(1,-3)} columns={columns}/>))
// }