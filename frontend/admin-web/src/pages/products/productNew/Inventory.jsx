import React from 'react';
import './Inventory.less';

const Inventory = ({ inventory, setInventory }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventory({ ...inventory, [name]: value });
  };

  return (
    <div className="inventory">
      <h2>Inventory</h2>
      <div className="inventory-inputs">
        <div className="input-group">
          <label>SKU</label>
          <input
            type="text"
            name="sku"
            placeholder="Type product SKU here..."
            value={inventory.sku}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>Barcode</label>
          <input
            type="text"
            name="barcode"
            placeholder="Product barcode..."
            value={inventory.barcode}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>Quantity</label>
          <input
            type="text"
            name="quantity"
            placeholder="Type product quantity here..."
            value={inventory.quantity}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Inventory;
