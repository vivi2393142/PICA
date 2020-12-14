import React from 'react';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../../img/banner';
import Resize from './Resize';
import Export from './Export';
import * as firebase from '../../../firebase';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const Banner = (props) => {
    const allSettings = props.allSettings;
    let history = useHistory();
    // title setting
    const handleTitle = (e) => {
        const newCanvasSetting = { ...allSettings.canvasSetting, title: e.target.value };
        allSettings.setCanvasSetting(newCanvasSetting);
    };

    const handleSaveFileTemporary = () => {
        allSettings.canvas.discardActiveObject().renderAll();
        firebase.saveCanvasData(allSettings.canvas, allSettings.canvasSetting, props.fileId);
    };

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
                <div className='statusSize'>{`${allSettings.canvasSetting.width}×${allSettings.canvasSetting.height}像素`}</div>
                <Resize drawingAreaSettings={allSettings} fileId={props.fileId} />
                <div className='shareIconWrapper'>
                    <bannerIcons.Share className='bannerIcons' />
                </div>
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
    currentUser: PropTypes.object.isRequired,
};

export default Banner;
