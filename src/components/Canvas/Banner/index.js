import { memo } from 'react';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../../img/banner';
import Resize from './Resize';
import Export from './Export';
import Share from './Share';
import * as firebase from '../../../utils/firebase.js';
import { useHistory } from 'react-router-dom';
import { canvasSizeOptions } from '../../../utils/globalConfig.js';

const Banner = (props) => {
    const history = useHistory();
    const handleTitle = (e) => {
        const newCanvasSetting = { ...props.canvasSetting, title: e.target.value };
        props.setCanvasSetting(newCanvasSetting);
    };
    const handleSaveFile = () => {
        props.canvas.discardActiveObject().renderAll();
        firebase.saveCanvasData(props.canvas, props.canvasSetting, props.fileId);
    };
    // handler save status showing
    let saveStatusClassName = 'status';
    if (props.triggerSaveStatus) {
        saveStatusClassName = 'status showStatus';
        setTimeout(() => {
            props.setTriggerSaveStatus(false);
            saveStatusClassName = 'status';
        }, 3000);
    }
    const defaultSetting = canvasSizeOptions.find((item) => item.type === props.canvasSetting.type);
    const typeJsx =
        props.canvasSetting.type === 'custom' ? (
            <div className='statusSize'>{`自訂尺寸 ${props.canvasSetting.width}×${props.canvasSetting.height}像素`}</div>
        ) : defaultSetting && defaultSetting.mmW ? (
            <div className='statusSize'>{`${defaultSetting.name} ${defaultSetting.mmW}×${defaultSetting.mmH}毫米`}</div>
        ) : defaultSetting ? (
            <div className='statusSize'>{`${defaultSetting.name} ${defaultSetting.width}×${defaultSetting.height}像素`}</div>
        ) : null;

    return (
        <div className='banner'>
            <div className='logoWrapper'>
                <bannerIcons.Logo
                    className='bannerLogo'
                    onClick={() => history.push(`../main/user/${props.currentUser.email}`)}
                />
            </div>
            <div className='bannerLeft'>
                <input
                    placeholder='未命名畫布'
                    defaultValue={props.canvasSetting.title}
                    onFocus={() => {
                        props.setIsFocusInput(true);
                    }}
                    onChange={handleTitle}
                    onBlur={() => {
                        handleSaveFile();
                        props.setIsFocusInput(false);
                    }}
                ></input>
                <div className={saveStatusClassName}>已儲存</div>
            </div>
            <div className='bannerRight'>
                {typeJsx}
                <Resize
                    canvasSetting={props.canvasSetting}
                    setCanvasSetting={props.setCanvasSetting}
                    canvas={props.canvas}
                    setRatioSelectValue={props.setRatioSelectValue}
                    fileId={props.fileId}
                    setIsFocusInput={props.setIsFocusInput}
                />
                <Share fileId={props.fileId} />
                <Export canvasSetting={props.canvasSetting} canvas={props.canvas} />
            </div>
        </div>
    );
};

Banner.propTypes = {
    fileId: PropTypes.string.isRequired,
    currentUser: PropTypes.object,
    setIsFocusInput: PropTypes.func.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    setCanvasSetting: PropTypes.func.isRequired,
    canvas: PropTypes.object.isRequired,
    setRatioSelectValue: PropTypes.func.isRequired,
    triggerSaveStatus: PropTypes.bool.isRequired,
    setTriggerSaveStatus: PropTypes.func.isRequired,
};

export default memo(Banner);
