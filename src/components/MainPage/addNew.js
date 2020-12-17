import React from 'react';
import styles from '../../css/addNew.module.scss';
import PropTypes from 'prop-types';
import * as firebase from '../../firebase';
import * as mainIcon from '../../img/mainPage';
import { nanoid } from 'nanoid';

// export default App;
const AddNew = (props) => {
    const [currentStep, setCurrentStep] = React.useState(1);
    const [chosenRec, setChosenRec] = React.useState(null);
    const [titleInput, setTitleInput] = React.useState('');
    const [choices, setChoices] = React.useState({
        type: null,
        way: null,
        width: null,
        height: null,
        name: '',
        sampleFileId: null,
    });
    const [sampleList, setSampleList] = React.useState();
    const imgSizeRatio = 5;
    const canvasSizeOptions = [
        { name: '自訂尺寸', type: 'custom', width: 1800, height: 1600 },
        { name: '橫式海報', type: 'poster', width: 1728, height: 1296, mmW: 609, mmH: 457 },
        { name: '網頁', type: 'web', width: 1280, height: 1024 },
        { name: 'Instagram', type: 'instagram', width: 1080, height: 1080 },
        { name: '橫式A4', type: 'a4', width: 842, height: 595, mmW: 297, mmH: 210 },
        { name: '明信片', type: 'postCard', width: 560, height: 288, mmW: 198, mmH: 102 },
        { name: '名片', type: 'nameCard', width: 255, height: 153, mmW: 90, mmH: 54 },
    ];
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
    const handleCreateNew = (e) => {
        const id = nanoid();
        const canvasSetting = {
            id: id,
            userEmail: props.currentUser.email,
            title: titleInput,
            width: choices.width,
            height: choices.height,
            type: choices.type,
        };
        if (choices.way === 'sample') {
            firebase.createSampleCanvas(canvasSetting, choices.sampleFileId);
        } else {
            firebase.createNewCanvas(canvasSetting, props.currentUser.email);
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
                        }${
                            choices.sampleFileId === item.basicSetting.id
                                ? styles.chosenSampleImg
                                : ''
                        }`}
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
                className={`${styles.rec} ${styles[item.type]} ${
                    chosenRec ? styles.recTransparent : ''
                }
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
                    <div className={styles.arrowText}>
                        {item.mmW ? item.width + 'px' : item.width + 'mm'}
                    </div>
                </div>
                <div
                    className={`${styles.arrowH} ${
                        chosenRec === item.type && item.type !== 'custom' ? styles.show : ''
                    }`}
                    style={{
                        width: item.width / 5 + 'px',
                    }}
                >
                    <div className={styles.arrowText}>
                        {item.mmW ? item.height + 'px' : item.height + 'mm'}
                    </div>
                </div>
            </div>
        );
    });
    const sizeOptions = canvasSizeOptions.map((item, index) => {
        return (
            <div
                key={index}
                className={`${styles.option} ${
                    chosenRec === item.type ? styles.chosenOptions : ''
                }`}
                onClick={() => sizeChoosingHandler(item.type)}
            >
                <div className={styles.title}> {item.name}</div>
                {item.type !== 'custom' ? (
                    <div className={styles.details}>
                        {item.mmW ? item.width + 'px' : item.width + 'mm'} x{' '}
                        {item.mmW ? item.height + 'px' : item.height + 'mm'}
                    </div>
                ) : (
                    <div className={styles.details}>? px x ? px</div>
                )}
            </div>
        );
    });

    return (
        <div className={styles.addNew}>
            <button className={styles.addButton}>
                <div className={styles.addIcon}></div>
                <div
                    className={styles.btnText}
                    onClick={() => {
                        if (Object.keys(props.currentUser).length === 0) {
                            alert('請先註冊或登入會員，新增畫布');
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
                                className={`${styles.step} ${
                                    currentStep === 1 ? styles.current : ''
                                } ${currentStep > 1 ? styles.chosen : ''}`}
                            >
                                <div
                                    className={`${styles.text} ${
                                        currentStep >= 1 ? styles.textShow : ''
                                    }`}
                                >
                                    step.1
                                </div>
                            </div>
                            <div
                                className={`${styles.step} ${
                                    currentStep === 2 ? styles.current : ''
                                }  ${currentStep > 2 ? styles.chosen : ''}`}
                            >
                                <div
                                    className={`${styles.text} ${
                                        currentStep >= 2 ? styles.textShow : ''
                                    }`}
                                >
                                    step.2
                                </div>
                            </div>
                            <div
                                className={`${styles.step}  ${
                                    currentStep === 3 ? styles.current : ''
                                }  ${currentStep > 3 ? styles.chosen : ''}`}
                            >
                                <div
                                    className={`${styles.text} ${
                                        currentStep >= 3 ? styles.textShow : ''
                                    }`}
                                >
                                    step.3
                                </div>
                            </div>
                        </div>
                        <div className={styles.stepTitle}>
                            {currentStep === 1
                                ? '選擇畫布尺寸'
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
                        ) : currentStep === 2 ? (
                            <div className={styles.stepContentWrapper}>
                                <div className={styles.optionsWrapper}>
                                    <div
                                        className={`${styles.option} ${
                                            choices.way === 'sample' || !choices.way
                                                ? null
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
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                >
                                    上一步
                                </div>
                            </div>
                        )}
                        {(currentStep === 1 && choices.type) ||
                        (currentStep === 2 &&
                            (choices.way === 'blank' ||
                                (choices.way === 'sample' && choices.sampleFileId))) ? (
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
                                <div className={`${styles.nextStep} ${styles.disableStep}`}>
                                    下一步
                                </div>
                            </div>
                        ) : currentStep === 3 ? (
                            <div className={styles.nextStepWrapper}>
                                <div className={styles.nextStep} onClick={handleCreateNew}>
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
    currentUser: PropTypes.object.isRequired,
    isAddingNew: PropTypes.bool.isRequired,
    setIsAddingNew: PropTypes.func.isRequired,
};

export default AddNew;
