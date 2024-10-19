import {useState, useEffect} from "react";
import {Button, Tag, Space} from "antd";
import DownloadOutlined from "../../icons/DownloadOutlined.jsx";
import _get from 'lodash/get';
import './ServiceBlock.scss';

function ServiceBlock({fileDataArr,onClickSave}) {
    const [tagsData, setTags] = useState(['№', 'ФИО', 'Дата', 'Sports']);
    const [selectedTags, setSelectedTags] = useState(['№', 'ФИО', 'Дата']);

    useEffect(()=> {
        const headTabIdx = _get(fileDataArr,[0,'headTabIdx']);
        const headArr = [..._get(fileDataArr,[0,'worksheetArr',headTabIdx],[])];
        setTags(headArr.slice(0,4).map((item) => item.value));
        setSelectedTags(headArr.slice(0,3).map((item) => item.value));
    },[fileDataArr])
    if (fileDataArr.length === 0) {
        return null;
    }
    const handleChange = (tag, checked) => {
        const nextSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter((t) => t !== tag);
        console.log('You are interested in: ', nextSelectedTags);
        setSelectedTags(nextSelectedTags);
    };
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
                    border:'none'
                }}>объединить:</Tag>
                {tagsData.length > 0 ? tagsData.map((tag) => (
                    <Tag.CheckableTag
                        key={tag}
                        style={{
                            color: selectedTags.includes(tag) ? 'darkmagenta' :"#f56a00",//darkmagenta
                            backgroundColor:selectedTags.includes(tag) ? 'grey' :'transparent',
                            fontSize: 14,
                            padding: '0 5px',
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
                    onClick={onClickSave}
                    ghost
                    style={{ color: "#f56a00", borderColor: "#f56a00" }}
                    size={'small'}>
                    Сохранить
                </Button>
            </Space.Compact>
        </Space>

    </div>
}

export default ServiceBlock;