import React from 'react';
import styles from '../css/alert.module.scss';
import PropTypes from 'prop-types';
import alertIcon from '../img/src/alert.svg';
import * as firebase from '../firebase';
// export default App;
const Alert = (props) => {
    return (
        <div className={styles.alertCover}>
            <div className={styles.alertWrapper}>
                <img className={styles.logo} src={alertIcon}></img>
                <div className={styles.title}>{props.title}</div>
                <div className={styles.content}>{props.content}</div>
                <div className={styles.buttonWrapper}>
                    <div className={styles.button}>{props.buttonOneTitle}</div>
                    {props.buttonNumber === 2 && (
                        <div className={styles.button}>{props.buttonTwoTitle}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

Alert.propTypes = {
    buttonNumber: PropTypes.number.isRequired,
    buttonOneFunction: PropTypes.func.isRequired,
    buttonTwoFunction: PropTypes.func.isRequired,
    buttonOneTitle: PropTypes.func.isRequired,
    buttonTwoTitle: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};

export default Alert;
