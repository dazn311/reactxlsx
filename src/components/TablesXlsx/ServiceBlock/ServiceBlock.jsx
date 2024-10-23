import {useState, useEffect} from "react";
import {Button, Tag, Space} from "antd";
import DownloadOutlined from "../../icons/DownloadOutlined.jsx";
import _get from 'lodash/get';
import {saveXlsx} from "../../../utils/saveXlsx.js";
import './ServiceBlock.scss';

function ServiceBlock({data,headTabIdx,lengthForMerge=4}) {
    const [tagsData, setTags] = useState(['№', 'ФИО', 'Дата', 'Sports']);
    const [selectedTags, setSelectedTags] = useState(['№', 'ФИО', 'Дата']);
    const [loadings, setLoadings] = useState(false);

    useEffect(()=> {
        // const headTabIdx = _get(fileDataArr,[0,'headTabIdx']);
        const headArr = [..._get(data,['worksheetArr',headTabIdx],[])];
        setTags(headArr.slice(0,lengthForMerge).map((item) => item.value));
        setSelectedTags(headArr.slice(0,lengthForMerge).map((item) => item.value));
    },[data])

    // if (fileDataArr.length === 0) {
    //     return null;
    // }
    const handleChange = (tag, checked) => {
        const nextSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter((t) => t !== tag);
        setSelectedTags(nextSelectedTags);
    };

    const saveHandler = () => {
        setLoadings(true);
        saveXlsx(data)
            .finally(() => {
                setLoadings(false);
            });
    }

    return <div className="service-block">
        <Space
            direction="horizontal"
            align={'start'}
            size="middle"
            style={{display: 'flex',justifyContent:'space-between'}}
        >
            <Space.Compact>
                <Tag style={{
                    color: "#813a03",
                    backgroundColor:'transparent',
                    fontSize: 16,
                    border:'none',
                    paddingInline:5,
                    marginInlineEnd:4
                }}>объединить:</Tag>
                {tagsData.length > 0 ? tagsData.map((tag) => (
                    <Tag.CheckableTag
                        key={tag}
                        style={{
                            color: selectedTags.includes(tag) ? 'darkseagreen' :"#f56a00",//darkmagenta
                            backgroundColor:selectedTags.includes(tag) ? '#80808075' :'transparent',
                            fontSize: 14,
                            padding: '0 5px',
                            paddingInline:5,
                            marginInlineEnd:4
                    }}
                        checked={selectedTags.includes(tag)}
                        onChange={(checked) => handleChange(tag, checked)}
                    >
                        {tag}
                    </Tag.CheckableTag>
                )) : null}
            </Space.Compact>
            <Space.Compact>
                <Button
                    type="primary"
                    icon={<DownloadOutlined/>}
                    onClick={saveHandler}
                    ghost
                    loading={loadings}
                    style={{ color: "#f56a00", borderColor: "#f56a00" }}
                    size={'small'}>
                    Сохранить
                </Button>
            </Space.Compact>
        </Space>

    </div>
}

export default ServiceBlock;