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
        const headArr = [..._get(data,['worksheetArr',headTabIdx],[])].filter(({value})=> Boolean(value));
        setTags(headArr.slice(0,lengthForMerge).map((item) => item.value));
        setSelectedTags(headArr.slice(0,lengthForMerge).map((item) => item.value));
    },[data])

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
            style={SPACE_STYLES}
        >
            <Space.Compact>
                <Tag style={TAG_STYLES}>объединить:</Tag>
                {tagsData.length > 0 ? tagsData.map((tag) => (
                    <Tag.CheckableTag
                        key={tag}
                        style={checkTagStyles(selectedTags,tag)}
                        checked={selectedTags.includes(tag)}
                        onChange={(checked) => handleChange(tag, checked)}
                    >{tag}</Tag.CheckableTag>
                )) : null}
            </Space.Compact>
            <Space.Compact>
                <Button
                    type="primary"
                    icon={<DownloadOutlined/>}
                    onClick={saveHandler}
                    ghost
                    loading={loadings}
                    style={BUTTON_STYLES}
                    size={'small'}>Сохранить</Button>
            </Space.Compact>
        </Space>
    </div>
}

export default ServiceBlock;

const SPACE_STYLES = {display: 'flex',justifyContent:'space-between'};
const BUTTON_STYLES = { color: "#f56a00", borderColor: "#f56a00" };
const TAG_STYLES = {
    color: "#813a03",
    backgroundColor:'transparent',
    fontSize: 16,
    border:'none',
    paddingInline:5,
    marginInlineEnd:4
};

function checkTagStyles(selectedTags,tag) {
    return {
        color: selectedTags.includes(tag) ? 'darkseagreen' :"#f56a00",//darkmagenta
        backgroundColor:selectedTags.includes(tag) ? '#80808075' :'transparent',
        fontSize: 14,
        padding: '0 5px',
        paddingInline:5,
        marginInlineEnd:4
    };
}