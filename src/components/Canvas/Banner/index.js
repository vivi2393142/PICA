import React from 'react';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../../img/banner';
import Resize from './Resize';
import Export from './Export';
import Share from './Share';
import * as firebase from '../../../firebase';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const Banner = (props) => {
    const allSettings = props.allSettings;
    let history = useHistory();
    const canvasSizeOptions = [
        { name: '自訂尺寸', type: 'custom', width: 1800, height: 1600 },
        { name: '橫式海報', type: 'poster', width: 1728, height: 1296, mmW: 609, mmH: 457 },
        { name: '網頁', type: 'web', width: 1280, height: 1024 },
        { name: 'Instagram', type: 'instagram', width: 1080, height: 1080 },
        { name: '橫式A4', type: 'a4', width: 842, height: 595, mmW: 297, mmH: 210 },
        { name: '明信片', type: 'postCard', width: 560, height: 288, mmW: 198, mmH: 102 },
        { name: '名片', type: 'nameCard', width: 255, height: 153, mmW: 90, mmH: 54 },
    ];
    // title setting
    const handleTitle = (e) => {
        const newCanvasSetting = { ...allSettings.canvasSetting, title: e.target.value };
        allSettings.setCanvasSetting(newCanvasSetting);
    };
    const handleSaveFileTemporary = () => {
        allSettings.canvas.discardActiveObject().renderAll();
        firebase.saveCanvasData(allSettings.canvas, allSettings.canvasSetting, props.fileId);
    };

    const defaultSetting = canvasSizeOptions.find(
        (item) => item.type === allSettings.canvasSetting.type
    );
    const typeJsx =
        allSettings.canvasSetting.type === 'custom' ? (
            <div className='statusSize'>{`自訂尺寸 ${allSettings.canvasSetting.width}×${allSettings.canvasSetting.height}像素`}</div>
        ) : defaultSetting && defaultSetting.mmW ? (
            <div className='statusSize'>{`${defaultSetting.name} ${defaultSetting.mmW}×${defaultSetting.mmH}毫米`}</div>
        ) : defaultSetting ? (
            <div className='statusSize'>{`${defaultSetting.name} ${defaultSetting.width}×${defaultSetting.height}像素`}</div>
        ) : null;

    return (
        <div className='banner'>
            <div className='logoWrapper'>
                <Link to='/main/user'>
                    <bannerIcons.Logo className='bannerLogo' />
                </Link>
            </div>
            <div className='bannerLeft'>
                <input
                    placeholder='未命名畫布'
                    defaultValue={allSettings.canvasSetting.title}
                    onChange={handleTitle}
                    onBlur={handleSaveFileTemporary}
                ></input>
                <div
                    onClick={handleSaveFileTemporary}
                    style={{
                        cursor: 'pointer',
                        border: '1px solid #555555',
                        padding: ' 0 0.5rem',
                        fontSize: ' 0.9rem',
                        color: '#555555',
                        letterSpacing: '1px',
                        marginLeft: '1rem',
                    }}
                >
                    {'點我儲存(暫時)'}
                </div>
                <div className='status'>已儲存</div>
            </div>
            <div className='bannerRight'>
                {typeJsx}
                <Resize drawingAreaSettings={allSettings} fileId={props.fileId} />
                {/* <div className='shareIconWrapper'>
                    <bannerIcons.Share className='bannerIcons' />
                </div> */}
                <Share fileId={props.fileId} />
                <Export drawingAreaSettings={allSettings} />
                <div
                    className='memberIconWrapper'
                    onClick={() => history.push(`../main/user/${props.currentUser.email}`)}
                >
                    <bannerIcons.Member className='bannerIcons' />
                </div>
            </div>
        </div>
    );
};

Banner.propTypes = {
    // TODO: 待資料確定後，明確定義 array 內容
    allSettings: PropTypes.object.isRequired,
    fileId: PropTypes.string.isRequired,
    currentUser: PropTypes.object,
};

export default Banner;
