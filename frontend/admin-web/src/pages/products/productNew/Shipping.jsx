import React from 'react';
import './Shipping.less';

const Shipping = ({ shipping, setShipping, isPhysical, setIsPhysical }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipping((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setIsPhysical(e.target.checked);
  };

  return (
    <div className="shipping">
      <h2>Shipping</h2>
      <div className='shipping-details'>
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={isPhysical}
            onChange={handleCheckboxChange}
          />
          <span className="checkmark"></span>
          This is a physical product
        </label>
        <div className="shipping-inputs">
          <div className="input-group">
            <label>Weight</label>
            <input type="text" name="weight" placeholder="Product weight..." value={shipping.weight} onChange={handleInputChange} />
          </div>
          <div className="input-group">
            <label>Height</label>
            <input type="text" name="height" placeholder="Height (cm)..." value={shipping.height} onChange={handleInputChange} />
          </div>
          <div className="input-group">
            <label>Length</label>
            <input type="text" name="length" placeholder="Length (cm)..." value={shipping.length} onChange={handleInputChange} />
          </div>
          <div className="input-group">
            <label>Width</label>
            <input type="text" name="width" placeholder="Width (cm)..." value={shipping.width} onChange={handleInputChange} />
          </div>
        </div>      
      </div>
    </div>
  );
};

export default Shipping;