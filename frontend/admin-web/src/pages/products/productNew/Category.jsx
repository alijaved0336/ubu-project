import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Category.less";
// import Switch from "react-switch";
import { Switch } from "@src/components/Common/Widgets";

import axiosInstance from "../../../application-wide/axios/axios-instance";
import titleize from "titleize";
import { Skeleton } from "antd";
import CustomInput from "@src/components/Input/Input";

const Category = ({
  category,
  setCategory,
  gender,
  setGender,
  subCategory,
  setSubCategory,
  style,
  setStyle,
  measurement,
  setMeasurement,
  required,
  isLoading,
}) => {
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [styles, setStyles] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sizeRows, setSizeRows] = useState([
    { size: "", customFields: {}, active: false },
  ]);

  console.log(sizeRows);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchInitialData();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (category && gender) {
        fetchSubCategories(category.value, gender.value);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [category, gender]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchSizeOptions(subCategory.value);
      await fetchCustomFields(subCategory.value);
      if (measurement && measurement.length > 0) {
        setSizeRows(measurement);
      }
    };

    let isMounted = true;
    if (isMounted) {
      if (subCategory) {
        fetchData();
      }
    }
    return () => {
      isMounted = false;
    };
  }, [subCategory]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [categoriesResponse, stylesResponse, gendersResponse] =
        await Promise.all([
          axiosInstance.get("/categories/findAll"),
          axiosInstance.get("/style/findAll"),
          axiosInstance.get("/gender/findAll"),
        ]);

      setCategories(categoriesResponse.data);
      setStyles(stylesResponse.data);
      let genderValues = [];
      gendersResponse.data.map((data) =>
        genderValues.push({ label: data.name, value: data.id })
      );
      setGenders(genderValues);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId, genderId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/sub_category/find_by_category_and_gender?categoryId=${categoryId}&genderId=${genderId}`
      );
      const groupedData = groupByType(response.data);
      setSubCategories(groupedData);
    } catch (error) {
      console.error("Failed to fetch sub-categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSizeOptions = async (subCategoryId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/sizes/by_sub_category?subCategoryId=${subCategoryId}`
      );
      setSizeOptions(
        response.data.map((option) => ({
          value: option.id,
          label: option.label,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch size options:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomFields = async (subCategoryId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/sub_category/${subCategoryId}/required-columns`
      );
      const fields = response.data.required_columns;
      setCustomFields(fields);
      await setSizeRows([
        {
          size: "",
          customFields: fields.reduce(
            (acc, field) => ({ ...acc, [field]: "" }),
            {}
          ),
          active: false,
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch custom fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupByType = (data) => {
    const grouped = data.reduce((acc, item) => {
      const type = item.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({ value: item.id, label: item.name });
      return acc;
    }, {});

    return Object.keys(grouped).map((type) => ({
      label: type,
      options: grouped[type],
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption);
    setSubCategory(null);
    setSizeOptions([]);
    setMeasurement([]);
    setCustomFields([]);
  };

  const handleGenderChange = (selectedOption) => {
    setGender(selectedOption);
    setSubCategory(null);
    setSizeOptions([]);
    setMeasurement([]);
    setCustomFields([]);
  };

  const handleSubCategoryChange = (selectedOption) => {
    setSizeOptions([]);
    setMeasurement([]);
    setSubCategory(selectedOption);
  };

  const handleStyleChange = (selectedOption) => {
    setStyle(selectedOption);
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    if (!/^\d*$/.test(value)) {
      return;
    }
    const newSizeRows = [...sizeRows];

    if (
      newSizeRows[index].customFields &&
      name in newSizeRows[index].customFields
    ) {
      newSizeRows[index].customFields[name] = value;
    } else {
      newSizeRows[index][name] = value;
    }
    setSizeRows(newSizeRows);
    setMeasurement(newSizeRows);
  };

  const handleSelectChange = (index, selectedOption) => {
    const newSizeRows = [...sizeRows];
    newSizeRows[index].size = selectedOption ? selectedOption.value : "";
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
    setSizeRows([
      ...sizeRows,
      {
        size: "",
        customFields:
          customFields && customFields.length > 0
            ? customFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
            : {},
        active: false,
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    if (sizeRows.length > 1) {
      const newSizeRows = sizeRows.filter((row, i) => i !== index);
      setSizeRows(newSizeRows);
      setMeasurement(newSizeRows);
    }
  };

  return (
    <div className="category">
      <h2>Category</h2>
      <div className="row">
        <div className="input-group">
          <label>Product Category</label>
          {isLoading ? (
            <Skeleton.Button block active size="large" />
          ) : (
            <Select
              value={category}
              onChange={handleCategoryChange}
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              menuPortalTarget={document.body}
              placeholder="Select a category"
              isDisabled={loading}
              required={required}
            />
          )}
        </div>
        <div className="input-group">
          <label>Gender</label>
          {isLoading ? (
            <Skeleton.Button block active size="large" />
          ) : (
            <Select
              value={gender}
              menuPortalTarget={document.body}
              onChange={handleGenderChange}
              options={genders}
              placeholder="Select a gender"
              isDisabled={loading}
              required={required}
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="input-group">
          <label>Product Sub-Category</label>
          {isLoading ? (
            <Skeleton.Button block active size="large" />
          ) : (
            <Select
              menuPortalTarget={document.body}
              value={subCategory}
              onChange={handleSubCategoryChange}
              options={subCategories}
              placeholder="Select a Sub-Category"
              isDisabled={!category || !gender || loading}
              required={required}
            />
          )}
        </div>
        <div className="input-group">
          <label>Product Style</label>
          {isLoading ? (
            <Skeleton.Button block active size="large" />
          ) : (
            <Select
              value={style}
              menuPortalTarget={document.body}
              onChange={handleStyleChange}
              options={styles.map((st) => ({ value: st.id, label: st.name }))}
              placeholder="Select a Style"
              isDisabled={loading}
              required={required}
            />
          )}
        </div>
      </div>
      {isLoading ? (
        <Skeleton.Button block active size="large" style={{ height: 150 }} />
      ) : (
        <div className="sizes-section">
          {subCategory &&
            sizeOptions.length > 0 &&
            sizeRows.map((row, index) => (
              <div key={index} className="tw-bg-[#f1f1f1] tw-p-4 tw-space-y-5">
                <div className="tw-flex tw-justify-between tw-items-center">
                  <div className="tw-flex tw-gap-2 tw-items-center ">
                    <Switch
                      onChange={(checked) => handleSwitchChange(index, checked)}
                      checked={row.active || false}
                      disabled={!sizeOptions.length || loading}
                      offColor="#888"
                      onColor="#000"
                    />
                    <label>Active</label>
                  </div>
                  <div>
                    {" "}
                    <button
                      type="button"
                      className="remove-size-row"
                      onClick={() => handleRemoveRow(index)}
                      style={{
                        display: sizeRows.length <= 1 ? "none" : "block",
                      }}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>

                <div className=" tw-grid lg:tw-grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] tw-justify-items-center  tw-gap-3">
                  <div className="tw-flex tw-flex-col tw-gap-2 tw-w-full">
                    <label>Size</label>
                    <Select
                      menuPortalTarget={document.body}
                      value={
                        sizeOptions.find(
                          (option) => option.value === row.size
                        ) || ""
                      }
                      onChange={(selectedOption) =>
                        handleSelectChange(index, selectedOption)
                      }
                      options={sizeOptions}
                      className="!tw-w-full"
                      placeholder="Select a size"
                      isDisabled={!subCategory || loading}
                      required={required}
                    />
                  </div>
                  {customFields &&
                    customFields.length > 0 &&
                    customFields.slice(0, 2).map((field, fieldIndex) => (
                      <div
                        key={fieldIndex}
                        className="tw-flex tw-flex-col tw-gap-2 tw-w-full"
                      >
                        <label>{titleize(field.replace(/_/g, " "))}</label>
                        <CustomInput
                          type="text"
                          name={field}
                          value={
                            row.customFields ? row.customFields[field] : ""
                          }
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={!sizeOptions.length || loading}
                          required={required}
                        />
                      </div>
                    ))}

                  {customFields &&
                    customFields.length > 0 &&
                    customFields.slice(2).map((field, fieldIndex) => (
                      <div
                        key={fieldIndex + 2}
                        className="tw-flex tw-flex-col tw-gap-2 tw-w-full"
                      >
                        <label>{titleize(field.replace(/_/g, " "))}</label>
                        <CustomInput
                          type="text"
                          name={field}
                          value={
                            row.customFields ? row.customFields[field] : ""
                          }
                          onChange={(e) => handleInputChange(index, e)}
                          disabled={!sizeOptions.length || loading}
                          required={required}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
      {subCategory && sizeOptions.length > 0 && (
        <button
          type="button"
          className="add-size-row"
          onClick={addSizeRow}
          disabled={!subCategory || loading}
        >
          + Add Size
        </button>
      )}
    </div>
  );
};

export default Category;
