import React from 'react';
import './Variation.less';

const Variation = ({ variations, setVariations }) => {
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariations = variations.map((variation, i) => 
      i === index ? { ...variation, [name]: value } : variation
    );
    setVariations(updatedVariations);
  };

  const handleAddVariant = (e) => {
    e.preventDefault();
    setVariations([...variations, { id: variations.length + 1, type: '', value: '' }]);
  };

  const handleRemoveVariant = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  return (
    <div className="variation">
      <h2>Variation</h2>
      {variations.map((variation, index) => (
        <div key={index} className="variation-row input-group">
          <select
            name="type"
            className='variation-input'
            value={variation.type}
            onChange={(e) => handleInputChange(index, e)}
          >
            <option value="">Select a variation</option>
            <option value="Size">Size</option>
            <option value="Color">Color</option>
            {/* Add more options as needed */}
          </select>
          <input
            type="text"
            name="value"
            className="variation-input"
            placeholder="Variation..."
            value={variation.value}
            onChange={(e) => handleInputChange(index, e)}
          />
          <button className="remove-variant-button" onClick={() => handleRemoveVariant(index)}>
            Remove
          </button>
        </div>
      ))}
      <button className="add-variant-button" onClick={handleAddVariant}>
        + Add Variant
      </button>
    </div>
  );
};

export default Variation;

