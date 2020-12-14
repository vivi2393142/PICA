import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as firebase from '../../firebase';
import { nanoid } from 'nanoid';
import Loader from '../Loader';
import { useHistory } from 'react-router-dom';
import * as mainIcons from '../../img/mainPage';

// export default App;
const Shots = (props) => {
    const [isLoaded, setIsLoaded] = React.useState(true);
    const [commentData, setCommentData] = React.useState(null);
    const [textInput, setTextInput] = React.useState('');
    const [currentUserPhoto, setCurrentUserPhoto] = React.useState('');
    let history = useHistory();
    const sendCommentHandler = () => {
        firebase.postComment(textInput, props.currentUser.email, props.match.params.fileId);
        const newComment = {
            content: textInput,
            userId: props.currentUser.email,
            userName: props.currentUser.displayName,
            userPhoto: currentUserPhoto,
        };
        let oldComments = [...commentData.comments];
        oldComments.push(newComment);
        setCommentData({ ...commentData, comments: oldComments });
        setTextInput('');
    };

    const deleteCommentHandler = (index) => {
        let oldComments = { ...commentData };
        oldComments.comments.splice(index, 1);
        setCommentData(oldComments);
        firebase.deleteComment(index, props.match.params.fileId);
    };

    const likeHandler = (oldIsLike) => {
        firebase.postLike(props.currentUser.email, props.match.params.fileId, oldIsLike);
        let oldComments = { ...commentData };
        oldComments.currentUser.isLike = !oldIsLike;
        setCommentData(oldComments);
    };

    React.useEffect(() => {
        if (props.match.params.fileId && props.currentUser.email) {
            firebase.getShot(props.match.params.fileId, props.currentUser.email, (dataArray) => {
                setCommentData(dataArray);
                setIsLoaded(false);
                setCurrentUserPhoto(dataArray.currentUser.userPhoto);
            });
        }
    }, []);

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
                            {comment.userId === props.currentUser.email ? (
                                <mainIcons.Delete
                                    className={styles.delete}
                                    onClick={(e) => deleteCommentHandler(index)}
                                />
                            ) : null}
                            <div
                                className={styles.commentUser}
                                onClick={() => history.push(`/main/user/${comment.userId}`)}
                            >
                                {comment.userName}
                            </div>
                            <div className={styles.commentContent}>{comment.content}</div>
                        </div>
                    </div>
                );
            })
        ) : null;

    // render
    return (
        <div className={styles.shotsWrapper}>
            {isLoaded ? <Loader></Loader> : null}
            {commentData ? (
                <div className={styles.shots}>
                    <div className={styles.back} onClick={() => history.goBack()}>{`< 返回`}</div>
                    <div className={styles.leftInfo}>
                        {/* <div className={styles.imgWrapper}> */}
                        <img src={commentData.file.fileImg} className={styles.fileImg} />
                        {/* </div> */}
                        <div className={styles.fileNameWrapper}>
                            {commentData.file.fileName}
                            <mainIcons.Like
                                className={`${styles.like} ${
                                    commentData.currentUser.isLike ? styles.isLike : ''
                                }`}
                                onClick={() => likeHandler(commentData.currentUser.isLike)}
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
                            <div className={styles.fileNumber}>
                                {commentData.file.fileNumber} files
                            </div>
                        </div>
                        <div className={styles.subTitle}>留言區</div>
                        <div className={styles.commentWrapper}>{commentsJsx}</div>
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
                    </div>
                </div>
            ) : null}
        </div>
    );
};

Shots.propTypes = {
    match: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
};

export default Shots;
