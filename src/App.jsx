import {useState, useRef, Suspense} from 'react';
import {getOS} from "./utils/getOS.js";
import UpLoadXlsx from "./components/UpLoadXlsx.jsx";
import TablesXlsx from "./components/TablesXlsx/TablesXlsx.jsx";
import _get from 'lodash/get';
import './App.css';

function App() {
  const [fileD, setFileD] = useState({});
  const upLoadToWebRef = useRef(()=>{});
  const checkValue = useRef({utf8:getOS() !== 'Windows'});

    // 1.Step: read from user's file for upload to form;step.1
  upLoadToWebRef.current = (fileData) => {
    setFileD(prev=>({...prev, ...fileData}));
  }
  const changeValue = (lineIndex,id,value,key) => {
    // setFileD(prev=>({...prev, ...fileData}));
      console.log('[18 App] changeValue lineIndex,id,value,key: ',lineIndex,id,value,key);
      setFileD(prev=> {
          const worksheetArr = [..._get(prev,[key,'worksheetArr'],[])];
          const lineArr = [..._get(worksheetArr,[lineIndex],[])];
          lineArr[id] = {...lineArr[id],value};
          // debugger
          worksheetArr[lineIndex] = lineArr;
          return {
              ...prev,
              [key]: {
                  ...prev[key],
                  worksheetArr:worksheetArr,
              }
          };
      });
  }
  console.log('17 fileD: ',fileD);

  return (
      <div id={'app'}>
          <h1 className='text-2xl font-medium text-amber-600 text-center print-hidden'>Excel Page</h1>
          <Suspense fallback={<div>Loading...</div>}>
              <UpLoadXlsx checkValue={checkValue} upLoadToWebRef={upLoadToWebRef} data={props}/>
          </Suspense>
          {
              Object.keys(fileD).map((key) => {
                  return <TablesXlsx data={fileD[key]} changeValue={(lineIndex,id,value)=>changeValue(lineIndex,id,value,key)} key={key} id={key} />;
              })
          }
      </div>
  )
}

export default App;

const props = {
    name: 'file',
    multiple: true,
    className: 'print:hidden',
    onDrop(e) {
        console.log('Dropped files size', e.dataTransfer.files?.size);
    },
};