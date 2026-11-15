import React, { useState, useEffect } from 'react';
import { Table, Input } from 'antd';

const { Search } = Input;

const DataTable = ({ columns, data, loading }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    const filtered = data.filter(item =>
      Object.keys(item).some(key =>
        String(item[key]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  return (
    <>
      <Search
        placeholder="Search"
        onSearch={handleSearch}
        onChange={e => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 10 }} // Example pagination settings
        rowKey={(record) => record.id} // Assuming each data item has a unique `id`
      />
    </>
  );
};

export default DataTable;
