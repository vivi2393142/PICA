import React from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as firebase from '../../firebase';
import Loader from '../Loader';
import ExploreItem from './exploreItem';
import * as mainIcons from '../../img/mainPage';
import * as bannerIcons from '../../img/banner';

// export default App;
const Explore = (props) => {
    const [isLoaded, setIsLoaded] = React.useState(true);
    const [dataArray, setDataArray] = React.useState([]);
    const [filter, setFilter] = React.useState('all');
    const [arrowState, setArrowState] = React.useState({
        Instagram: 'left',
        Poster: 'left',
        PostCard: 'left',
        Web: 'left',
        A4: 'left',
        NameCard: 'left',
        Custom: 'left',
    });
    // all, sample, nonSample
    const allType = ['Instagram', 'Poster', 'PostCard', 'Web', 'A4', 'NameCard', 'Custom'];
    const scrollRef = React.useRef([]);

    React.useEffect(() => {
        props.setCurrentPage('explore');
        firebase.getAllFiles(props.currentUser.email, (dataArray) => {
            setDataArray(dataArray);
            setIsLoaded(false);
        });
        return () => {};
    }, []);

    const listenScroll = (e, type) => {
        const scrollRight = e.target.scrollWidth - e.target.clientWidth - e.target.scrollLeft;
        let oldState = { ...arrowState };
        if (e.target.scrollLeft !== 0 && scrollRight > 1) {
            oldState[type] = '';
            setArrowState(oldState);
        } else if (scrollRight <= 1) {
            oldState[type] = 'right';
            setArrowState(oldState);
        } else if (e.target.scrollLeft === 0) {
            oldState[type] = 'left';
            setArrowState(oldState);
        }
    };
    const swipeHandler = (direction, index) => {
        if (direction === 'left') {
            scrollRef.current[index].scrollLeft -= scrollRef.current[index].clientWidth;
        } else {
            scrollRef.current[index].scrollLeft += scrollRef.current[index].clientWidth;
        }
    };
    const likeHandler = (e, item, type) => {
        // e.stopPropagation();
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
        dataArray.length !== 0 &&
        allType.map((type, index) => {
            const sampleInner = dataArray[type].map((item, index) => {
                if (item.isSample) {
                    return (
                        <ExploreItem
                            key={index}
                            item={item}
                            type={type}
                            likeHandler={likeHandler}
                            currentUser={props.currentUser}
                            parentNodeForClass={'explore'}
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
                            currentUser={props.currentUser}
                            parentNodeForClass={'explore'}
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
                    <div
                        className={styles.row}
                        onScroll={(e) => listenScroll(e, type)}
                        ref={(el) => (scrollRef.current[index] = el)}
                    >
                        {(filter === 'all' || filter === 'sample') && sampleInner}
                        {(filter === 'all' || filter === 'nonSample') && nonSampleInner}
                        <div style={{ paddingRight: '2rem' }}></div>
                    </div>
                    {arrowState[type] !== 'left' && (
                        <mainIcons.ArrowR
                            className={`${styles.buttonSvg} ${styles.buttonR}`}
                            onClick={() => swipeHandler('left', index)}
                        />
                    )}
                    {arrowState[type] !== 'right' && (
                        <mainIcons.ArrowL
                            className={`${styles.buttonSvg} ${styles.buttonL}`}
                            onClick={() => swipeHandler('right', index)}
                        />
                    )}
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
            {isLoaded && <Loader></Loader>}
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
                </div>
            </div>
            <div className={styles.main}>{allRowsJsx}</div>
        </div>
    );
};

Explore.propTypes = {
    currentUser: PropTypes.object,
    setCurrentPage: PropTypes.func.isRequired,
};

export default Explore;
