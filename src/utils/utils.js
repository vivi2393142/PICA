const trackOutSideClick = (trackTargetNode, callback) => {
    const clickedOrNot = (e) => {
        if (!trackTargetNode.contains(e.target)) {
            callback();
            document.removeEventListener('click', clickedOrNot, true);
        }
    };
    document.addEventListener('click', clickedOrNot, true);
};

export { trackOutSideClick };
