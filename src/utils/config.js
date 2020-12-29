// for all pages
export const canvasSizeOptions = [
    { name: '自訂尺寸', type: 'custom', width: 1800, height: 1600 },
    { name: '橫式海報', type: 'poster', width: 1728, height: 1296, mmW: 609, mmH: 457 },
    { name: '網頁', type: 'web', width: 1280, height: 1024 },
    { name: 'Instagram', type: 'instagram', width: 1080, height: 1080 },
    { name: '橫式A4', type: 'a4', width: 842, height: 595, mmW: 297, mmH: 210 },
    { name: '明信片', type: 'postCard', width: 560, height: 288, mmW: 198, mmH: 102 },
    { name: '名片', type: 'nameCard', width: 255, height: 153, mmW: 90, mmH: 54 },
];

export const mediaQuerySize = { small: 450, medium: 600, big: 900 };

// for canvas pages
export const textSetting = [
    {
        title: '雙擊以編輯標題',
        size: 36,
        fontWeight: 'bold',
        className: 'addTextBig',
        content: '新增標題',
    },
    {
        title: '雙擊以編輯副標',
        size: 28,
        fontWeight: 'normal',
        className: 'addTextMiddle',
        content: '新增副標',
    },
    {
        title: '雙擊以編輯內文',
        size: 18,
        fontWeight: 'normal',
        className: 'addTextSmall',
        content: '新增內文',
    },
];
// -- sidebar items
import React from 'react';
import * as icons from '../img/icons';
import * as sidebarItems from '../img/sidebarItems';
export const normalShapeSetting = [
    { type: 'square', className: 'rectShape', callbackName: 'addRect' },
    { type: 'radiusSquare', className: 'radiusRectShape', callbackName: 'addRadiusRect' },
    { type: 'circle', className: 'circleShape', callbackName: 'addCircle' },
    { type: 'triangle', className: 'triangleShape', callbackName: 'addTriangle' },
];
export const sidebarArray = [
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
    {
        EN: 'template',
        CH: '範本',
        icon: <icons.SidebarSample className='sidebarIcon' />,
        iconB: <icons.SidebarSampleB className='sidebarIcon' />,
    },
];
export const abnormalShapeArray = [
    sidebarItems.shape1,
    sidebarItems.shape2,
    sidebarItems.shape3,
    sidebarItems.shape4,
    sidebarItems.shape5,
    sidebarItems.shape6,
    sidebarItems.shape7,
    sidebarItems.shape8,
];
export const lineArray = [
    sidebarItems.line1,
    sidebarItems.line2,
    sidebarItems.line3,
    sidebarItems.line4,
    sidebarItems.line5,
    sidebarItems.line6,
    sidebarItems.line7,
    sidebarItems.line8,
    sidebarItems.line9,
    sidebarItems.line10,
    sidebarItems.line11,
];
export const imageArray = [
    {
        title: '聖誕節',
        src: [
            sidebarItems.IX01,
            sidebarItems.IX02,
            sidebarItems.IX03,
            sidebarItems.IX04,
            sidebarItems.IX05,
            sidebarItems.IX06,
        ],
    },
    {
        title: '生活',
        src: [
            sidebarItems.IL01,
            sidebarItems.IL02,
            sidebarItems.IL03,
            sidebarItems.IL04,
            sidebarItems.IL05,
            sidebarItems.IL06,
        ],
    },
    {
        title: '餐食',
        src: [sidebarItems.IM01, sidebarItems.IM02, sidebarItems.IM03, sidebarItems.IM04],
    },
    {
        title: '其他',
        src: [
            sidebarItems.IO01,
            sidebarItems.IO02,
            sidebarItems.IO03,
            sidebarItems.IO04,
            sidebarItems.IO05,
        ],
    },
];
export const stickerTestArray = [
    {
        title: '紙膠帶',
        src: [sidebarItems.ST01, sidebarItems.ST02, sidebarItems.ST03, sidebarItems.ST04],
    },
    {
        title: '太空',
        src: [
            sidebarItems.SPO01,
            sidebarItems.SPO02,
            sidebarItems.SPO03,
            sidebarItems.SPO04,
            sidebarItems.SPO05,
            sidebarItems.SPO06,
        ],
    },
    {
        title: '恐龍',
        src: [
            sidebarItems.SD01,
            sidebarItems.SD02,
            sidebarItems.SD03,
            sidebarItems.SD04,
            sidebarItems.SD05,
            sidebarItems.SD06,
        ],
    },
    {
        title: '肉食主義',
        src: [sidebarItems.SM01, sidebarItems.SM02, sidebarItems.SM03, sidebarItems.SM04],
    },
    {
        title: '健康蔬食',
        src: [
            sidebarItems.SFU01,
            sidebarItems.SFU02,
            sidebarItems.SFU03,
            sidebarItems.SFU04,
            sidebarItems.SFU05,
            sidebarItems.SFU06,
        ],
    },
    {
        title: '花朵',
        src: [
            sidebarItems.SF01,
            sidebarItems.SF02,
            sidebarItems.SF03,
            sidebarItems.SF04,
            sidebarItems.SF05,
            sidebarItems.SF06,
            sidebarItems.SF07,
            sidebarItems.SF08,
        ],
    },
    {
        title: '怪獸',
        src: [
            sidebarItems.SMO01,
            sidebarItems.SMO02,
            sidebarItems.SMO03,
            sidebarItems.SMO04,
            sidebarItems.SMO05,
            sidebarItems.SMO06,
        ],
    },
];
export const backgroundColorArray = [
    'rgba(252, 185, 0, 1)',
    'rgba(255, 105, 0, 1)',
    'rgba(123, 220, 181, 1)',
    'rgba(142, 209, 252, 1)',
    'rgba(6, 34, 117, 1)',
    'rgba(171, 184, 195, 1)',
    'rgba(235, 20, 76, 1)',
    'rgba(247, 141, 167, 1)',
    'rgba(153, 0, 239, 1)',
];
export const backgroundImageArray = [
    sidebarItems.B01,
    sidebarItems.B02,
    sidebarItems.B03,
    sidebarItems.B04,
    sidebarItems.B05,
    sidebarItems.B06,
    sidebarItems.B07,
    sidebarItems.B08,
    sidebarItems.B09,
    sidebarItems.B10,
    sidebarItems.B11,
];
export const imageFiltersInit = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    rotation: 0,
    blur: 0,
    noise: 0,
};
export const imageFiltersSetting = [
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
