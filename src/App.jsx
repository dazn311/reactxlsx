import { useState,useRef } from 'react';
import Header from "./components/Header.jsx";
import {getOS} from "./utils/getOS.js";
import UpLoadXlsx from "./components/UpLoadXlsx.jsx";
import TablesXlsx from "./components/TablesXlsx/TablesXlsx.jsx";
import './App.css';

function App() {
    const [fileD, setFileD] = useState({});
    const upLoadToWebRef = useRef(()=>{});
    const checkValue = useRef({utf8:getOS() !== 'Windows'});

    // 1.Step: read from user's file for upload to form;step.1
    upLoadToWebRef.current = (fileData) => {
        setFileD(prev=>({...prev, ...fileData}));
    }
    // console.log('17 fileD: ',fileD)
  return (
      <div id={'app'}>
          <Header/>
          <h1 className='text-2xl font-medium text-amber-600 text-center print-hidden'>Excel Page</h1>
          <UpLoadXlsx checkValue={checkValue} upLoadToWebRef={upLoadToWebRef} data={props}/>
          <TablesXlsx fileD={fileD} />
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