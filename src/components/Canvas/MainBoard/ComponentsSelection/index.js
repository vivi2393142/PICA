import React from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import 'fabric-history';
import * as icons from '../../../../img/icons';
import NavRight from './NavRight';
import NavLeftText from './NavLeftText';
import NavLeftImg from './NavLeftImg';
import NavLeftShape from './NavLeftShape';
import NavLeftColor from './NavLeftColor';

const ComponentsSelection = (props) => {
    const allSettings = props.allSettings;
    const [croppingObj, setCroppingObj] = React.useState({});
    const [textIsEditing, setTextIsEditing] = React.useState(false);
    const [testColor, setTestColor] = React.useState('rgba(0,0,0,1)');

    if (Object.keys(allSettings.canvas).length !== 0) {
        const ctx = allSettings.canvas.getContext('2d');
        allSettings.canvas.on('mouse:down', (e) => {
            const mouse = allSettings.canvas.getPointer(e.e);
            var x = e.e.offsetX; //parseInt(mouse.x);
            var y = e.e.offsetY; //parseInt(mouse.y);
            // const x = parseInt(mouse.x);
            // const y = parseInt(mouse.y);

            // get the color array for the pixel under the mouse
            const px = ctx.getImageData(x, y, 1, 1).data;

            // report that pixel data
            setTestColor(`rgba(${px[0]},${px[1]},${px[2]},${px[3]})`);
            // console.log(`rgba(${px[0]},${px[1]},${px[2]},${px[3]})`);
        });
    }

    // render
    return (
        <div
            className={`componentsSelection ${
                props.currentSidebar !== '' && 'componentsSelectionUnfold'
            }`}
        >
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    background: testColor,
                    marginLeft: '2rem',
                    border: '1px solid rgba(0,0,0,1)',
                }}
            ></div>
            <div className='componentsNavLeft'>
                {(allSettings.activeObj.type === 'rect' ||
                    allSettings.activeObj.type === 'circle' ||
                    allSettings.activeObj.type === 'triangle' ||
                    allSettings.activeObj.type === 'path' ||
                    allSettings.activeObj.type === 'polygon') &&
                    allSettings.activeObj.specialType !== 'cropbox' && (
                        <NavLeftColor
                            canvas={allSettings.canvas}
                            activeObj={allSettings.activeObj}
                            trackOutSideClick={props.trackOutSideClick}
                            setIsFocusInput={props.setIsFocusInput}
                        />
                    )}
                {(allSettings.activeObj.type === 'image' || croppingObj !== {}) &&
                    allSettings.activeObj.specialType !== 'background' && (
                        <NavLeftImg
                            currentSidebar={props.currentSidebar}
                            setCurrentSidebar={props.setCurrentSidebar}
                            trackOutSideClick={props.trackOutSideClick}
                            croppingObj={croppingObj}
                            setCroppingObj={setCroppingObj}
                            allSettings={allSettings}
                        />
                    )}
                {allSettings.activeObj.type === 'i-text' && (
                    <NavLeftText
                        setTextIsEditing={setTextIsEditing}
                        canvas={allSettings.canvas}
                        activeObj={allSettings.activeObj}
                        trackOutSideClick={props.trackOutSideClick}
                    />
                )}
                {(allSettings.activeObj.type === 'rect' ||
                    allSettings.activeObj.type === 'circle' ||
                    allSettings.activeObj.type === 'triangle') &&
                    allSettings.activeObj.specialType !== 'cropbox' && (
                        <NavLeftShape
                            trackOutSideClick={props.trackOutSideClick}
                            canvas={allSettings.canvas}
                            activeObj={allSettings.activeObj}
                            setIsFocusInput={props.setIsFocusInput}
                        />
                    )}
            </div>
            <NavRight
                textIsEditing={textIsEditing}
                canvas={allSettings.canvas}
                canvasData={allSettings.canvasData}
                canvasSetting={allSettings.canvasSetting}
                activeObj={allSettings.activeObj}
                setActiveObj={allSettings.setActiveObj}
                trackOutSideClick={props.trackOutSideClick}
                isFocusInput={props.isFocusInput}
            />
        </div>
    );
};

ComponentsSelection.propTypes = {
    currentSidebar: PropTypes.string.isRequired,
    setCurrentSidebar: PropTypes.func.isRequired,
    trackOutSideClick: PropTypes.func.isRequired,
    allSettings: PropTypes.object.isRequired,
    isFocusInput: PropTypes.bool.isRequired,
    setIsFocusInput: PropTypes.func.isRequired,
};

export default ComponentsSelection;
