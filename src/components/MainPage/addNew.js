import React from 'react';
import styles from '../../css/addNew.module.scss';
import PropTypes from 'prop-types';

// export default App;
const AddNew = (props) => {
    return (
        <div className={styles.addNew}>
            <button className={styles.addButton}>
                <div className={styles.addIcon}></div>
                <div className={styles.btnText}>新增畫布</div>
            </button>
        </div>
    );
};

AddNew.propTypes = {};

export default AddNew;
