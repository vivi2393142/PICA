import React from 'react';
import styles from '../../css/exploreItem.module.scss';
import PropTypes from 'prop-types';
import * as mainIcons from '../../img/mainPage';
import { useHistory } from 'react-router-dom';
import { nanoid } from 'nanoid';
import * as firebase from '../../firebase';

// export default App;
const ExploreItem = (props) => {
    let history = useHistory();
    const [likeListImageLoad, setLikeListImageLoad] = React.useState(0);
    const addNewSampleHandler = (e, sampleFileId) => {
        e.stopPropagation();
        notLoginAlert(() => {
            const id = nanoid();
            const canvasSetting = {
                id: id,
                userEmail: props.currentUser.email,
                title: '',
            };
            firebase.createSampleCanvas(canvasSetting, sampleFileId);
        }, '請先註冊或登入會員，以建立範本畫布');
    };
    const notLoginAlert = (successCallback, text) => {
        if (props.currentUser.email === 'noUser') {
            alert(text);
        } else {
            successCallback();
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
            <div className={styles.cover}>
                <img
                    className={styles.innerImg}
                    src={props.item.snapshot}
                    onLoad={() => {
                        if (props.parentNodeForClass !== 'explore') {
                            setLikeListImageLoad(likeListImageLoad + 1);
                            if (props.length === likeListImageLoad) {
                                props.setIsLikeLoader(false);
                                setLikeListImageLoad(0);
                            }
                        }
                    }}
                ></img>
                {props.item.isSample && <div className={styles.isSample}>範本</div>}
                <div className={styles.buttons}>
                    {props.item.isSample && (
                        <div className={styles.edit}>
                            <mainIcons.Edit
                                className={styles.buttonIcon}
                                onClick={(e) => addNewSampleHandler(e, props.item.fileId)}
                            />
                        </div>
                    )}
                    <div
                        className={`${styles.like} ${props.item.isLike ? styles.isLike : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            notLoginAlert((e) => {
                                props.likeHandler(e, props.item, props.type);
                            }, '請先註冊或登入會員，以收藏作品');
                        }}
                    >
                        <mainIcons.Like className={styles.buttonIcon} />
                    </div>
                </div>
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
};

export default ExploreItem;
