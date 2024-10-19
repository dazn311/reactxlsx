import {message, Upload} from 'antd';
import {fileReader} from "../utils/fileReader";
import IconInbox from "./IconInbox";

const { Dragger } = Upload;

// eslint-disable-next-line react/prop-types
function UpLoadXlsx({data,checkValue,upLoadToWebRef}) {

    const onChangeHandler = ({ file,fileName='fileName-L8.xlsx', onSuccess }) => {
        // console.log('[9 onChangeHandler] file:',file)
        const uid = file.uid;
        const name = file.name;
        fileReader ({
            file: file,
            checkValue,
            fileName: fileName,
        })
            .then(data => {
                // eslint-disable-next-line react/prop-types
                upLoadToWebRef.current({[uid]: {...data,fileName:name}});
                onSuccess("ok");
            })
            .catch(e => {
                onSuccess("error");
                // eslint-disable-next-line react/prop-types
                upLoadToWebRef.current({
                    [uid]:null
                });
                console.log('60 failed:',e);
            });
    }
    const onChangeHand = (info) => {
        const {status} = info.file;//removed

        switch (status) {
            case 'done':
                message.success(`${info.file.name} file uploaded successfully.`);
                return true;
            case 'error':
                message.error(`${info.file.name} file upload failed.`);
                return true;
            case 'removed':
                message.info(`${info.file.name} file removed successfully.`);
                // eslint-disable-next-line react/prop-types
                upLoadToWebRef.current({
                    [info.file.uid]:null
                });
                return true;
            default:
                if (status !== 'uploading') {
                    console.log('49 fileList: ', info.fileList);
                }
                return true;
        }
    }

    return (
        <Dragger
            onChange={onChangeHand}
            customRequest={onChangeHandler}
            accept={'.xls,.xlsx,.csv,.txt'}
            {...data}>
            <IconInbox/>
            <p className="ant-upload-text" style={{color:'wheat'}}>Кликните или перетащите файл на форму для выгрузки</p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload.
            </p>
        </Dragger>
    );
}

export default UpLoadXlsx;