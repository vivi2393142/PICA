import React from 'react';
import styles from '../../css/addNew.module.scss';
import PropTypes from 'prop-types';
import * as firebase from '../../utils/firebase.js';
import * as mainIcon from '../../img/mainPage';
import { nanoid } from 'nanoid';
import { Alert, defaultAlertSetting } from '../Alert';
import { canvasSizeOptions } from '../../utils/globalConfig.js';

const sizeAdjustForMediaQuery = { superSmall: 8, small: 6, normal: 5 };
const handleCreateNew = (e, currentUser, titleInput, choices) => {
    const id = nanoid();
    const canvasSetting = {
        id: id,
        userEmail: currentUser.email,
        title: titleInput,
        width: choices.width,
        height: choices.height,
        type: choices.type,
    };
    if (choices.type === 'custom') {
        canvasSetting.width = customSize.width;
        canvasSetting.height = customSize.height;
        firebase.createNewCanvas(canvasSetting, currentUser.email);
    } else if (choices.way === 'sample') {
        firebase.createSampleCanvas(canvasSetting, choices.sampleFileId);
    } else {
        firebase.createNewCanvas(canvasSetting, currentUser.email);
    }
};

const AddNew = (props) => {
    const [currentStep, setCurrentStep] = React.useState(1);
    const [chosenRec, setChosenRec] = React.useState(null);
    const [titleInput, setTitleInput] = React.useState('');
    const [showAlert, setShowAlert] = React.useState(false);
    const [alertSetting, setAlertSetting] = React.useState({
        ...defaultAlertSetting,
    });
    const [choices, setChoices] = React.useState({
        type: null,
        way: null,
        width: null,
        height: null,
        name: '',
        sampleFileId: null,
    });
    const [sampleList, setSampleList] = React.useState();
    const imgSizeRatio =
        props.isAtMobile === 'superSmall'
            ? sizeAdjustForMediaQuery.superSmall
            : props.isAtMobile === 'small'
            ? sizeAdjustForMediaQuery.small
            : sizeAdjustForMediaQuery.normal;
    const sizeChoosingHandler = (type, width, height) => {
        setChosenRec(type);
        setChoices({ ...choices, type, width, height });
    };
    const restartHandler = () => {
        setCurrentStep(1);
        setChosenRec(null);
        setChoices({
            type: null,
            way: null,
            width: null,
            height: null,
            name: '',
            sampleFileId: null,
        });
    };
    const samplerListHandler = (type) => {
        firebase.getSampleList(type, (result) => {
            setSampleList(result);
        });
    };
    // custom size
    const [customSize, setCustomSize] = React.useState({ width: '', height: '' });
    const [showHint, setShowHint] = React.useState(false);
    const handleCustomWidth = (e) => {
        if (/^\d*$/.test(e.target.value)) {
            if (e.target.value < 150 || e.target.value > 2000) {
                setShowHint(true);
                e.target.style.borderColor = 'rgb(243, 71, 71)';
            } else {
                setShowHint(false);
                e.target.style.borderColor = '#acacac';
            }
            setCustomSize({ ...customSize, width: e.target.value });
        }
    };
    const handleCustomHeight = (e) => {
        if (/^\d*$/.test(e.target.value)) {
            if (e.target.value < 150 || e.target.value > 2000) {
                setShowHint(true);
                e.target.style.borderColor = 'rgb(243, 71, 71)';
            } else {
                setShowHint(false);
                e.target.style.borderColor = '#acacac';
            }
            setCustomSize({ ...customSize, height: e.target.value });
        }
    };

    const sampleListJsx =
        sampleList &&
        sampleList.map((item, index) => {
            return (
                <div key={index}>
                    <img
                        src={item.snapshot}
                        className={`${styles.sampleImg} ${
                            choices.sampleFileId ? styles.notChosenSampleImg : ''
                        }${choices.sampleFileId === item.basicSetting.id ? styles.chosenSampleImg : ''}`}
                        onClick={() => {
                            setChoices({ ...choices, sampleFileId: item.basicSetting.id });
                        }}
                    ></img>
                </div>
            );
        });
    const sizeImgJsx = canvasSizeOptions.map((item, index) => {
        return (
            <div
                className={`${styles.rec} ${styles[item.type]} ${chosenRec ? styles.recTransparent : ''}
                ${chosenRec === item.type ? styles.chosenRex : ''}`}
                key={index}
                style={{
                    width: item.width / imgSizeRatio + 'px',
                    height: item.height / imgSizeRatio + 'px',
                }}
                onClick={() => sizeChoosingHandler(item.type, item.width, item.height)}
            >
                <div className={styles.text}>{item.name}</div>
                <div
                    className={`${styles.arrowV} ${
                        chosenRec === item.type && item.type !== 'custom' ? styles.show : ''
                    }`}
                    style={{
                        left: -item.height / imgSizeRatio / 2 - 15 + 'px',
                        top: item.height / imgSizeRatio / 2 + 'px',
                        width: item.height / imgSizeRatio + 'px',
                    }}
                >
                    <div className={styles.arrowText}>{item.mmW ? item.mmW + 'mm' : item.width + 'px'}</div>
                </div>
                <div
                    className={`${styles.arrowH} ${
                        chosenRec === item.type && item.type !== 'custom' ? styles.show : ''
                    }`}
                    style={{
                        width: item.width / imgSizeRatio + 'px',
                    }}
                >
                    <div className={styles.arrowText}>{item.mmH ? item.mmH + 'mm' : item.height + 'px'}</div>
                </div>
            </div>
        );
    });
    const sizeOptions = canvasSizeOptions.map((item, index) => {
        return (
            <div
                key={index}
                className={`${styles.option} ${chosenRec === item.type ? styles.chosenOptions : ''}`}
                onClick={() => sizeChoosingHandler(item.type)}
            >
                <div className={styles.title}> {item.name}</div>
                {item.type !== 'custom' ? (
                    <div className={styles.details}>
                        {item.mmW ? item.mmW + 'mm' : item.width + 'px'} x{' '}
                        {item.mmH ? item.mmH + 'mm' : item.height + 'px'}
                    </div>
                ) : (
                    <div className={styles.details}>? px x ? px</div>
                )}
            </div>
        );
    });

    return (
        <div className={styles.addNew}>
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
            <button className={styles.addButton}>
                <div className={styles.addIcon}></div>
                <div
                    className={styles.btnText}
                    onClick={() => {
                        if (props.currentUser.email === 'noUser') {
                            setAlertSetting({
                                buttonNumber: 1,
                                buttonOneFunction: () => setShowAlert(false),
                                buttonTwoFunction: () => {},
                                buttonOneTitle: '關閉',
                                buttonTwoTitle: '',
                                title: '新增錯誤',
                                content: '請先註冊或登入會員以新增畫布',
                            });
                            setShowAlert(true);
                        } else {
                            restartHandler();
                            props.setIsAddingNew(true);
                        }
                    }}
                >
                    新增畫布
                </div>
            </button>
            {props.isAddingNew && (
                <div className={styles.cover}>
                    <div className={styles.box}>
                        <div className={styles.steps}>
                            <div
                                className={`${styles.step} ${currentStep === 1 ? styles.current : ''} ${
                                    currentStep > 1 ? styles.chosen : ''
                                }`}
                            >
                                <div className={`${styles.text} ${currentStep >= 1 ? styles.textShow : ''}`}>
                                    step.1
                                </div>
                            </div>
                            <div
                                className={`${styles.step} ${currentStep === 2 ? styles.current : ''}  ${
                                    currentStep > 2 ? styles.chosen : ''
                                }`}
                            >
                                <div className={`${styles.text} ${currentStep >= 2 ? styles.textShow : ''}`}>
                                    step.2
                                </div>
                            </div>
                            <div
                                className={`${styles.step}  ${currentStep === 3 ? styles.current : ''}  ${
                                    currentStep > 3 ? styles.chosen : ''
                                }`}
                            >
                                <div className={`${styles.text} ${currentStep >= 3 ? styles.textShow : ''}`}>
                                    step.3
                                </div>
                            </div>
                        </div>
                        <div className={styles.stepTitle}>
                            {currentStep === 1
                                ? '選擇畫布尺寸'
                                : currentStep === 2 && chosenRec === 'custom'
                                ? '輸入自訂尺寸'
                                : currentStep === 2
                                ? '選擇建立方式'
                                : currentStep === 3
                                ? '為畫布命名'
                                : null}
                        </div>
                        {currentStep === 1 ? (
                            <div className={styles.stepContentWrapper}>
                                <div className={styles.sizeOptions}>{sizeOptions}</div>
                                <div className={styles.sizeImg}>{sizeImgJsx}</div>
                            </div>
                        ) : currentStep === 2 && chosenRec === 'custom' ? (
                            <div className={`${styles.stepContentWrapper} ${styles.customWrapper}`}>
                                <label className={styles.customInput}>
                                    寬度
                                    <input
                                        maxLength='4'
                                        placeholder='須介於150px ~ 2000px'
                                        value={customSize.width}
                                        onChange={handleCustomWidth}
                                    ></input>
                                    <span className={styles.unit}>px</span>
                                </label>
                                <label className={styles.customInput}>
                                    高度
                                    <input
                                        maxLength='4'
                                        placeholder='須介於150px ~ 2000px'
                                        value={customSize.height}
                                        onChange={handleCustomHeight}
                                    ></input>
                                    <span className={styles.unit}>px</span>
                                </label>
                                {showHint && <div className={styles.hint}>※ 須介於150px ~ 2000px</div>}
                            </div>
                        ) : currentStep === 2 && chosenRec !== 'custom' ? (
                            <div className={styles.stepContentWrapper}>
                                <div className={styles.optionsWrapper}>
                                    <div
                                        className={`${styles.option} ${
                                            choices.way === 'sample' || !choices.way
                                                ? ' '
                                                : styles.notChosenOption
                                        } ${choices.way === 'sample' ? styles.optionSample : ''}`}
                                        onClick={() => {
                                            setChoices({ ...choices, way: 'sample' });
                                            samplerListHandler(choices.type);
                                        }}
                                    >
                                        <mainIcon.StartWithTem className={styles.icon} />
                                        從範本建立
                                    </div>
                                    <div
                                        className={`${styles.option} ${
                                            choices.way === 'blank' || !choices.way
                                                ? null
                                                : styles.notChosenOption
                                        } ${choices.way === 'sample' ? styles.optionSample : ''}`}
                                        onClick={() => setChoices({ ...choices, way: 'blank' })}
                                    >
                                        <mainIcon.StartWithBlank className={styles.icon} />
                                        建立空白畫布
                                    </div>
                                </div>
                                {choices.way === 'sample' && (
                                    <div className={styles.sampleList}>{sampleListJsx}</div>
                                )}
                            </div>
                        ) : currentStep === 3 ? (
                            <div className={styles.stepContentWrapper}>
                                <label>
                                    畫布名稱
                                    <input
                                        className={styles.nameInput}
                                        placeholder='未命名畫布'
                                        onChange={(e) => setTitleInput(e.target.value)}
                                        value={titleInput}
                                    ></input>
                                </label>
                            </div>
                        ) : null}
                        {currentStep > 1 && (
                            <div className={styles.nextStepWrapper}>
                                <div
                                    className={styles.nextStep}
                                    onClick={() => {
                                        setCurrentStep(currentStep - 1);
                                        setShowHint(false);
                                    }}
                                >
                                    上一步
                                </div>
                            </div>
                        )}
                        {(currentStep === 1 && choices.type) ||
                        (currentStep === 2 &&
                            (choices.way === 'blank' ||
                                (choices.way === 'sample' && choices.sampleFileId) ||
                                (choices.type === 'custom' &&
                                    customSize.width > 149 &&
                                    customSize.width < 2001 &&
                                    customSize.height > 149 &&
                                    customSize.height < 2001))) ? (
                            <div className={styles.nextStepWrapper}>
                                <div
                                    className={styles.nextStep}
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                >
                                    下一步
                                </div>
                            </div>
                        ) : currentStep < 3 ? (
                            <div className={styles.nextStepWrapper}>
                                <div className={`${styles.nextStep} ${styles.disableStep}`}>下一步</div>
                            </div>
                        ) : currentStep === 3 ? (
                            <div className={styles.nextStepWrapper}>
                                <div
                                    className={styles.nextStep}
                                    onClick={(e) =>
                                        handleCreateNew(e, props.currentUser, titleInput, choices)
                                    }
                                >
                                    完成
                                </div>
                            </div>
                        ) : null}

                        <div className={styles.close} onClick={() => props.setIsAddingNew(false)}>
                            x
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

AddNew.propTypes = {
    currentUser: PropTypes.object,
    isAddingNew: PropTypes.bool.isRequired,
    setIsAddingNew: PropTypes.func.isRequired,
    isAtMobile: PropTypes.string.isRequired,
};

export default React.memo(AddNew);
