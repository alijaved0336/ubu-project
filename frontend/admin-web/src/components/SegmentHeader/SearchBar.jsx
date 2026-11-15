import "./SearchBar.less";

const SearchBar = ({ searchTerm, onSearchChange, ParentName }) => {
  return (
    <div className="SearchBar">
      <input
        type="text"
        placeholder={`🔍 Search ${ParentName}...`}
        value={searchTerm}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default SearchBar;
