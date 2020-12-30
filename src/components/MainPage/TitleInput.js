import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import { trackOutSideClick } from '../../utils/globalUtils.js';
import * as firebase from '../../utils/firebase.js';

const TitleInput = (props) => {
    const [titleInput, setTitleInput] = React.useState(props.initialValue);
    const [isShowInput, setIsShowInput] = React.useState(false);
    const handleEdit = (e) => {
        setIsShowInput(true);
        const currentNode = e.currentTarget;
        currentNode.firstChild.focus();
        trackOutSideClick(currentNode, () => {
            setIsShowInput(false);
            firebase.changeTitle(props.fileId, currentNode.firstElementChild.value);
        });
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
                className={styles.fileTitle}
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
};

export default React.memo(TitleInput);
