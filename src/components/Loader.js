import React from 'react';
import styles from '../css/loader.module.scss';
import PropTypes from 'prop-types';

// export default App;
const Loader = (props) => {
    // render
    return (
        <div className={styles.loaderCover}>
            <div className={styles.loader}></div>
            <div className={styles.text}>LOADING</div>
        </div>
    );
};

Loader.propTypes = {};

export default Loader;
