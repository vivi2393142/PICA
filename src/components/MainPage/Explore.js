import { useState, useEffect, useRef, memo } from 'react';
import styles from '../../css/mainPage.module.scss';
import PropTypes from 'prop-types';
import * as firebase from '../../utils/firebase.js';
import Loader from '../Loader';
import ExploreItem from './ExploreItem';
import * as mainIcons from '../../img/mainPage';
import * as bannerIcons from '../../img/banner';
import { mediaQuerySize } from '../../utils/globalConfig.js';
import { isEmptyObj } from '../../utils/globalUtils.js';
import { useDispatch, useSelector } from 'react-redux';
import { updateUsers, updateFiles } from '../../redux/action';

const allType = ['Instagram', 'Poster', 'PostCard', 'Web', 'A4', 'NameCard', 'Custom'];
const filters = [
    { state: 'all', name: '全部畫布' },
    { state: 'sample', name: '僅限範本畫布' },
    { state: 'nonSample', name: '僅限使用者畫布' },
];
const arrowStateInit = {
    Instagram: 'left',
    Poster: 'left',
    PostCard: 'left',
    Web: 'left',
    A4: 'left',
    NameCard: 'left',
    Custom: 'left',
};
const getArrowShowingState = (hasArrow, dataObject, filter, currentWidth) => {
    const oldState = { ...hasArrow };
    allType.forEach((type) => {
        const filterAll = dataObject[type];
        const filterSample = filterAll.filter((item) => item.isSample);
        const filterNonSample = filterAll.filter((item) => !item.isSample);
        oldState[type] =
            filter === 'all'
                ? filterAll.length > currentWidth
                : filter === 'sample'
                ? filterSample.length > currentWidth
                : filterNonSample.length > currentWidth;
    });
    return oldState;
};

const Explore = (props) => {
    const scrollRef = useRef([]);
    const [isLoaded, setIsLoaded] = useState(true);
    const [isSmallLoaded, setIsSmallLoaded] = useState(true);
    const [dataObject, setDataObject] = useState({});
    const [filter, setFilter] = useState('all');
    const [currentWidth, setCurrentWidth] = useState(4);
    const [hasArrow, setHasArrow] = useState({
        Instagram: false,
        Poster: false,
        PostCard: false,
        Web: false,
        A4: false,
        NameCard: false,
        Custom: false,
    });
    const [arrowState, setArrowState] = useState(arrowStateInit);
    const dispatch = useDispatch();
    const storeData = useSelector((state) => state);

    useEffect(() => {
        setIsLoaded(false);
        props.setCurrentPage('explore');
    }, []);

    useEffect(() => {
        if (isEmptyObj(storeData.users)) {
            dispatch(updateUsers());
        } else if (isEmptyObj(storeData.files)) {
            dispatch(updateFiles());
        } else if (props.currentUser) {
            const exploreData = firebase.mapDataForExplore(
                props.currentUser.email,
                storeData.files,
                storeData.users
            );
            setDataObject(exploreData);
            setIsSmallLoaded(false);
        }
    }, [storeData, props.currentUser]);

    useEffect(() => {
        const setRowItemsWidth = () => {
            window.innerWidth > mediaQuerySize.big
                ? setCurrentWidth(4)
                : window.innerWidth > mediaQuerySize.medium
                ? setCurrentWidth(3)
                : setCurrentWidth(2);
        };
        setRowItemsWidth();
        window.addEventListener('resize', setRowItemsWidth);
    }, [props.currentUser]);

    useEffect(() => {
        if (!isEmptyObj(dataObject)) {
            const newArrowState = getArrowShowingState(hasArrow, dataObject, filter, currentWidth);
            setHasArrow(newArrowState);
        }
    }, [dataObject, currentWidth, filter]);

    const swipeHandler = (direction, index) => {
        const currentRef = scrollRef.current[index];
        direction === 'left'
            ? (currentRef.scrollLeft -= currentRef.clientWidth)
            : (currentRef.scrollLeft += currentRef.clientWidth);
    };
    const listenScroll = (e, type) => {
        const scrollRight = e.target.scrollWidth - e.target.clientWidth - e.target.scrollLeft;
        const oldState = { ...arrowState };
        e.target.scrollLeft !== 0 && scrollRight > 1
            ? (oldState[type] = '')
            : scrollRight <= 1
            ? (oldState[type] = 'right')
            : e.target.scrollLeft === 0
            ? (oldState[type] = 'left')
            : null;
        setArrowState(oldState);
    };
    const likeHandler = (e, item, type) => {
        firebase.postLike(props.currentUser.email, item.fileId, item.isLike);
        const oldData = { ...dataObject };
        const index = dataObject[type].findIndex((x) => x.fileId === item.fileId);
        item.isLike ? (oldData[type][index].like -= 1) : (oldData[type][index].like += 1);
        oldData[type][index].isLike = !item.isLike;
        setDataObject(oldData);
    };
    const scrollButtonHandler = (filterName) => {
        setFilter(filterName);
        setArrowState({ ...arrowStateInit });
        scrollRef.current.forEach((ref) => (ref.scrollLeft = 0));
    };

    const allRowsJsx =
        Object.keys(dataObject).length !== 0 &&
        allType.map((type, index) => {
            const sampleInner = dataObject[type].map((item) => {
                if (item.isSample) {
                    return (
                        <ExploreItem
                            key={item.fileId}
                            item={item}
                            type={type}
                            likeHandler={likeHandler}
                            currentUser={props.currentUser}
                            parentNodeForClass={'explore'}
                        />
                    );
                }
            });
            const nonSampleInner = dataObject[type].map((item) => {
                if (!item.isSample) {
                    return (
                        <ExploreItem
                            key={item.fileId}
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
                <div key={type} className={styles.rowWrapper}>
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
                    </div>
                    {arrowState[type] !== 'left' && hasArrow[type] && (
                        <mainIcons.ArrowR
                            className={`${styles.buttonSvg} ${styles.buttonR}`}
                            onClick={() => swipeHandler('left', index)}
                        />
                    )}
                    {arrowState[type] !== 'right' && hasArrow[type] && (
                        <mainIcons.ArrowL
                            className={`${styles.buttonSvg} ${styles.buttonL}`}
                            onClick={() => swipeHandler('right', index)}
                        />
                    )}
                </div>
            );
        });
    const filtersJsx = filters.map((item, index) => (
        <div
            key={item.state}
            className={`${styles.tag} ${filter === item.state ? styles.currentTag : ''}`}
            onClick={() => {
                scrollButtonHandler(item.state);
            }}
        >
            {item.name}
        </div>
    ));

    return (
        <div className={styles.explore}>
            <div className={styles.exploreBanner}>
                <div className={styles.title}>
                    還在尋找靈感？
                    <br />
                    不如探索畫布，一起激盪點子！
                </div>
                <bannerIcons.Draw className={styles.mainPic} />
            </div>
            {isLoaded && <Loader></Loader>}
            <div className={styles.filtersWrapper}>
                <div className={styles.filters}>{filtersJsx}</div>
            </div>
            {isSmallLoaded && (
                <div className={`${styles.smallLoaderLike} ${styles.mainPageSmallLoader}`}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            )}
            <div className={styles.main}>{allRowsJsx}</div>
        </div>
    );
};

Explore.propTypes = {
    currentUser: PropTypes.object,
    setCurrentPage: PropTypes.func.isRequired,
};

export default memo(Explore);
