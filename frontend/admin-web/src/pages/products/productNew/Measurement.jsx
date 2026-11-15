import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import './Measurement.less';
import Switch from 'react-switch';

const Measurement = ({ measurement, setMeasurement, selectedCategory }) => {
  const [sizeOptions, setSizeOptions] = useState([]);
  const [sizeRows, setSizeRows] = useState([{ size: '', weight: '', height: '', active: false }]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSizeOptions(selectedCategory.value);
    } else {
      setSizeOptions([]);
    }
  }, [selectedCategory]);

  const fetchSizeOptions = async (categoryId) => {
    // Replace with your API endpoint
    const response = await fetch(`/api/size-options?category=${categoryId}`);
    const data = await response.json();
    setSizeOptions(data.map(option => ({ value: option.id, label: option.name })));
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newSizeRows = [...sizeRows];
    newSizeRows[index][name] = value;
    setSizeRows(newSizeRows);
    setMeasurement(newSizeRows);
  };

  const handleSelectChange = (index, selectedOption) => {
    const newSizeRows = [...sizeRows];
    newSizeRows[index].size = selectedOption ? selectedOption.value : '';
    setSizeRows(newSizeRows);
    setMeasurement(newSizeRows);
  };

  const handleSwitchChange = (index, checked) => {
    const newSizeRows = [...sizeRows];
    newSizeRows[index].active = checked;
    setSizeRows(newSizeRows);
    setMeasurement(newSizeRows);
  };

  const addSizeRow = () => {
    setSizeRows([...sizeRows, { size: '', weight: '', height: '', active: false }]);
  };

  return (
    <div className="measurement">
      <h2>Measurement</h2>
      {sizeRows.map((row, index) => (
        <div key={index} className="inputContainer">
          <div className="inputGroup">
            <label>Size</label>
            <Select
              value={sizeOptions.find(option => option.value === row.size) || ''}
              onChange={(selectedOption) => handleSelectChange(index, selectedOption)}
              options={sizeOptions}
              placeholder="Select a size"
              isDisabled={!selectedCategory}
            />
          </div>
          <div className="inputGroup">
            <label>Weight</label>
            <input
              type="text"
              name="weight"
              placeholder="Enter product weight"
              value={row.weight || ''}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          <div className="inputGroup">
            <label>Height</label>
            <input
              type="text"
              name="height"
              placeholder="Enter product height"
              value={row.height || ''}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
          <div className="inputGroup switchContainer">
            <label>Active</label>
            <Switch
              onChange={(checked) => handleSwitchChange(index, checked)}
              checked={row.active || false}
              offColor="#888"
              onColor="#000"
            />
          </div>
        </div>
      ))}
      <button type="button" className="addButton" onClick={addSizeRow}>
        + Add Size
      </button>
    </div>
  );
};

export default Measurement;
