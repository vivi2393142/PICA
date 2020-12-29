import React from 'react';
import styles from '../css/alert.module.scss';
import PropTypes from 'prop-types';
import alertOuter from '../img/src/alert-outer.svg';
import alertInner from '../img/src/alert-inner.svg';
import * as firebase from '../utils/firebase';

export const defaultAlertSetting = {
    buttonNumber: 0,
    buttonOneFunction: () => {},
    buttonTwoFunction: () => {},
    buttonOneTitle: '',
    buttonTwoTitle: '',
    title: '',
    content: '',
};

export const Alert = (props) => {
    return (
        <div className={styles.alertCover}>
            <div className={styles.alertWrapper}>
                <div className={styles.imgWrapper}>
                    <img className={styles.imgOuter} src={alertOuter}></img>
                    <img className={styles.imgInner} src={alertInner}></img>
                </div>
                <div className={styles.title}>{props.title}</div>
                <div className={styles.content}>{props.content}</div>
                <div className={styles.buttonWrapper}>
                    <div className={styles.button} onClick={props.buttonOneFunction}>
                        {props.buttonOneTitle}
                    </div>
                    {props.buttonNumber === 2 && (
                        <div className={styles.button} onClick={props.buttonTwoFunction}>
                            {props.buttonTwoTitle}
                        </div>
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
    buttonOneTitle: PropTypes.string.isRequired,
    buttonTwoTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};
