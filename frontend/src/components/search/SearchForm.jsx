const SearchForm = ({
  query,
  products,
  dropdownOptions,
  handleInputChange,
  handleSearch,
  handleReset,
}) => (
  <form className="search-form-container">
    <div className="select-container">
      <select
        name="shopName"
        value={query.shopName}
        onChange={handleInputChange}
      >
        <option value="">Select Shop</option>
        {dropdownOptions.shopNames.map((shop) => (
          <option key={shop._id} value={shop.name}>
            {shop.name}
          </option>
        ))}
      </select>
    </div>

    <div className="select-container">
      <select
        name="categoryName"
        value={query.categoryName}
        onChange={handleInputChange}
      >
        <option value="">Select Category</option>
        {dropdownOptions.categoryNames.map((category) => (
          <option key={category._id} value={category.categoryName}>
            {category.categoryName}
          </option>
        ))}
      </select>
    </div>

    <div className="select-container">
      <select
        name="subcategoryName"
        value={query.subcategoryName}
        onChange={handleInputChange}
      >
        <option value="">Select Subcategory</option>
        {dropdownOptions.subcategoryNames.map((subcategory) => (
          <option key={subcategory._id} value={subcategory.subcategoryName}>
            {subcategory.subcategoryName}
          </option>
        ))}
      </select>
    </div>

    <div className="select-container">
      <select
        name="brandName"
        value={query.brandName}
        onChange={handleInputChange}
      >
        <option value="">Select Brand</option>
        {dropdownOptions.brandNames.map((brand) => (
          <option key={brand._id} value={brand.brandName}>
            {brand.brandName}
          </option>
        ))}
      </select>
    </div>

    <div className="select-container">
      <select
        name="customerCategory"
        value={query.customerCategory}
        onChange={handleInputChange}
      >
        <option value="">Select Demography</option>
        <option value="Ladies">Ladies</option>
        <option value="Gents">Gents</option>
        <option value="Kids">Kids</option>
      </select>
    </div>

    <div className="select-container">
      <select name="title" value={query.title} onChange={handleInputChange}>
        <option value="">Select Name </option>
        {products.map((product) => (
          <option key={product._id} value={product.title}>
            {product.title}
          </option>
        ))}
      </select>
    </div>

    <div className="button-container">
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleReset} type="button" className="reset-btn">
        Reset
      </button>
    </div>
  </form>
);

export default SearchForm;
