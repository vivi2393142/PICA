import React from 'react';
import styles from '../css/loader.module.scss';
import PropTypes from 'prop-types';

const Loader = (props) => {
    return (
        <div className={styles.loaderCover}>
            <div className={styles.loader}></div>
            <div className={styles.text}>{props.loaderText ? props.loaderText : 'LOADING'}</div>
        </div>
    );
};

Loader.propTypes = {
    loaderText: PropTypes.string,
};

export default React.memo(Loader);
