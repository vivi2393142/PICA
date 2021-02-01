import { useState, memo } from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import { trackOutSideClick } from '../../utils/globalUtils.js';
import * as firebase from '../../utils/firebase.js';

const TitleInput = (props) => {
    const [titleInput, setTitleInput] = useState(props.initialValue);
    const [isShowInput, setIsShowInput] = useState(false);
    const handleEdit = (e) => {
        if (props.isAuthor) {
            setIsShowInput(true);
            const currentNode = e.currentTarget;
            currentNode.firstChild.focus();
            trackOutSideClick(currentNode, () => {
                setIsShowInput(false);
                firebase.changeTitle(props.fileId, currentNode.firstElementChild.value);
            });
        } else {
            return;
        }
    };
    return (
        <div className={styles.titleWrapper} onClick={(e) => handleEdit(e)}>
            <input
                value={titleInput}
                onChange={(e) => {
                    setTitleInput(e.target.value);
                }}
                style={{
                    opacity: isShowInput ? 1 : 0,
                    zIndex: isShowInput ? 1 : -1,
                }}
            ></input>
            <div
                className={`${styles.fileTitle} ${props.isAuthor ? styles.fileTitleAuthor : ''}`}
                style={{
                    opacity: isShowInput ? 0 : 1,
                }}
            >
                {titleInput}
            </div>
        </div>
    );
};

TitleInput.propTypes = {
    initialValue: PropTypes.string.isRequired,
    fileId: PropTypes.string.isRequired,
    isAuthor: PropTypes.bool.isRequired,
};

export default memo(TitleInput);
