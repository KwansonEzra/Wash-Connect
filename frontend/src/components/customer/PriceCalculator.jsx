
const PriceCalculator = ({ items, onQtyChange }) => {
  // item.category may be a populated { _id, name, ... } object or a plain
  // id string depending on where this data came from - normalize to an id
  // for grouping, while keeping the object around for its display name.
  const getCategoryId = (item) => item.category?._id || item.category;
  const getCategoryName = (item) => item.category?.name || 'Other';

  const categories = {};
  items.forEach((item) => {
    const key = getCategoryId(item);
    if (!categories[key]) {
      categories[key] = { name: getCategoryName(item), items: [] };
    }
    categories[key].items.push(item);
  });

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([categoryId, { name, items: categoryItems }]) => (
        <div key={categoryId} className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">{name} Services</h3>
          <div className="space-y-3">
            {categoryItems.map((item) => (
              <div key={`${categoryId}-${item.itemKey}`} className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-gray-700">{item.label || item.itemKey}</span>
                  <span className="text-gray-500 ml-2">(NGN {item.unitPrice} per unit)</span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => onQtyChange(items.indexOf(item), item.qty - 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={item.qty}
                    onChange={(e) => onQtyChange(items.indexOf(item), parseInt(e.target.value) || 0)}
                    className="h-8 w-16 border-y border-gray-300 text-center text-gray-700 focus:outline-none"
                  />
                  <button
                    onClick={() => onQtyChange(items.indexOf(item), item.qty + 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
                  >
                    +
                  </button>
                  <span className="ml-3 text-gray-700 font-medium">
                    NGN {(item.qty * item.unitPrice).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PriceCalculator;