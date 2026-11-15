import React, { useState } from 'react';
import './TagsAndColors.less';
import { SketchPicker } from 'react-color';

const TagsAndColors = ({ tags, setTags, colors, setColors }) => {
  const [inputValue, setInputValue] = useState('');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [tempColor, setTempColor] = useState('#000');

  const handleTagsChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
    const newTags = value.split(',').map(tag => tag.trim());
    setTags(newTags);
  };

  const handleColorChange = (color) => {
    setTempColor(color.hex);
  };

  const addColor = () => {
    if (colors.length < 5) {
      setColors([...colors, tempColor]);
      setColorPickerVisible(false);
    } else {
      alert('You can add up to 5 colors only.');
    }
  };

  const removeColor = (index) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
  };

  return (
    <div className="tags-and-colors">
      <div className="input-group">
        <label>Tags for categorizing the product</label>
        <input
          type="text"
          placeholder="Enter tags, separated by commas"
          value={inputValue}
          onChange={handleTagsChange}
        />
      </div>
      <div className="input-group colors">
        <label>Select the accurate color of the product</label>
        <div className="color-palette">
          {colors.map((color, index) => (
            <div
              key={index}
              className="color-box"
              style={{ backgroundColor: color }}
              onClick={() => removeColor(index)}
            >
              <span className="remove-color">🗑️</span>
            </div>
          ))}
          {colors.length < 5 && (
            <div
              className="add-color"
              onClick={() => setColorPickerVisible(!colorPickerVisible)}
            >
              +
            </div>
          )}
          {colorPickerVisible && (
            <div className="color-picker">
              <SketchPicker 
                color={tempColor} 
                onChange={handleColorChange} 
              />
              <button className="add-color-button" onClick={addColor}>Add Color</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagsAndColors;
