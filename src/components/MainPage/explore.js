import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as firebase from '../../firebase';
import { nanoid } from 'nanoid';
import Loader from '../Loader';
import MainBanner from './mainBanner';
import * as mainIcons from '../../img/mainPage';

// export default App;
const Explore = (props) => {
    const [dataArray, setDataArray] = React.useState([]);

    React.useEffect(() => {
        firebase.getAllFiles((dataArray) => {
            setDataArray(dataArray);
        });
    }, []);

    console.log('render');

    const rowPosterJsx =
        dataArray.length === 0
            ? null
            : dataArray.poster.map((item, index) => {
                  return (
                      <div className={styles.fileWrapper} key={index}>
                          <img className={styles.innerImg} src={item.snapshot}></img>
                          <div className={styles.info}>
                              <img className={styles.userPhoto} src={item.userPhoto}></img>
                              <div className={styles.author}>{item.userName}</div>
                              <mainIcons.Like className={styles.infoIcon} />
                              <div className={styles.like}>{item.like}</div>
                              <mainIcons.Comment className={styles.infoIcon} />
                              <div className={styles.messages}>{item.comment}</div>
                          </div>
                      </div>
                  );
              });

    const rowInstagramJsx =
        dataArray.length === 0
            ? null
            : dataArray.instagram.map((item, index) => {
                  return (
                      <div className={styles.fileWrapper} key={index}>
                          <img className={styles.innerImg} src={item.snapshot}></img>
                          <div className={styles.info}>
                              <img className={styles.userPhoto} src={item.userPhoto}></img>
                              <div className={styles.author}>{item.userName}</div>
                              <mainIcons.Like className={styles.infoIcon} />
                              <div className={styles.like}>{item.like}</div>
                              <mainIcons.Comment className={styles.infoIcon} />
                              <div className={styles.messages}>{item.comment}</div>
                          </div>
                      </div>
                  );
              });

    // render
    return (
        <div className={styles.explore}>
            <div className={styles.sidebarWrapper}>
                <div className={styles.sidebar}>
                    <div className={styles.tag}>Instagram</div>
                    <div className={styles.tag}>橫式海報</div>
                    <div className={styles.tag}>明信片</div>
                    <div className={`${styles.tag} ${styles.currentTag}`}>網頁常用</div>
                    <div className={styles.tag}>橫式A4</div>
                    <div className={styles.tag}>名片</div>
                    <div className={styles.tag}>自訂</div>
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.row}>{rowInstagramJsx}</div>
                <div className={styles.row}>{rowPosterJsx}</div>
                <div className={styles.row}>row3</div>
            </div>
        </div>
    );
};

Explore.propTypes = {};

export default React.memo(Explore);
