import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as firebase from '../../firebase';
import Loader from '../Loader';
import ExploreItem from './exploreItem';
import * as bannerIcons from '../../img/banner';

// export default App;
const Explore = (props) => {
    const [isLoaded, setIsLoaded] = React.useState(true);
    const [dataArray, setDataArray] = React.useState([]);
    const [filter, setFilter] = React.useState('all');
    // all, sample, nonSample
    const allType = ['Instagram', 'Poster', 'PostCard', 'Web', 'A4', 'NameCard', 'Custom'];

    React.useEffect(() => {
        firebase.getAllFiles(props.currentUser.email, (dataArray) => {
            setDataArray(dataArray);
            setIsLoaded(false);
        });
    }, []);

    const likeHandler = (e, item, type) => {
        e.stopPropagation();
        firebase.postLike(props.currentUser.email, item.fileId, item.isLike);
        let oldData = { ...dataArray };
        const index = dataArray[type].findIndex((x) => x.fileId === item.fileId);
        if (item.isLike) {
            oldData[type][index].like -= 1;
        } else {
            oldData[type][index].like += 1;
        }
        oldData[type][index].isLike = !item.isLike;
        setDataArray(oldData);
    };

    const allRowsJsx =
        dataArray.length === 0
            ? null
            : allType.map((type, index) => {
                  const sampleInner = dataArray[type].map((item, index) => {
                      if (item.isSample) {
                          return (
                              <ExploreItem
                                  key={index}
                                  item={item}
                                  type={type}
                                  likeHandler={likeHandler}
                              />
                          );
                      }
                  });
                  const nonSampleInner = dataArray[type].map((item, index) => {
                      if (!item.isSample) {
                          return (
                              <ExploreItem
                                  key={index}
                                  item={item}
                                  type={type}
                                  likeHandler={likeHandler}
                              />
                          );
                      }
                  });
                  return (
                      <div key={index} className={styles.rowWrapper}>
                          <div className={styles.rowTitle}>
                              <span className={styles.titleFirst}>{type.slice(0, 1)}</span>
                              {type.substr(1)}
                          </div>
                          <div className={styles.row}>
                              {filter === 'all' || filter === 'sample' ? sampleInner : null}
                              {filter === 'all' || filter === 'nonSample' ? nonSampleInner : null}
                          </div>
                      </div>
                  );
              });

    // render
    return (
        <div className={styles.explore}>
            <div className={styles.exploreBanner}>
                <div className={styles.title}>
                    還在尋找靈感？
                    <br />
                    不如探索畫布，一起激盪點子！
                    {/* <br /> */}
                </div>
                {/* <span>PICA為你準備了數十種範本讓你輕鬆開始一趟設計之旅</span> */}
                <bannerIcons.Draw className={styles.mainPic} />
            </div>
            {isLoaded ? <Loader></Loader> : null}
            <div className={styles.sidebarWrapper}>
                <div className={styles.sidebar}>
                    <div
                        className={`${styles.tag} ${filter === 'all' ? styles.currentTag : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        全部畫布
                    </div>
                    <div
                        className={`${styles.tag} ${filter === 'sample' ? styles.currentTag : ''}`}
                        onClick={() => setFilter('sample')}
                    >
                        僅限範本畫布
                    </div>
                    <div
                        className={`${styles.tag} ${
                            filter === 'nonSample' ? styles.currentTag : ''
                        }`}
                        onClick={() => setFilter('nonSample')}
                    >
                        僅限使用者畫布
                    </div>
                    {/* <div className={styles.tag}>Instagram</div>
                    <div className={styles.tag}>橫式海報</div>
                    <div className={styles.tag}>明信片</div>
                    <div className={`${styles.tag} ${styles.currentTag}`}>網頁常用</div>
                    <div className={styles.tag}>橫式A4</div>
                    <div className={styles.tag}>名片</div>
                    <div className={styles.tag}>自訂</div> */}
                </div>
            </div>
            <div className={styles.main}>{allRowsJsx}</div>
        </div>
    );
};

Explore.propTypes = {
    currentUser: PropTypes.object.isRequired,
};

export default Explore;
