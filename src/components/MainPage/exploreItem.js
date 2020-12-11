import React from 'react';
import styles from '../../css/exploreItem.module.scss';
import PropTypes from 'prop-types';
import * as mainIcons from '../../img/mainPage';
import { useHistory } from 'react-router-dom';

// export default App;
const ExploreItem = (props) => {
    let history = useHistory();

    return (
        <div
            className={styles.fileWrapper}
            onClick={() => history.push(`/main/shots/${props.item.fileId}`)}
        >
            <div className={styles.cover}>
                <img className={styles.innerImg} src={props.item.snapshot}></img>
                {props.item.isSample ? <div className={styles.isSample}>範本</div> : null}
                <div className={styles.buttons}>
                    {props.item.isSample ? (
                        <div className={styles.edit}>
                            <mainIcons.Edit className={styles.buttonIcon} />
                        </div>
                    ) : null}
                    <div
                        className={`${styles.like} ${props.item.isLike ? styles.isLike : ''}`}
                        onClick={(e) => props.likeHandler(e, props.item, type)}
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
    likeHandler: PropTypes.func.isRequired,
};

export default ExploreItem;
