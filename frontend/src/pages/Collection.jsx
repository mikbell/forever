import React, { useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams to get the 'q' parameter
import { ShopContext } from "../context/ShopContext";
import { ChevronDownIcon, XIcon as CloseIcon, FilterIcon } from "lucide-react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import Button from '../components/Button';

// --- Static Data ---
const filterableCategories = [
  { id: 'cat-men', value: 'Men', label: 'Uomo' },
  { id: 'cat-women', value: 'Women', label: 'Donna' },
  { id: 'cat-kids', value: 'Kids', label: 'Bambini' },
];

const filterableTypes = [
  { id: 'type-topwear', value: 'Topwear', label: 'Maglieria e Top' },
  { id: 'type-bottomwear', value: 'Bottomwear', label: 'Pantaloni e Gonne' },
  { id: 'type-winterwear', value: 'Winterwear', label: 'Capispalla Invernali' },
  { id: 'type-accessories', value: 'Accessories', label: 'Accessori' },
];

const sortOptions = [
  { value: "relevant", label: "Rilevanza" },
  { value: "newest", label: "Nuovi Arrivi" },
  { value: "lowest", label: "Prezzo: Dal più basso" },
  { value: "highest", label: "Prezzo: Dal più alto" },
];

// --- FilterGroup Component (Nested) ---
const FilterGroup = ({ title, options, selectedValues, onFilterChange }) => (
  <fieldset className="py-5 first:pt-0"> {/* Adjusted padding */}
    <legend className="text-sm font-bold uppercase text-gray-800 mb-4 px-1">{title}</legend> {/* Stronger heading */}
    <div className="space-y-3"> {/* Increased space */}
      {options.map(option => (
        <div key={option.id} className="flex items-center">
          <input
            id={option.id}
            name={title.toLowerCase()} // Use lower-case name for better HTML semantics
            type="checkbox"
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => onFilterChange(option.value)}
            className="
                            h-4 w-4 text-blue-600 border-gray-300 rounded
                            focus:ring-blue-500 focus:ring-offset-0 cursor-pointer
                            transition-colors duration-200 ease-in-out
                        "
          />
          <label htmlFor={option.id} className="ml-3 text-sm text-gray-700 hover:text-blue-600 cursor-pointer select-none">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  </fieldset>
);

// --- Collection Component ---
const Collection = () => {
  const { products } = useContext(ShopContext); // Removed `search`, `showSearch` from context directly as `useSearchParams` will handle it
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [currentSortOption, setCurrentSortOption] = useState(sortOptions[0].value);
  const [searchParams] = useSearchParams(); // Get URL search parameters
  const initialSearchTerm = searchParams.get('q') || ''; // Get the initial search term from URL

  useEffect(() => {
  }, [initialSearchTerm]);

  const handleCategoryChange = useCallback((categoryValue) => {
    setSelectedCategories(prev =>
      prev.includes(categoryValue) ? prev.filter(c => c !== categoryValue) : [...prev, categoryValue]
    );
  }, []);

  const handleTypeChange = useCallback((typeValue) => {
    setSelectedTypes(prev =>
      prev.includes(typeValue) ? prev.filter(t => t !== typeValue) : [...prev, typeValue]
    );
  }, []);

  const resetAllFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setCurrentSortOption(sortOptions[0].value); // Reset sort option too
    // Optionally, if you want to clear URL search param:
    // navigate('/collection'); // Requires `useNavigate`
  }, []);

  const processedProducts = useMemo(() => {
    if (!products) return [];
    let tempProducts = [...products];

    // Apply filters
    if (selectedCategories.length > 0) {
      tempProducts = tempProducts.filter(product =>
        product.category && selectedCategories.includes(product.category)
      );
    }

    if (selectedTypes.length > 0) {
      tempProducts = tempProducts.filter(product =>
        product.type && selectedTypes.includes(product.type)
      );
    }

    // Apply search term from URL
    if (initialSearchTerm) {
      const searchTermLower = initialSearchTerm.toLowerCase();
      tempProducts = tempProducts.filter(item =>
        item.name.toLowerCase().includes(searchTermLower) ||
        (item.description && item.description.toLowerCase().includes(searchTermLower))
        // You might add other fields like `tags` here if they exist
      );
    }

    // Apply sorting
    switch (currentSortOption) {
      case 'lowest':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'highest':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming products have a `createdAt` or similar field
        tempProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'relevant':
      default:
        // No specific sorting for 'relevant' if no algorithm is defined
        break;
    }
    return tempProducts;
  }, [products, selectedCategories, selectedTypes, currentSortOption, initialSearchTerm]);

  // Close mobile filter panel if screen resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isMobileFilterOpen) { // Tailwind's `sm` breakpoint
        setIsMobileFilterOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileFilterOpen]);

  // Close mobile filter when route changes (e.g., from search)
  useEffect(() => {
    setIsMobileFilterOpen(false);
  }, [initialSearchTerm, selectedCategories, selectedTypes, currentSortOption, products]); // Close if search term changes

  const filterPanelContent = (
    <div className="divide-y divide-gray-200">
      <FilterGroup title="Categorie" options={filterableCategories} selectedValues={selectedCategories} onFilterChange={handleCategoryChange} />
      <FilterGroup title="Tipologia" options={filterableTypes} selectedValues={selectedTypes} onFilterChange={handleTypeChange} />
      {(selectedCategories.length > 0 || selectedTypes.length > 0 || initialSearchTerm) && ( // Show reset if any filter is active
        <div className="pt-6">
          <Button onClick={resetAllFilters} variant="outline" fullWidth size="sm" className="font-semibold text-sm">
            Resetta Filtri
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className='container mx-auto px-4 py-8 md:py-12 relative'> {/* Added container, padding, and relative for mobile filter */}
      <div className='flex flex-col sm:flex-row gap-6 md:gap-8'> {/* Reduced gap for better flow */}

        {/* Filters Sidebar (Desktop & Mobile Toggle) */}
        <aside className='w-full sm:w-56 md:w-64 lg:w-72 shrink-0'>
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FilterIcon className="w-5 h-5 mr-2 text-gray-600" />
              Filtri
            </h2>
            <button
              onClick={() => setIsMobileFilterOpen(prev => !prev)}
              className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              aria-expanded={isMobileFilterOpen}
              aria-controls="filter-panel-mobile"
              aria-label={isMobileFilterOpen ? "Chiudi filtri" : "Apri filtri"}
            >
              {isMobileFilterOpen ? <CloseIcon className="h-5 w-5" /> : <FilterIcon className="h-5 w-5" />}
            </button>
          </div>

          {/* Filters for Desktop */}
          <div className="hidden sm:block pt-5">
            {filterPanelContent}
          </div>

          {/* Mobile Filter Panel (Slide-in Sidebar) */}
          <div
            id="filter-panel-mobile"
            className={`
                            fixed inset-y-0 right-0 z-50 w-64 sm:w-72 bg-white shadow-2xl
                            transform transition-transform duration-300 ease-in-out
                            sm:hidden
                            ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}
                        `}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-panel-title"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 id="filter-panel-title" className="text-lg font-semibold text-gray-800 flex items-center">
                <FilterIcon className="w-5 h-5 mr-2 text-gray-600" />
                Filtra Prodotti
              </h2>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Chiudi filtri"
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
              >
                <CloseIcon className='w-6 h-6 text-gray-600' />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]"> {/* Adjust height for scrollable content */}
              {filterPanelContent}
              <Button onClick={() => setIsMobileFilterOpen(false)} fullWidth className="mt-6 text-base">
                Applica Filtri
              </Button>
            </div>
          </div>
          {/* Overlay for mobile filter */}
          {isMobileFilterOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-40 sm:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
              aria-hidden="true"
            ></div>
          )}
        </aside>

        {/* Products and Sorting */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 pb-4 border-b border-gray-200">
            <Title text1={"La Nostra"} text2={"Collezione"} as="h1" className="text-2xl md:text-3xl lg:text-4xl" /> {/* Larger title */}

            <div className="relative w-full sm:w-auto"> {/* Added relative for custom select arrow */}
              <label htmlFor="sort-options" className="text-sm text-gray-600 sr-only">Ordina per:</label>
              <select
                id="sort-options"
                value={currentSortOption}
                onChange={(e) => setCurrentSortOption(e.target.value)}
                className="
                                    block w-full text-sm border border-gray-300 rounded-md
                                    px-3 py-2 pr-10 focus:ring-blue-500 focus:border-blue-500
                                    appearance-none bg-white cursor-pointer transition-colors duration-200
                                "
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="h-5 w-5" />
              </div>
            </div>
          </div>

          {initialSearchTerm && (
            <p className="text-base text-gray-700 mb-6 font-medium">
              Risultati per: "<span className="font-semibold text-blue-600">{initialSearchTerm}</span>"
              {selectedCategories.length > 0 || selectedTypes.length > 0 ? (
                <span className="text-gray-500"> (filtri applicati)</span>
              ) : null}
            </p>
          )}


          {processedProducts.length > 0 ? (
            <>
              <p className="text-sm text-gray-600 mb-6">
                Mostrando <span className="font-semibold">{processedProducts.length}</span> di <span className="font-semibold">{products?.length || 0}</span> prodotti
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-12"> {/* Adjusted grid for more columns on larger screens */}
                {processedProducts.map((item) => (
                  <ProductItem
                    key={item._id}
                    id={item._id}
                    images={item.images}
                    name={item.name}
                    price={item.price}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 sm:py-24 bg-gray-50 rounded-lg border border-gray-200 mt-8"> {/* Added background and border */}
              {/* Assumi che /images/empty-search.svg sia un path valido per la tua immagine */}
              <img src="/images/no-results.svg" alt="Nessun prodotto trovato" className="mx-auto h-24 w-24 text-gray-400 mb-6 opacity-80" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Ops! Nessun prodotto trovato.</h3>
              <p className="text-md text-gray-600 mb-8 max-w-sm mx-auto">
                Prova a modificare i filtri, a rimuovere il termine di ricerca o a resettare tutto.
              </p>
              <Button onClick={resetAllFilters} variant="primary" size="md" className="font-semibold">
                Resetta Tutti i Filtri
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Collection;