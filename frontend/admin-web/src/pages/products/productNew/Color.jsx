import React from 'react';
import Select from 'react-select';
import './Color.less';
import { Skeleton } from 'antd';

const colorOptions = [
  { "label": "White", "value": "#FFFFFF" },
  { "label": "Black", "value": "#000000" },
  { "label": "Red", "value": "#FF0000" },
  { "label": "Green", "value": "#008000" },
  { "label": "Blue", "value": "#0000FF" },
  { "label": "Yellow", "value": "#FFFF00" },
  { "label": "Purple", "value": "#800080" },
  { "label": "Orange", "value": "#FFA500" },
  { "label": "Pink", "value": "#FFC0CB" },
  { "label": "Brown", "value": "#A52A2A" },
  { "label": "Gray", "value": "#808080" },
  { "label": "Cyan", "value": "#00FFFF" },
  { "label": "Magenta", "value": "#FF00FF" },
  { "label": "Lime", "value": "#00FF00" },
  { "label": "Olive", "value": "#808000" },
  { "label": "Maroon", "value": "#800000" },
  { "label": "Navy", "value": "#000080" },
  { "label": "Teal", "value": "#008080" },
  { "label": "Silver", "value": "#C0C0C0" },
  { "label": "Gold", "value": "#FFD700" }
]



const Colors = ({ colors, setColors, isLoading }) => {
  const handleColorChange = (selectedOptions) => {
    const selectedColors = selectedOptions.reduce((obj,item)=> {
      obj[String(item.label).toLowerCase()] = item.value;
      return obj; 
    } , {} );
    setColors(selectedColors);
  };

  return (
    <div className="colors">
      <h2>Colors</h2>
      {
        isLoading ? 
        <Skeleton.Button block active size="large" />
        :
        <Select
          isMulti
          value={colorOptions.filter(option => Object.values(colors).includes(option.value))}
          onChange={handleColorChange}
          options={colorOptions}
          placeholder="Select colors"
          className="react-select-container"
          classNamePrefix="react-select"
        />
      }  
    </div>
  );
};

export default Colors;
