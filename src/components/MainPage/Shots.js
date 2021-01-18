import { useState, useEffect, memo } from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as firebase from '../../utils/firebase.js';
import Loader from '../Loader';
import { useHistory } from 'react-router-dom';
import * as mainIcons from '../../img/mainPage';
import { Alert, defaultAlertSetting } from '../Alert';

const countDateDiff = (timeStamp) => {
    const current = new Date();
    const previous = timeStamp.toDate();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;
    const elapsed = current - previous;
    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + '秒';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + '分鐘';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + '小時';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + '天';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + '月';
    } else {
        return Math.round(elapsed / msPerYear) + '年';
    }
};

const Shots = (props) => {
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(true);
    const [commentData, setCommentData] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertSetting, setAlertSetting] = useState({
        ...defaultAlertSetting,
    });

    useEffect(() => {
        // track comment
        if (props.currentUser.email && props.currentUser.email !== 'noUser') {
            firebase.listenToComment(props.match.params.fileId, () => {
                firebase.getShot(props.match.params.fileId, props.currentUser.email, (dataArray) => {
                    setCommentData(dataArray);
                });
            });
        }
        // data initialize
        props.setCurrentPage('explore');
        if (props.match.params.fileId && props.currentUser) {
            firebase.getShot(props.match.params.fileId, props.currentUser.email, (dataArray) => {
                setCommentData(dataArray);
                setIsLoaded(false);
            });
        }
    }, [props.currentUser]);

    const sendCommentHandler = () => {
        firebase.postComment(textInput, props.currentUser.email, props.match.params.fileId);
        setTextInput('');
    };
    const likeHandler = (oldIsLike) => {
        firebase.postLike(props.currentUser.email, props.match.params.fileId, oldIsLike);
        const oldComments = { ...commentData };
        oldComments.currentUser.isLike = !oldIsLike;
        setCommentData(oldComments);
    };

    const commentsJsx =
        commentData && commentData.comments.length === 0 ? (
            <div className={styles.noComment}>目前尚無留言</div>
        ) : commentData ? (
            commentData.comments.map((comment, index) => {
                return (
                    <div className={styles.singleComment} key={index}>
                        <img
                            src={comment.userPhoto}
                            onClick={() => history.push(`/main/user/${comment.userId}`)}
                        />
                        <div className={styles.commentText}>
                            {comment.userId === props.currentUser.email && (
                                <mainIcons.Delete
                                    className={styles.delete}
                                    onClick={(e) => firebase.deleteComment(index, props.match.params.fileId)}
                                />
                            )}
                            <div
                                className={styles.commentUser}
                                onClick={() => history.push(`/main/user/${comment.userId}`)}
                            >
                                {comment.userId === props.currentUser.email ? '我自己' : comment.userName}
                                <span>{countDateDiff(comment.timestamp)}</span>
                            </div>
                            <div className={styles.commentContent}>{comment.content}</div>
                        </div>
                    </div>
                );
            })
        ) : null;

    return (
        <div className={styles.shotsWrapper}>
            {isLoaded && <Loader></Loader>}
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
            {commentData && (
                <div className={styles.shots}>
                    <div className={styles.back} onClick={() => history.goBack()}>{`< 返回`}</div>
                    <div className={styles.leftInfo}>
                        <img src={commentData.file.fileImg} className={styles.fileImg} />
                        <div className={styles.fileNameWrapper}>
                            {commentData.file.fileName}
                            <mainIcons.Like
                                className={`${styles.like} ${
                                    commentData.currentUser.isLike ? styles.isLike : ''
                                }`}
                                onClick={() => {
                                    if (props.currentUser.email === 'noUser') {
                                        setAlertSetting({
                                            buttonNumber: 1,
                                            buttonOneFunction: () => setShowAlert(false),
                                            buttonTwoFunction: () => {},
                                            buttonOneTitle: '關閉',
                                            buttonTwoTitle: '',
                                            title: '未登入會員',
                                            content: '請先註冊或登入會員，以收藏作品',
                                        });
                                        setShowAlert(true);
                                    } else {
                                        likeHandler(commentData.currentUser.isLike);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className={styles.rightInfo}>
                        <div className={styles.subTitle}>作者資訊</div>
                        <div
                            className={styles.userWrapper}
                            onClick={() => history.push(`/main/user/${commentData.file.userId}`)}
                        >
                            <img src={commentData.file.userPhoto} className={styles.authorImg} />
                            <div className={styles.userName}>{commentData.file.userName}</div>
                            <div className={styles.fileNumber}>{commentData.file.fileNumber} files</div>
                        </div>
                        <div className={styles.subTitle}>留言區</div>
                        <div className={styles.commentWrapper}>{commentsJsx}</div>
                        {props.currentUser.email === 'noUser' ? (
                            <div className={styles.myComment}>
                                <div className={styles.notSignIn}>請註冊或登入以進行留言</div>
                            </div>
                        ) : (
                            <div className={styles.myComment}>
                                <img src={commentData.currentUser.userPhoto} />
                                <textarea
                                    className={styles.commentText}
                                    placeholder='輸入留言'
                                    value={textInput}
                                    onChange={(e) => {
                                        setTextInput(e.target.value);
                                    }}
                                ></textarea>
                                <div className={styles.submit} onClick={sendCommentHandler}>
                                    送出
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

Shots.propTypes = {
    match: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    setCurrentPage: PropTypes.func.isRequired,
};

export default memo(Shots);
