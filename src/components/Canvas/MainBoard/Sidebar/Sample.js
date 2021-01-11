import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from '../../../../utils/firebase';
import { Alert, defaultAlertSetting } from '../../../Alert';

const Sample = (props) => {
    const [sampleList, setSampleList] = React.useState([]);
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertSetting, setAlertSetting] = React.useState({
        ...defaultAlertSetting,
    });

    React.useEffect(() => {
        if (props.canvasSetting.type) {
            firebase.getSampleList(props.canvasSetting.type, (result) => {
                setSampleList(result);
            });
        }
    }, [props.canvasSetting]);

    const handleTemplateUse = (e) => {
        const targetId = e.target.id;
        setAlertSetting({
            buttonNumber: 2,
            buttonOneFunction: () => {
                setShowAlert(false);
                firebase.getSingleSample(targetId, (data) => {
                    props.canvas.loadFromJSON(data);
                });
            },
            buttonTwoFunction: () => {
                setShowAlert(false);
                return;
            },
            buttonOneTitle: '確認套用',
            buttonTwoTitle: '取消套用',
            title: '即將重設所有物件',
            content: '套用範本將自動刪除現存在在畫布上的所有物件',
        });
        setShowAlert(true);
    };

    return (
        <div
            className='sidebarUnfoldInner sidebarUnfoldSample'
            style={{ display: props.currentSidebar === 'template' ? 'flex' : 'none' }}
        >
            {showAlert && (
                <Alert
                    buttonNumber={alertSetting.buttonNumber}
                    buttonOneFunction={alertSetting.buttonOneFunction}
                    buttonTwoFunction={alertSetting.buttonTwoFunction}
                    buttonOneTitle={alertSetting.buttonOneTitle}
                    buttonTwoTitle={alertSetting.buttonTwoTitle}
                    title={alertSetting.title}
                    content={alertSetting.content}
                />
            )}
            {sampleList.map((item) => {
                return (
                    <div
                        key={item.basicSetting.id}
                        className='unfoldItemGalleryWrapper'
                        style={{
                            width: props.isAtMobile ? '30%' : '45%',
                            overflow: 'visible',
                            height: 'auto',
                        }}
                    >
                        <img
                            key={item.basicSetting.id}
                            draggable='false'
                            onClick={handleTemplateUse}
                            className='unfoldItem unfoldItemGallery'
                            src={item.snapshot}
                            id={item.basicSetting.id}
                            style={{
                                position: 'relative',
                                top: 0,
                                left: 0,
                                transform: 'translate(0, 0)',
                            }}
                        ></img>
                    </div>
                );
            })}
        </div>
    );
};

Sample.propTypes = {
    currentSidebar: PropTypes.string.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    canvas: PropTypes.object.isRequired,
    isAtMobile: PropTypes.bool.isRequired,
};

export default React.memo(Sample);
