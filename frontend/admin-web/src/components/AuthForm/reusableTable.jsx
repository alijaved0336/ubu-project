// src/components/ReusableTable.js
import React, { useState } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const ReusableTable = ({ columns, apiUrl, paginationOptions, rowKey, ...restProps }) => {
  const { data, loading, error } = useTableData(apiUrl); // Use the custom hook for data fetching
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ fontWeight: 'bold' }}>
          {text.toString().toLowerCase().includes(searchText.toLowerCase()) ? (
            <span
              dangerouslySetInnerHTML={{
                __html: text.toString().replace(
                  new RegExp(searchText, 'gi'),
                  (match) => `<span style="background-color: #ffc069">${match}</span>`
                ),
              }}
            />
          ) : (
            text
          )}
        </span>
      ) : (
        text
      ),
  });

  const enhancedColumns = columns.map((col) => ({
    ...col,
    ...col.searchable && getColumnSearchProps(col.dataIndex),
  }));

  return (
    <Table
      columns={enhancedColumns}
      dataSource={data}
      pagination={paginationOptions}
      loading={loading}
      rowKey={rowKey}
      {...restProps}
    />
  );
};

export default ReusableTable;
