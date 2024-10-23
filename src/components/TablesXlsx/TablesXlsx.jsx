import React, {useState,useRef} from "react";
import _get from 'lodash/get';
import ServiceBlock from "./ServiceBlock/ServiceBlock.jsx";
import {DatePicker, Input} from "antd";
import dayjs from 'dayjs';
import './tablesXlsx.scss';

export default function TablesXlsx({data={},changeValue,id=''}) {
    const tabRef = React.useRef(null);
    const {worksheetArr, startAIdx, headTabIdx, endAIdx, titleIdx,lengthForMerge} = data;

    return (
        <div className='group cursor-pointer sm:m-2'>
            <ServiceBlock data={data} headTabIdx={headTabIdx} lengthForMerge={lengthForMerge} />
            <div key={'tables_' + id} className='p-2'>
                <table
                    ref={tabRef}
                    cellPadding={"0"}
                    cellSpacing={"0"}
                    id={"table_resize"}
                    className={"table_resize"}
                >
                    <tbody>
                    {
                        worksheetArr.map((LineArr, idx, fArr) => (
                            <TrLine
                                fArr={fArr}
                                key={idx}
                                changeValue={changeValue}
                                worksheetArr={worksheetArr}
                                idx={idx}
                                startAIdx={startAIdx}
                                endAIdx={endAIdx}
                                LineArr={LineArr}/>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function TrLine({LineArr = [], idx = 0, changeValue,startAIdx=0, endAIdx=0}) {
    if (!Array.isArray(LineArr)) return null;

    return (<tr>
        {
            LineArr.map((valueObj, index) => {
                const mergeObj = _get(valueObj, ['merge'],{});
                const type = _get(valueObj, ['type'],'string');
                // if (type === 'date') {
                //     console.log('52 valueObj:',valueObj)
                //     console.log('52 dayjs(valueObj.value):',dayjs(valueObj.value))
                // }

                return (<td
                        key={`${valueObj.value + index}-${index}-${idx}`}
                        data-col={idx}
                        style={stylesHelper(valueObj,idx,startAIdx,endAIdx)}
                        // style={{...style,...bold, padding: 4,textAlign:textAlign}}
                        {...mergeObj}
                    >
                        <EditBaseAndDate
                            type={type}
                            index={index}
                            lineIndex={idx}
                            changeValue={changeValue}
                            value={valueObj.value}
                        />

                    </td>
                )
            })
        }
    </tr>);
}

function EditBaseAndDate({type,value,index,lineIndex,changeValue}) {
    const [isEdit,setIsEdit] = useState(false);
    const dateRef = useRef();
    const inputRef = useRef();

    const clickHandler = (event) => {
        setIsEdit(prevState => !prevState);
        // console.log('85 event:',event.locale('ru-RU').format());
        changeValue(lineIndex,index, event.locale('ru-RU').format());
    }
    const divClickHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        changeValue(lineIndex,index, event.target.value);
        // console.log('94 event:',event.target.value);
        // console.log('95 key:',event);
    }
    const onEnterHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        // console.log('95 key:',event);
        if (event.altKey) {
            setIsEdit(!event.target.value);
        }
    }

    const divHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsEdit(true);
        if (type === 'date') {
            dateRef.current?.focus();
        } else {
            inputRef.current?.focus();
        }
    }

    // console.log('86 date:',dayjs('2018-05-09').locale('ru-RU').format('DD.MM.YYYY'));

    if (isEdit) {
        if (type === 'date') {
            return (<DatePicker
                ref={dateRef}
                getValueProps={(value) => ({ value: !!value ? dayjs(value) : "", })}
                // value={'2024-02-15'}
                onChange={clickHandler}
                defaultValue={dayjs(value)}
                onBlur={() => setIsEdit(false)}
                format="DD.MM.YYYY"
                size={'small'}  />)
        }
        return <Input.TextArea
            ref={inputRef}
            onBlur={() => setIsEdit(false)}
            value={String(value)}
            variant={'borderless'}
            onPressEnter={onEnterHandler}
            onChange={divClickHandler}
            size={'small'}/>
    }
    return (<div data-column={index} onClick={divHandler} >
              {type === 'date' ? dayjs(value).locale('ru-RU').format('DD.MM.YYYY') : String(value)}
            </div>);
}

function stylesHelper(valueObj, idx, startAIdx, endAIdx) {
    return {
        ..._get(valueObj, ['style'],{}),
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