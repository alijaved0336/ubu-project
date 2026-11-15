import React from 'react';
import './Pricing.less';
import Select from 'react-select';
import currencyList from 'currency-list'
import { Skeleton } from 'antd';

const currencyData = currencyList.getAll('en')
const currencyOptions = Object.keys(currencyData).map(currency => ({
  value: currencyData[currency].code,
  label: `${currencyData[currency].code} - ${currencyData[currency].name}`,
}));

const Pricing = ({ pricing, setPricing, required, isLoading }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPricing((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCurrencyChange = (selectedOption) => {
    setPricing((prevState) => ({
      ...prevState,
      currency: selectedOption.value,
    }));
  };

  return (
    <div className="pricing">
      <h2>Pricing</h2>
      <div className='pricing-inputs'>
        <div className="input-group">
          <label>Price</label>
          {
            isLoading ? 
            <Skeleton.Button block active size="large"/>
            :
            <input
              type="text"
              name="price"
              placeholder="Enter product price"
              value={pricing.price || ''}
              onChange={handleInputChange}
              required={required}
            />
          }  
        </div>
        {/* <div className="input-group">
          <label>Currency</label>
          {
            isLoading ? 
            <Skeleton.Button block active size="large"/>
            :
            <Select
              value={currencyOptions.find(option => option.value === pricing.currency) || ''}
              onChange={handleCurrencyChange}
              options={currencyOptions}
              required={required}
            />
          }  
        </div>    */}
      </div>      

    </div>
  );
};

export default Pricing;
