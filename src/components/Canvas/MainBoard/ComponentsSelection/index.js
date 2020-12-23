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

    // render
    return (
        <div
            className={`componentsSelection ${
                props.currentSidebar !== '' && 'componentsSelectionUnfold'
            }`}
        >
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
