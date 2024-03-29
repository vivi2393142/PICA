import { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import * as bannerIcons from '../../../img/banner';
import { trackOutSideClick } from '../../../utils/globalUtils.js';

const Share = (props) => {
    const inputRef = useRef(null);
    const [isChoosingShare, setIsChoosingShare] = useState(false);
    const copyLinkHandler = (e) => {
        inputRef.current.select();
        document.execCommand('copy');
        document.getSelection().removeAllRanges();
        e.target.classList.add('copyComplete');
    };
    const toggleShare = (e) => {
        setIsChoosingShare(true);
        const targetContainer = e.currentTarget.parentNode;
        trackOutSideClick(targetContainer, () => {
            setIsChoosingShare(false);
            if (e.target.classList.contains('copyComplete')) {
                e.target.classList.remove('copyComplete');
            }
        });
    };

    return (
        <div className='shareIconWrapper'>
            <bannerIcons.Share className='bannerIcons' onClick={toggleShare} />
            {isChoosingShare && (
                <div className='shareWrapper'>
                    <div className='mainTitle'>分享我的作品</div>
                    <input
                        readOnly
                        value={`${window.location.origin}/main/shots/${props.fileId}`}
                        ref={inputRef}
                    ></input>
                    <div className='hint'>任何人可以透過此連結檢視作品簡介</div>
                    <div className='copy' onClick={copyLinkHandler}></div>
                </div>
            )}
        </div>
    );
};

Share.propTypes = { fileId: PropTypes.string.isRequired };

export default memo(Share);
