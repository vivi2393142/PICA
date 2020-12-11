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

    React.useEffect(() => {
        if (props.match.params.fileId && props.currentUser.email) {
            firebase.getShot(props.match.params.fileId, props.currentUser.email, (dataArray) => {
                setCommentData(dataArray);
                setIsLoaded(false);
                setCurrentUserPhoto(dataArray.currentUser.userPhoto);
            });
        }
    }, []);

    const commentsJsx = commentData
        ? commentData.comments.map((comment, index) => {
              return (
                  <div className={styles.singleComment} key={index}>
                      <img
                          src={comment.userPhoto}
                          onClick={() => history.push(`../user/${comment.userId}`)}
                      />
                      <div className={styles.commentText}>
                          <div
                              className={styles.commentUser}
                              onClick={() => history.push(`../user/${comment.userId}`)}
                          >
                              {comment.userName}
                          </div>
                          <div className={styles.commentContent}>{comment.content}</div>
                      </div>
                  </div>
              );
          })
        : null;

    // render
    return (
        <div className={styles.shotsWrapper}>
            {isLoaded ? <Loader></Loader> : null}
            {commentData ? (
                <div className={styles.shots}>
                    <div className={styles.leftInfo}>
                        <img src={commentData.file.fileImg} className={styles.fileImg} />
                        <div>{commentData.file.fileName}</div>
                        <mainIcons.Like
                            className={`${styles.like} ${
                                commentData.currentUser.isLike ? styles.isLike : ''
                            }`}
                        />
                    </div>
                    <div className={styles.rightInfo}>
                        <div className={styles.userWrapper}>
                            <img src={commentData.file.userPhoto} />
                            <div className={styles.userName}>{commentData.file.userName}</div>
                        </div>
                        <div className={styles.commentWrapper}>
                            comments
                            {commentsJsx}
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
