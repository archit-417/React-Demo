import React, { useState } from 'react';
import './ColourPicker.css';

export default function ColorPicker() {
    const [color, setColor] = useState({ r: 120, g: 200, b: 90 });
    const [savedColors, setSavedColors] = useState([]);
    const handleSliderChange = (channel, value) => {
        setColor(prev => ({
            ...prev,
            [channel]: parseInt(value)
        }));
    };
    const saveColor = () => {
        const newColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        if (!savedColors.includes(newColor)) {
            setSavedColors([...savedColors, newColor]);
        }
    };
    const rgbString = `rgb(${color.r}, ${color.g}, ${color.b})`;
    return (
        <div className="color-picker">
            <h1>Color Mixer</h1>
            <div
                className="color-display"
                style={{ backgroundColor: rgbString }}
            >
                <span className="color-value">{rgbString}</span>
            </div>
            <div className="sliders">
                <div className="slider-group">
                    <label>Red: {color.r}</label>
                    <input
                        type="range"
                        min="0"
                        max="255"
                        value={color.r}
                        onChange={(e) => handleSliderChange('r', e.target.value)}
                        className="slider red"
                    />
                </div>
                <div className="slider-group">
                    <label>Green: {color.g}</label>
                    <input
                        type="range"
                        min="0"
                        max="255"
                        value={color.g}
                        onChange={(e) => handleSliderChange('g', e.target.value)}
                        className="slider green"
                    />
                </div>
                <div className="slider-group">
                    <label>Blue: {color.b}</label>
                    <input
                        type="range"
                        min="0"
                        max="255"
                        value={color.b}
                        onChange={(e) => handleSliderChange('b', e.target.value)}
                        className="slider blue"
                    />
                </div>
            </div>
            <button onClick={saveColor} className="save-btn">
                Save Color
            </button>
            {savedColors.length > 0 && (
                <div className="saved-colors">
                    <h3>Saved Colors:</h3>
                    <div className="color-palette">
                        {savedColors.map((savedColor, index) => (
                            <div
                                key={index}
                                className="saved-color"
                                style={{ backgroundColor: savedColor }}
                                title={savedColor}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}