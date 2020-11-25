import React from 'react';
import ReactDOM from 'react-dom';
import './App.scss';
import PropTypes from 'prop-types';

const DrawingArea = () => {
    return <div className='drawingArea'>drawingArea</div>;
};

const MainBoard = (props) => {
    console.log(props.imageComponents);
    return (
        <div className='mainBoard'>
            {props.imageComponents[0].test}
            <DrawingArea />
        </div>
    );
};

MainBoard.propTypes = {
    // TODO: 待資料確定後，明確定義 array 內容
    imageComponents: PropTypes.array.isRequired,
};

function App() {
    // TODO: 測試用資料, 待更新
    let imageComponents = [{ test: 'testCom' }, {}];
    const [imgComponents, setImgComponents] = React.useState(imageComponents);

    return (
        <div className='App'>
            <MainBoard imageComponents={imageComponents} />
        </div>
    );
}

export default App;
