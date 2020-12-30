import React from 'react';
import PropTypes from 'prop-types';
import * as icons from '../../../../img/icons';
import { Alert, defaultAlertSetting } from '../../../Alert';
import deleteLoading from '../../../../img/src/deleteLoading.svg';
import * as firebase from '../../../../utils/firebase.js';
import * as utils from '../../../../utils/globalUtils.js';

const Upload = (props) => {
    const [uploadProgressValue, setUploadProgressValue] = React.useState(0);
    const [showUploadCover, setShowUploadCover] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertSetting, setAlertSetting] = React.useState({
        ...defaultAlertSetting,
    });
    // handlers: uploaded function
    const fileSizeLimit = 3145680;
    const handleUploadImage = (e) => {
        if (e.target.files[0].size > fileSizeLimit) {
            setAlertSetting({
                buttonNumber: 1,
                buttonOneFunction: () => setShowAlert(false),
                buttonTwoFunction: () => {},
                buttonOneTitle: '關閉',
                buttonTwoTitle: '',
                title: '上傳錯誤',
                content: '請勿上傳超過3mb之圖片',
            });
            setShowAlert(true);
        } else {
            firebase.uploadToStorage(
                e.target.files,
                props.fileId,
                (uploadValue) => setUploadProgressValue(uploadValue),
                () => setUploadProgressValue(0)
            );
        }
    };
    ondrop = (e) => {
        e.preventDefault();
        setShowUploadCover(false);
        const files = e.dataTransfer.files;
        const basicAlertForUpload = {
            buttonNumber: 1,
            buttonOneFunction: () => setShowAlert(false),
            buttonTwoFunction: () => {},
            buttonOneTitle: '關閉',
            buttonTwoTitle: '',
            title: '上傳錯誤',
        };
        // prevent canvas drop event
        if (files.length) {
            if (files.length > 1) {
                setAlertSetting({
                    ...basicAlertForUpload,
                    content: '一次限上傳一張圖片',
                });
                setShowAlert(true);
            } else if (files[0].size > fileSizeLimit) {
                setAlertSetting({
                    ...basicAlertForUpload,
                    content: '請勿上傳超過3mb之圖片',
                });
                setShowAlert(true);
            } else if (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg') {
                setAlertSetting({
                    ...basicAlertForUpload,
                    content: '請上傳jpeg或png格式檔案',
                });
                setShowAlert(true);
            } else {
                firebase.uploadToStorage(
                    files,
                    props.fileId,
                    (uploadValue) => setUploadProgressValue(uploadValue),
                    () => setUploadProgressValue(0)
                );
            }
        }
    };
    ondragenter = (e) => {
        if (e.dataTransfer.types[0] === 'Files' && !props.isAtMobile) {
            setShowUploadCover(true);
            props.setCurrentSidebar('upload');
        }
    };
    onmouseout = (e) => {
        const from = e.relatedTarget || e.toElement;
        if (!from || from.nodeName == 'HTML') {
            setShowUploadCover(false);
        }
    };

    return (
        <div
            className='sidebarUnfoldInner sidebarUnfoldUpload'
            style={{ display: props.currentSidebar === 'upload' ? 'flex' : 'none' }}
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
            {uploadProgressValue === 0 ? (
                <label className='unfoldItem uploadLabel'>
                    上傳圖片
                    <input
                        className='uploadInput'
                        type='file'
                        accept='image/png, image/jpeg'
                        onChange={handleUploadImage}
                    ></input>
                </label>
            ) : (
                <div className='progressWrapper'>
                    <progress className='uploadProgress' value={uploadProgressValue} max='100'></progress>
                    <div>LOADING</div>
                    <div>{uploadProgressValue}%</div>
                </div>
            )}
            {props.uploadedFiles &&
                props.uploadedFiles.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className='unfoldItemImgWrapper unfoldItemGalleryWrapper'
                            onMouseDown={(e) => props.saveDragItem.func(e)}
                        >
                            <img
                                className='unfoldItemImg unfoldItemGallery'
                                onClick={(e) => {
                                    utils.addImage(
                                        e.target,
                                        props.nextAddPosition,
                                        props.canvas,
                                        props.canvasSetting
                                    );
                                    props.adjSetNextPosition();
                                }}
                                draggable={!props.isAtMobile}
                                src={item.src}
                                onLoad={(e) => {
                                    e.target.naturalHeight > e.target.naturalWidth
                                        ? (e.target.parentNode.style.width = '29%')
                                        : (e.target.parentNode.style.width = '58%');
                                }}
                            ></img>
                            <div
                                className='close'
                                id={item.path}
                                onClick={(e) => {
                                    e.target.previousElementSibling.src = deleteLoading;
                                    e.target.previousElementSibling.style.height = '100%';
                                    firebase.removeUploadImg(e, props.fileId);
                                }}
                            >
                                x
                            </div>
                        </div>
                    );
                })}
            {showUploadCover && (
                <div className='uploadCover'>
                    <icons.CoverUpload className='uploadIcon' />
                    <div>拖曳以上傳檔案</div>
                    <span>您可以上傳jpg或png檔案</span>
                </div>
            )}
        </div>
    );
};

Upload.propTypes = {
    canvas: PropTypes.object.isRequired,
    canvasSetting: PropTypes.object.isRequired,
    currentSidebar: PropTypes.string.isRequired,
    setCurrentSidebar: PropTypes.func.isRequired,
    saveDragItem: PropTypes.object.isRequired,
    isAtMobile: PropTypes.bool.isRequired,
    nextAddPosition: PropTypes.object.isRequired,
    adjSetNextPosition: PropTypes.func.isRequired,
    uploadedFiles: PropTypes.array.isRequired,
    fileId: PropTypes.string.isRequired,
};

export default React.memo(Upload);
