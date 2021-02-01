import { useState, memo } from 'react';
import styles from '../../css/exploreItem.module.scss';
import PropTypes from 'prop-types';
import * as mainIcons from '../../img/mainPage';
import { useHistory } from 'react-router-dom';
import { nanoid } from 'nanoid';
import * as firebase from '../../utils/firebase.js';
import { Alert, defaultAlertSetting } from '../Alert';

const ExploreItem = (props) => {
    const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
    const [alertSetting, setAlertSetting] = useState({
        ...defaultAlertSetting,
    });
    const addNewSampleHandler = (e, sampleFileId) => {
        e.stopPropagation();
        if (props.currentUser.email === 'noUser') {
            const buttonCallback = () => {
                e.stopPropagation();
                setShowAlert(false);
            };
            setAlertSetting({
                buttonNumber: 1,
                buttonOneFunction: buttonCallback,
                buttonTwoFunction: () => {},
                buttonOneTitle: '關閉',
                buttonTwoTitle: '',
                title: '未登入會員',
                content: '請先註冊或登入會員，以建立範本畫布',
            });
            setShowAlert(true);
        } else {
            const canvasSetting = {
                id: nanoid(),
                userEmail: props.currentUser.email,
                title: '',
            };
            firebase.createSampleCanvas(canvasSetting, sampleFileId);
        }
    };

    return (
        <div
            className={`${
                props.parentNodeForClass === 'explore'
                    ? styles.exploreFileWrapper
                    : styles.userFileWrapper
            }`}
            onClick={() => history.push(`/main/shots/${props.item.fileId}`)}
            style={{
                animationDelay:
                    !props.isLikeLoader &&
                    props.parentNodeForClass !== 'explore' &&
                    `${props.index * 0.05}s`,
            }}
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
            <div className={styles.cover}>
                <img className={styles.innerImg} src={props.item.snapshot} loading='lazy'></img>
                {props.item.isSample && <div className={styles.isSample}>範本</div>}
                {props.isNotSameAsCurrentUser ? null : (
                    <div className={styles.buttons}>
                        {props.item.isSample && (
                            <div className={styles.edit}>
                                <mainIcons.Edit
                                    className={styles.buttonIcon}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addNewSampleHandler(e, props.item.fileId);
                                    }}
                                />
                            </div>
                        )}

                        <div
                            className={`${styles.like} ${props.item.isLike ? styles.isLike : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (props.currentUser.email === 'noUser') {
                                    setAlertSetting({
                                        buttonNumber: 1,
                                        buttonOneFunction: () => {
                                            setShowAlert(false);
                                        },
                                        buttonTwoFunction: () => {},
                                        buttonOneTitle: '關閉',
                                        buttonTwoTitle: '',
                                        title: '未登入會員',
                                        content: '請先註冊或登入會員，以收藏作品',
                                    });
                                    setShowAlert(true);
                                } else {
                                    props.likeHandler(e, props.item, props.type);
                                }
                            }}
                        >
                            <mainIcons.Like className={styles.buttonIcon} />
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.info}>
                <img className={styles.userPhoto} src={props.item.userPhoto}></img>
                <div className={styles.author}>{props.item.userName}</div>
                <mainIcons.Like
                    className={`${styles.infoIcon} ${props.item.isLike ? styles.isLike : ''}`}
                />
                <div className={styles.like}>{props.item.like}</div>
                <mainIcons.Comment className={styles.infoIcon} />
                <div className={styles.messages}>{props.item.comment}</div>
            </div>
        </div>
    );
};

ExploreItem.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number,
    type: PropTypes.string,
    likeHandler: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    parentNodeForClass: PropTypes.string,
    isLikeLoader: PropTypes.bool,
    setIsLikeLoader: PropTypes.func,
    length: PropTypes.number,
    isNotSameAsCurrentUser: PropTypes.bool,
};

export default memo(ExploreItem);
