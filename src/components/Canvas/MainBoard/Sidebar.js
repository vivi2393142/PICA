import React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';
import * as icons from '../../../img/icons';
import * as firebase from '../../../firebase';
import shape1 from '../../../img/src/sidebarItems/shape1.svg';
import shape2 from '../../../img/src/sidebarItems/shape2.svg';
import shape3 from '../../../img/src/sidebarItems/shape3.svg';
import line1 from '../../../img/src/sidebarItems/line1.svg';
import line2 from '../../../img/src/sidebarItems/line2.svg';
import line3 from '../../../img/src/sidebarItems/line3.svg';
import line4 from '../../../img/src/sidebarItems/line4.svg';
import line5 from '../../../img/src/sidebarItems/line5.svg';
import line6 from '../../../img/src/sidebarItems/line6.svg';
import square from '../../../img/src/sidebarItems/square.svg';
import triangle from '../../../img/src/sidebarItems/triangle.svg';
import circle from '../../../img/src/sidebarItems/circle.svg';

const Sidebar = (props) => {
    const allSettings = props.allSettings;
    // console.log(allSettings.uploadedFiles);
    const mainColor = '#e89a4f';
    const [nextAddPosition, setNextAddPosition] = React.useState({ top: 10, left: 10 });
    const [uploadProgressValue, setUploadProgressValue] = React.useState(0);
    const [sampleList, setSampleList] = React.useState([]);

    // set next add in component position
    const adjSetNextPosition = () => {
        if (
            nextAddPosition.left + 80 > allSettings.canvasSetting.width / 2 ||
            nextAddPosition.top + 80 > allSettings.canvasSetting.height / 2
        ) {
            setNextAddPosition({ top: 10, left: 10 });
        } else {
            setNextAddPosition({ top: nextAddPosition.top + 10, left: nextAddPosition.left + 10 });
        }
    };
    // add new components: rectangle, circle, triangle, text, image, background
    const addRect = () => {
        const shapeRatio = allSettings.canvas.width / 600;
        const rect = new fabric.Rect({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            height: 100 * shapeRatio,
            width: 100 * shapeRatio,
            fill: mainColor,
        });
        allSettings.canvas.add(rect);
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addCircle = () => {
        const shapeRatio = allSettings.canvas.width / 600;
        const circle = new fabric.Circle({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            radius: 50 * shapeRatio,
            fill: mainColor,
        });
        allSettings.canvas.add(circle);
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addTriangle = () => {
        const shapeRatio = allSettings.canvas.width / 600;
        const triangle = new fabric.Triangle({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            width: 100 * shapeRatio,
            height: 100 * shapeRatio,
            fill: mainColor,
        });
        allSettings.canvas.add(triangle);
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addShape = (e) => {
        const shapeRatio = allSettings.canvas.width / 600;
        fabric.loadSVGFromURL(e.target.src, (objects, options) => {
            const newShape = fabric.util.groupSVGElements(objects, options);
            newShape.set({
                top: nextAddPosition.top,
                left: nextAddPosition.left,
                scaleX: 2.2 * shapeRatio,
                scaleY: 2.2 * shapeRatio,
            });
            // newShape.toObject = (function (toObject) {
            //     return function (propertiesToInclude) {
            //         return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
            //             specialType: 'shape', //my custom property
            //         });
            //     };
            // })(newShape.toObject);
            allSettings.canvas.add(newShape);
            allSettings.canvas.requestRenderAll();
            adjSetNextPosition();
        });
    };
    const addIText = (title, size, weight) => {
        const textRatio = allSettings.canvas.width / 600;
        let text = new fabric.IText(title, {});
        text.set({
            top: nextAddPosition.top,
            left: nextAddPosition.left,
            fill: '#555555',
            fontSize: size * textRatio,
            fontFamily: 'Sans-serif',
            fontWeight: weight,
        });
        allSettings.canvas.add(text);
        text.setControlsVisibility({
            mb: false,
            mt: false,
            ml: false,
            mr: false,
        });
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addImage = (e) => {
        const scaleRatio = Math.max(
            allSettings.canvas.width / 4 / e.target.naturalWidth,
            allSettings.canvas.height / 4 / e.target.naturalHeight
        );
        fabric.Image.fromURL(
            e.target.src,
            (img) => {
                const oImg = img.set({
                    top: nextAddPosition.top,
                    left: nextAddPosition.left,
                    scaleX: scaleRatio,
                    scaleY: scaleRatio,
                });
                allSettings.canvas.add(oImg);
                oImg.setControlsVisibility({
                    mb: false,
                    mt: false,
                    ml: false,
                    mr: false,
                });
            },
            {
                crossOrigin: 'anonymous',
            }
        );
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const addSticker = (e) => {
        const scaleRatio = Math.max(
            allSettings.canvas.width / 4 / e.target.naturalWidth,
            allSettings.canvas.height / 4 / e.target.naturalHeight
        );
        fabric.Image.fromURL(
            e.target.src,
            (img) => {
                const oImg = img.set({
                    top: nextAddPosition.top,
                    left: nextAddPosition.left,
                    scaleX: scaleRatio,
                    scaleY: scaleRatio,
                });
                oImg.toObject = (function (toObject) {
                    return function (propertiesToInclude) {
                        return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
                            specialType: 'sticker', //my custom property
                        });
                    };
                })(oImg.toObject);
                allSettings.canvas.add(oImg);
                oImg.setControlsVisibility({
                    mb: false,
                    mt: false,
                    ml: false,
                    mr: false,
                });
            },
            {
                crossOrigin: 'anonymous',
            }
        );
        allSettings.canvas.requestRenderAll();
        adjSetNextPosition();
    };
    const backgroundColorHandler = (color) => {
        allSettings.canvas.backgroundImage = 0;
        allSettings.canvas.backgroundColor = color;
        allSettings.canvas.requestRenderAll();
    };
    const backgroundImageHandler = (e) => {
        allSettings.canvas.offHistory();
        // remove exist background
        if (allSettings.canvas.getObjects().length > 0) {
            if (allSettings.canvas.getObjects()[0].specialType === 'background') {
                allSettings.canvas.remove(allSettings.canvas.getObjects()[0]);
            }
        }
        const scaleToWidth = allSettings.canvasSetting.width / e.target.naturalWidth;
        const scaleToHeight = allSettings.canvasSetting.height / e.target.naturalHeight;
        const scaleWay = scaleToWidth > scaleToHeight ? 'toWidth' : 'toHeight';
        allSettings.canvas.onHistory();
        fabric.Image.fromURL(
            e.target.src,
            (img) => {
                const backImg = img.set({
                    // fit canvas
                    scaleX: scaleWay === 'toWidth' ? scaleToWidth : scaleToHeight,
                    scaleY: scaleWay === 'toWidth' ? scaleToWidth : scaleToHeight,
                });
                allSettings.presetBackgroundImg(
                    backImg,
                    allSettings.canvas,
                    allSettings.canvasSetting,
                    scaleWay,
                    scaleToWidth,
                    scaleToHeight
                );
            },
            {
                crossOrigin: 'anonymous',
            }
        );
    };

    // uploaded function
    const handleUploadImage = (e) => {
        if (e.target.files[0].size > 5242880) {
            alert('請勿上傳超過5mb之圖片');
        } else {
            firebase.uploadToStorage(
                e,
                props.fileId,
                (uploadValue) => setUploadProgressValue(uploadValue),
                () => setUploadProgressValue(0)
            );
        }
    };
    const uploadedImgJsx = allSettings.uploadedFiles
        ? allSettings.uploadedFiles.map((item, index) => {
              return (
                  <div
                      key={index}
                      className='unfoldItemImgWrapper unfoldItemGalleryWrapper'
                      onMouseDown={(e) => allSettings.saveDragItem.func(e)}
                  >
                      <div>
                          <img
                              className='unfoldItemImg unfoldItemGallery'
                              onClick={addImage}
                              draggable='true'
                              src={item.src}
                          ></img>
                      </div>
                      <div
                          className='close'
                          id={item.path}
                          onClick={(e) => firebase.removeUploadImg(e, props.fileId)}
                      >
                          x
                      </div>
                  </div>
              );
          })
        : null;

    // backgroundColor
    const [isChoosingBackColor, setIsChoosingBackColor] = React.useState(false);
    const [backColorChosen, setBackColorChosen] = React.useState({
        background: {
            r: '255',
            g: '255',
            b: '255',
            a: '1',
        },
    });
    const toggleAddBackColor = () => {
        if (allSettings.hasBackColor) {
            document.querySelector('.colorChartWrapper').classList.remove('colorChartUnfold');
            document.querySelector('.colorChartWrapper').classList.add('colorChartFold');
            backgroundColorHandler('rgba(255, 255, 255, 1)');
            setBackColorChosen({
                background: 'rgba(255, 255, 255, 1)',
            });
            allSettings.canvas.fire('object:modified');
        } else {
            // remove exist background
            if (
                allSettings.canvas.getObjects()[0] &&
                allSettings.canvas.getObjects()[0].specialType === 'background'
            ) {
                allSettings.canvas.remove(allSettings.canvas.getObjects()[0]);
            }
            document.querySelector('.colorChartWrapper').classList.add('colorChartUnfold');
            document.querySelector('.colorChartWrapper').classList.remove('colorChartFold');
        }
        allSettings.setHasBackColor(!allSettings.hasBackColor);
    };
    const toggleBackColorSelection = (e) => {
        const clickedOrNot = (e) => {
            if (!document.querySelector('.backgroundPicker').contains(e.target)) {
                setIsChoosingBackColor(false);
                allSettings.canvas.fire('object:modified');
                document.removeEventListener('click', clickedOrNot, true);
            }
        };
        document.addEventListener('click', clickedOrNot, true);
        setIsChoosingBackColor(true);
    };
    const handleBackColorChange = (color) => {
        const colorRgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
        setBackColorChosen({ background: colorRgba });
        backgroundColorHandler(colorRgba);
        allSettings.canvas.requestRenderAll();
    };
    const handleBackColorChangeCube = (e) => {
        const color = e.target.style.backgroundColor;
        setBackColorChosen({ background: color });
        backgroundColorHandler(color);
        allSettings.canvas.requestRenderAll();
    };

    // TODO: 測試用資料，待刪除
    const logCurrentCanvas = () => {
        var json = allSettings.canvas.toJSON();
        console.log(JSON.stringify(json));
    };

    // jsx + functions: img adjustment
    const [currentFilters, setCurrentFilters] = React.useState({
        brightness: 0,
        contrast: 0,
        saturation: 0,
        rotation: 0,
        blur: 0,
        noise: 0,
    });
    const customFilters = [
        {
            way: 'Brightness',
            attr: 'brightness',
            max: 1,
            min: -1,
            step: 0.01,
            text: '亮度',
            rate: 100,
        },
        {
            way: 'Contrast',
            attr: 'contrast',
            max: 1,
            min: -1,
            step: 0.01,
            text: '對比度',
            rate: 100,
        },
        {
            way: 'Saturation',
            attr: 'saturation',
            max: 1,
            min: -1,
            step: 0.01,
            text: '飽和度',
            rate: 100,
        },
        {
            way: 'HueRotation',
            attr: 'rotation',
            max: 1,
            min: -1,
            step: 0.01,
            text: '色調',
            rate: 100,
        },
        {
            way: 'Blur',
            attr: 'blur',
            max: 1,
            min: 0,
            step: 0.01,
            text: '模糊',
            rate: 100,
        },
        {
            way: 'Noise',
            attr: 'noise',
            max: 1000,
            min: 0,
            step: 10,
            text: '雜訊',
            rate: 0.1,
        },
    ];
    const resetFilters = () => {
        setCurrentFilters({
            brightness: 0,
            contrast: 0,
            saturation: 0,
            rotation: 0,
            blur: 0,
            noise: 0,
        });
        allSettings.activeObj.filters = [];
        allSettings.activeObj.applyFilters();
        allSettings.canvas.requestRenderAll();
    };
    const imageFiltersJsx = customFilters.map((item, index) => (
        <div key={index} className='imgAdjustBox'>
            <div className='imgAdjustText'>{item.text}</div>
            <input
                className='imgAdjustRange'
                type='range'
                min={item.min}
                max={item.max}
                value={currentFilters[item.attr]}
                onInput={(e) => {
                    let f = fabric.Image.filters;
                    let newFilters = { ...currentFilters };
                    newFilters[item.attr] = parseFloat(e.target.value);
                    setCurrentFilters(newFilters);
                    const newFilter = new f[item.way]({
                        [item.attr]: parseFloat(e.target.value),
                    });
                    allSettings.activeObj.filters[index] = newFilter;
                    allSettings.activeObj.applyFilters();
                    allSettings.canvas.requestRenderAll();
                }}
                step={item.step}
            ></input>
            <div className='imgAdjustValue'>{currentFilters[item.attr]}</div>
        </div>
    ));
    // jsx : sidebar
    const sidebarArray = [
        {
            EN: 'template',
            CH: '範本',
            icon: <icons.SidebarSample className='sidebarIcon' />,
            iconB: <icons.SidebarSampleB className='sidebarIcon' />,
        },
        {
            EN: 'text',
            CH: '文字',
            icon: <icons.SidebarText className='sidebarIcon' />,
            iconB: <icons.SidebarTextB className='sidebarIcon' />,
        },
        {
            EN: 'shape',
            CH: '形狀',
            icon: <icons.SidebarShape className='sidebarIcon' />,
            iconB: <icons.SidebarShapeB className='sidebarIcon' />,
        },
        {
            EN: 'line',
            CH: '線條',
            icon: <icons.SidebarLine className='sidebarIcon' />,
            iconB: <icons.SidebarLineB className='sidebarIcon' />,
        },
        {
            EN: 'image',
            CH: '照片',
            icon: <icons.SidebarImage className='sidebarIcon' />,
            iconB: <icons.SidebarImageB className='sidebarIcon' />,
        },
        {
            EN: 'sticker',
            CH: '貼圖',
            icon: <icons.SidebarSticker className='sidebarIcon' />,
            iconB: <icons.SidebarStickerB className='sidebarIcon' />,
        },
        {
            EN: 'background',
            CH: '背景',
            icon: <icons.SidebarBackground className='sidebarIcon' />,
            iconB: <icons.SidebarBackgroundB className='sidebarIcon' />,
        },

        {
            EN: 'upload',
            CH: '上傳',
            icon: <icons.SidebarUpload className='sidebarIcon' />,
            iconB: <icons.SidebarUploadB className='sidebarIcon' />,
        },
        // {
        //     EN: 'more',
        //     CH: '更多',
        //     icon: <icons.SidebarMore className='sidebarIcon' />,
        //     iconB: <icons.SidebarMoreB className='sidebarIcon' />,
        // },
    ];
    const sidebarFoldJsx = sidebarArray.map((item, index) => (
        <div
            key={index}
            className={`sideButton ${
                props.currentSidebar === 'template' && props.currentSidebar === item.EN
                    ? 'sideButtonChosen firstButton'
                    : props.currentSidebar === 'upload' && props.currentSidebar === item.EN
                    ? 'sideButtonChosen lastButton'
                    : props.currentSidebar === item.EN
                    ? 'sideButtonChosen'
                    : ''
            }`}
            onClick={() => props.setCurrentSidebar(item.EN)}
        >
            {props.currentSidebar === item.EN ? item.icon : item.iconB}
            <div className={`iconText ${props.currentSidebar === item.EN ? 'iconTextB' : ''}`}>
                {item.CH}
            </div>
        </div>
    ));

    // jsx: sidebar - sticker
    const stickerArray = [
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fballet.svg?alt=media&token=1d5e5227-2183-4bcc-ad9b-959ac4819763',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2FDoggie.svg?alt=media&token=a2c119c8-b54b-4179-ac98-051cbe8485ff',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fclumsy.svg?alt=media&token=3f7b90d8-c1e2-4137-84cc-03b90c914351',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fbikini.svg?alt=media&token=d1c1eb63-84c8-4d9c-a7f9-f323c4bfd876',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fcoffee.svg?alt=media&token=cf6b586c-75c0-4c03-b81a-e29f8fa43574',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fdancing.svg?alt=media&token=7835db16-23f8-4908-82f7-e097999e1520',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Fdog-jump.svg?alt=media&token=f9877759-4a82-4330-aa5f-9db031ca8c3c',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ffloat.svg?alt=media&token=2e447975-657a-4dca-9dbb-91d870aace7e',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-01png.png?alt=media&token=a4e036ed-30f8-4fa3-929f-d51a6d281256',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-02.png?alt=media&token=8812fd2a-600b-4b16-9331-48cf4e870de6',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-03.png?alt=media&token=604b3548-6d4a-4d51-bf15-73a57d11e22a',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-04.png?alt=media&token=06360b8a-f9ca-4034-884e-b79674026cb9',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-05.png?alt=media&token=de15967e-73c6-47cf-8416-8afa6677b732',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-06.png?alt=media&token=d798ddaa-f957-4f63-af5b-72e602db2cc7',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-07.png?alt=media&token=e60cbd02-9169-4016-97ee-4cdeadb7eb28',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/stickers%2Ftape-08.png?alt=media&token=145cdf4c-cf19-4910-9b80-2a32a3f6dbc1',
    ];
    const stickerJsx = stickerArray.map((item, index) => {
        return (
            <div key={index} className='unfoldItemGalleryWrapper'>
                <img
                    onClick={addSticker}
                    className='unfoldItem unfoldItemGallery'
                    draggable='true'
                    src={item}
                ></img>
            </div>
        );
    });

    // jsx: sidebar - image
    const imageArray = [
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fpexels-any-lane-5727921.jpeg?alt=media&token=9377a8ad-a866-4121-b643-b7e986f01c05',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fpexels-any-lane-5727922.jpeg?alt=media&token=68c098f6-4baa-4a9c-b14f-c85b98b78ca2',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fpexels-any-lane-5727928.jpeg?alt=media&token=22179791-4cd4-46b7-9b52-69ce6d5031a2',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fpexels-giftpunditscom-1303086.jpeg?alt=media&token=8651f14d-76a2-4a2e-aaa7-52b068b11bef',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fpexels-giftpunditscom-1303098.jpeg?alt=media&token=a947cd3d-46e2-4766-91bd-b184d873901e',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fpexels-maksim-goncharenok-5821029.jpeg?alt=media&token=e81bc877-ad53-4ad5-8479-9dc7bae31a7c',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fpexels-pixabay-235970.jpeg?alt=media&token=5242ddcf-69cd-45a9-a92f-aa146798f3ea',
        'https://firebasestorage.googleapis.com/v0/b/pica-b4a59.appspot.com/o/images%2Fpexels-tejas-prajapati-586744.jpeg?alt=media&token=fa4acca3-5cfa-4a76-afb0-1437ce3c82b3',
    ];
    const imageJsx = imageArray.map((item, index) => {
        return (
            <div key={index} className='unfoldItemGalleryWrapper'>
                <img
                    onClick={addImage}
                    className='unfoldItem unfoldItemGallery'
                    draggable='true'
                    src={item}
                ></img>
            </div>
        );
    });

    // jsx: sidebar - line
    const lineArray = [line1, line2, line3, line4, line5, line6];
    const lineJsx = lineArray.map((item, index) => {
        return (
            <img
                key={index}
                src={item}
                className='unfoldItem itemLine'
                onClick={addShape}
                draggable='true'
            ></img>
        );
    });

    // jsx: sidebar - background color cube
    const colorArray = [
        '#FCB900',
        '#FF6900',
        '#7BDCB5',
        '#00D084',
        '#8ED1FC',
        '#0693E3',
        '#ABB8C3',
        '#EB144C',
        '#F78DA7',
        '#9900EF',
    ];
    const backgroundColorJsx = colorArray.map((item, index) => {
        return (
            <div
                key={index}
                className='backgroundColorCube'
                style={{ backgroundColor: item }}
                onClick={handleBackColorChangeCube}
            ></div>
        );
    });

    // jsx: sidebar - background image
    const backgroundImageArray = [
        'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
        'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
        'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
        'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
    ];
    const backgroundImageJsx = backgroundImageArray.map((item, index) => {
        return (
            <div key={index} className='unfoldItemGalleryWrapper'>
                <img
                    key={index}
                    draggable='false'
                    onClick={backgroundImageHandler}
                    className='unfoldItem unfoldItemGallery'
                    src={item}
                ></img>
            </div>
        );
    });

    // jsx: sidebar - shape
    const abnormalShapeArray = [shape1, shape2, shape3];
    const abnShapeJsx = abnormalShapeArray.map((item, index) => {
        return (
            <img
                key={index}
                src={item}
                draggable='true'
                className='unfoldItem abnormalShape'
                onClick={addShape}
            ></img>
        );
    });

    // jsx: sidebar - sample
    React.useEffect(() => {
        if (props.allSettings.canvasSetting.type) {
            firebase.getSampleList(props.allSettings.canvasSetting.type, (result) => {
                setSampleList(result);
            });
        }
    }, [props.allSettings.canvasSetting]);

    const sampleJsx = sampleList.map((item, index) => {
        return (
            <div key={index} className='unfoldItemGalleryWrapper'>
                <img
                    key={index}
                    draggable='false'
                    // onClick={backgroundImageHandler}
                    className='unfoldItem unfoldItemGallery'
                    src={item.snapshot}
                ></img>
            </div>
        );
    });

    // get current image styles
    React.useEffect(() => {
        if (allSettings.activeObj.type === 'image') {
            let filtersActive = {
                brightness: 0,
                contrast: 0,
                saturation: 0,
                rotation: 0,
                blur: 0,
                noise: 0,
            };
            allSettings.activeObj.filters.forEach((item) => {
                let type = item.type.toLowerCase();
                if (type === 'huerotation') {
                    filtersActive.rotation = parseFloat(item.rotation);
                } else {
                    filtersActive[type] = parseFloat(item[type]);
                }
            });
            setCurrentFilters(filtersActive);
        }
    }, [allSettings.activeObj]);

    return (
        <div className='sidebar'>
            <div className='sidebarFold'>{sidebarFoldJsx}</div>
            {props.currentSidebar !== '' ? (
                <div
                    className={`sidebarUnfold sidebarUnfoldUpload ${
                        props.currentSidebar === 'template' ? 'firstUnfold' : ''
                    }`}
                >
                    {props.currentSidebar === 'text' ? (
                        <div
                            className='sidebarUnfoldInner sidebarUnfoldText'
                            onMouseDown={(e) => allSettings.saveDragItem.func(e)}
                        >
                            <div
                                draggable='true'
                                className='unfoldItem addTextBig '
                                onClick={() =>
                                    addIText(
                                        allSettings.textSetting[0].title,
                                        allSettings.textSetting[0].size,
                                        allSettings.textSetting[0].fontWeight
                                    )
                                }
                            >
                                新增標題
                            </div>
                            <div
                                draggable='true'
                                className='unfoldItem addTextMiddle '
                                onClick={() =>
                                    addIText(
                                        allSettings.textSetting[1].title,
                                        allSettings.textSetting[1].size,
                                        allSettings.textSetting[1].fontWeight
                                    )
                                }
                            >
                                新增副標
                            </div>
                            <div
                                draggable='true'
                                className='unfoldItem addTextSmall '
                                onClick={() =>
                                    addIText(
                                        allSettings.textSetting[2].title,
                                        allSettings.textSetting[2].size,
                                        allSettings.textSetting[2].fontWeight
                                    )
                                }
                            >
                                新增內文
                            </div>
                        </div>
                    ) : props.currentSidebar === 'shape' ? (
                        <div
                            className='sidebarUnfoldInner sidebarUnfoldShape'
                            onMouseDown={(e) => allSettings.saveDragItem.func(e)}
                        >
                            <div className='sidebarUnfoldSubtitle'>常用形狀</div>
                            <img
                                src={square}
                                className='unfoldItem rectShape '
                                draggable='true'
                                onClick={addRect}
                            ></img>
                            <img
                                src={circle}
                                className='unfoldItem circleShape'
                                draggable='true'
                                onClick={addCircle}
                            ></img>
                            <img
                                src={triangle}
                                className='unfoldItem triangleShape'
                                draggable='true'
                                onClick={addTriangle}
                            ></img>
                            <div className='sidebarUnfoldSubtitle'>不規則形狀</div>
                            {abnShapeJsx}
                        </div>
                    ) : props.currentSidebar === 'line' ? (
                        <div
                            className='sidebarUnfoldInner sidebarUnfoldLine'
                            onMouseDown={(e) => allSettings.saveDragItem.func(e)}
                        >
                            {lineJsx}
                        </div>
                    ) : props.currentSidebar === 'image' ? (
                        <div
                            className='sidebarUnfoldInner sidebarUnfoldImg'
                            onMouseDown={(e) => allSettings.saveDragItem.func(e)}
                        >
                            {imageJsx}
                        </div>
                    ) : props.currentSidebar === 'background' ? (
                        <div className='sidebarUnfoldInner sidebarUnfoldBack'>
                            <div className='backgroundTitleOuter'>
                                <div className='sidebarUnfoldSubtitle backgroundTitle'>
                                    背景色彩
                                </div>
                                {allSettings.hasBackColor ? (
                                    <div
                                        className='backgroundCheckboxMinus'
                                        onClick={toggleAddBackColor}
                                    >
                                        －
                                    </div>
                                ) : (
                                    <div
                                        className='backgroundCheckboxAdd'
                                        onClick={toggleAddBackColor}
                                    >
                                        ＋
                                    </div>
                                )}
                            </div>
                            <div className='colorChartWrapper'>
                                <div className='currentBackground'>
                                    <div
                                        className='backgroundColorCube currentColorCube'
                                        style={{ backgroundColor: backColorChosen.background }}
                                        onClick={toggleBackColorSelection}
                                    ></div>
                                    {isChoosingBackColor ? (
                                        <ChromePicker
                                            className='backgroundPicker'
                                            color={backColorChosen.background}
                                            onChange={handleBackColorChange}
                                        />
                                    ) : null}
                                </div>
                                <div className='backgroundColorChart'>{backgroundColorJsx}</div>
                            </div>
                            <div className='sidebarUnfoldSubtitle backgroundTitle'>背景圖片</div>
                            <div className='backImgChart'>{backgroundImageJsx}</div>
                        </div>
                    ) : props.currentSidebar === 'upload' ? (
                        <div className='sidebarUnfoldInner sidebarUnfoldUpload'>
                            {uploadProgressValue === 0 ? (
                                <label className='unfoldItem uploadLabel'>
                                    點擊以上傳圖片
                                    <input
                                        className='uploadInput'
                                        type='file'
                                        accept='image/png, image/jpeg'
                                        onChange={handleUploadImage}
                                    ></input>
                                </label>
                            ) : (
                                <div className='progressWrapper'>
                                    <progress
                                        className='uploadProgress'
                                        value={uploadProgressValue}
                                        max='100'
                                    ></progress>
                                    <div>LOADING</div>
                                    <div>{uploadProgressValue}%</div>
                                </div>
                            )}
                            {uploadedImgJsx}
                        </div>
                    ) : props.currentSidebar === 'frame' ? (
                        <div className='sidebarUnfoldInner sidebarUnfoldFrame' t>
                            <div className='unfoldItem' onClick={() => addFrameA(5, 10)}>
                                新增框架
                            </div>
                        </div>
                    ) : props.currentSidebar === 'sticker' ? (
                        <div
                            className='sidebarUnfoldInner sidebarUnfoldSticker'
                            onMouseDown={(e) => allSettings.saveDragItem.func(e)}
                        >
                            {stickerJsx}
                        </div>
                    ) : props.currentSidebar === 'template' ? (
                        <div
                            className='sidebarUnfoldInner sidebarUnfoldSample'
                            // onMouseDown={(e) => allSettings.saveDragItem.func(e)}
                        >
                            {sampleJsx}
                        </div>
                    ) : props.currentSidebar === 'more' ? (
                        <div className='sidebarUnfoldInner'>
                            <div className='unfoldItem' onClick={logCurrentCanvas}>
                                印出canvas(測試用)
                            </div>
                        </div>
                    ) : props.currentSidebar === 'imageAdjustment' ? (
                        <div className='sidebarUnfoldInner unfoldImgAdjustment'>
                            {imageFiltersJsx}
                            <div className='resetFilterButton' onClick={resetFilters}>
                                重設圖片
                            </div>
                        </div>
                    ) : null}
                    {props.currentSidebar !== 'imageAdjustment' ? (
                        <div
                            className='sidebarCloseButton'
                            onClick={() => {
                                props.setCurrentSidebar('');
                            }}
                        >
                            {'<'}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

Sidebar.propTypes = {
    currentSidebar: PropTypes.string.isRequired,
    setCurrentSidebar: PropTypes.func.isRequired,
    trackOutSideClick: PropTypes.func.isRequired,
    allSettings: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    fileId: PropTypes.string.isRequired,
};

export default Sidebar;
