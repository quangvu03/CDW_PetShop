import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getPetsBySpecies, getAllSpecies, findPetByName } from '../../services/petService';
import { addPetToWishlist } from '../../services/wishlistService';
import { addToCart, getCartByUser } from '../../services/cartService';
import { toast } from 'react-toastify';
import ProductDetailModal from '../../components/user/home/ProductDetailModal';

const BACKEND_BASE_URL = 'http://localhost:8080';

// --- Hàm format giá ---
const formatPrice = (price) => {
  const numericPrice = Number(price);
  if (price === null || price === undefined || isNaN(numericPrice)) {
    return 'Liên hệ';
  }
  if (numericPrice >= 1000000) {
    return `${(numericPrice / 1000000).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} triệu đồng`;
  }
  return `${numericPrice.toLocaleString('vi-VN')} đồng`;
};

export default function ShopGrid() {
  // --- State ---
  const [filters, setFilters] = useState({
    price: '',
    sort: 'default',
  });
  const [speciesList, setSpeciesList] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [allPetsForSpecies, setAllPetsForSpecies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [speciesLoading, setSpeciesLoading] = useState(true);
  const [petsLoading, setPetsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [searchResultsCount, setSearchResultsCount] = useState(0); // State to store the count of search results
  const location = useLocation();

  const defaultImageUrl = '/assets/user/images/default-pet-placeholder.png';
  const ITEMS_PER_PAGE = 12;

  // --- Extract search query from URL ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 when search query changes
  }, [location.search]);

  // --- Xử lý submit form lọc ---
  const handleFilterChange = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setFilters({
      price: formData.get('price') || '',
      sort: formData.get('sort') || 'default',
    });
    setCurrentPage(1);
  };

  // --- useEffect: Lấy danh sách loài ---
  useEffect(() => {
    let isMounted = true;
    setSpeciesLoading(true);
    setError(null);
    getAllSpecies()
      .then((response) => {
        if (isMounted) {
          const fetchedSpecies = response.data || [];
          setSpeciesList(fetchedSpecies);
          if (!searchQuery) {
            setSelectedSpecies('all');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Lỗi tải danh sách loài:', err);
          setError('Không thể tải danh sách loài.');
          setSpeciesList([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setSpeciesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // --- useEffect: Lấy danh sách pet dựa trên loài hoặc tìm kiếm ---
  useEffect(() => {
    let isMounted = true;
    if (searchQuery || selectedSpecies) {
      setPetsLoading(true);
      setError(null);
      setAllPetsForSpecies([]);

      const fetchPets = async () => {
        try {
          let filteredPets = [];
          if (searchQuery) {
            // Fetch pets by search query
            const response = await findPetByName(searchQuery);
            filteredPets = Array.isArray(response.data) ? response.data : [];
            if (isMounted) {
              setSearchResultsCount(filteredPets.length); // Set the count of search results
            }
          } else if (selectedSpecies === 'all') {
            const speciesPromises = speciesList.map((species) => getPetsBySpecies(species));
            const speciesResponses = await Promise.all(speciesPromises);
            filteredPets = speciesResponses
              .flatMap((response) => (Array.isArray(response.data) ? response.data : []))
              .filter((pet) => pet !== null && pet !== undefined);
          } else {
            const response = await getPetsBySpecies(selectedSpecies);
            filteredPets = Array.isArray(response.data) ? response.data : [];
          }

          // Áp dụng bộ lọc giá
          if (filters.price === 'below_2') {
            filteredPets = filteredPets.filter((pet) => pet.price < 2000000);
          } else if (filters.price === '2_3_5') {
            filteredPets = filteredPets.filter((pet) => pet.price >= 2000000 && pet.price <= 3500000);
          } else if (filters.price === 'above_3_5') {
            filteredPets = filteredPets.filter((pet) => pet.price > 3500000);
          }

          // Áp dụng sắp xếp
          if (filters.sort === 'price_asc') {
            filteredPets.sort((a, b) => (a.price || 0) - (b.price || 0));
          } else if (filters.sort === 'price_desc') {
            filteredPets.sort((a, b) => (b.price || 0) - (a.price || 0));
          }

          if (isMounted) {
            setAllPetsForSpecies(filteredPets);
          }
        } catch (err) {
          if (isMounted) {
            console.error(`Lỗi tải thú cưng:`, err);
            setError(`Không thể tải danh sách thú cưng.`);
            setAllPetsForSpecies([]);
          }
        } finally {
          if (isMounted) {
            setPetsLoading(false);
          }
        }
      };

      if (selectedSpecies === 'all' && speciesList.length === 0 && !speciesLoading && !searchQuery) {
        setAllPetsForSpecies([]);
        setPetsLoading(false);
      } else {
        fetchPets();
      }
    } else {
      if (isMounted) {
        setAllPetsForSpecies([]);
        setPetsLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [selectedSpecies, filters.price, filters.sort, speciesList, speciesLoading, searchQuery]);

  // --- useEffect: Lấy giỏ hàng ---
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartByUser();
        setCartItems(data);
      } catch (err) {
        console.error('Lỗi khi lấy giỏ hàng:', err);
      }
    };
    fetchCart();
  }, []);

  // --- Tính toán currentPets ---
  const currentPets = useMemo(() => {
    if (!Array.isArray(allPetsForSpecies)) return [];
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return allPetsForSpecies.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, allPetsForSpecies]);

  // --- Tính totalPages ---
  const totalPages = useMemo(() => {
    if (!Array.isArray(allPetsForSpecies)) return 0;
    return Math.ceil(allPetsForSpecies.length / ITEMS_PER_PAGE);
  }, [allPetsForSpecies]);

  // --- Event Handlers ---
  const handleSpeciesChange = (species) => {
    if (species !== selectedSpecies) {
      setSelectedSpecies(species);
      setSearchQuery(''); // Clear search query when changing species
      setCurrentPage(1);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      const productContainer = document.getElementById('product-display-area');
      if (productContainer) {
        const headerOffset = 80;
        const elementPosition = productContainer.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  const handleOpenModal = (pet) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPet(null);
  };

  // --- Render Phân trang ---
  const renderPagination = () => {
    if (totalPages <= 1 || petsLoading) return null;
    const pageNumbersToShow = 3;
    let startPage = Math.max(1, currentPage - Math.floor(pageNumbersToShow / 2));
    let endPage = Math.min(totalPages, startPage + pageNumbersToShow - 1);
    if (totalPages >= pageNumbersToShow && endPage - startPage + 1 < pageNumbersToShow) {
      if (currentPage <= Math.floor(pageNumbersToShow / 2) + 1) {
        endPage = Math.min(totalPages, pageNumbersToShow);
      } else if (currentPage >= totalPages - Math.floor(pageNumbersToShow / 2)) {
        startPage = Math.max(1, totalPages - pageNumbersToShow + 1);
      } else {
        startPage = Math.max(1, endPage - pageNumbersToShow + 1);
      }
    }
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
      <div className="col-12">
        <nav aria-label="Page navigation" className="mt-4 d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous"
              >
                <span aria-hidden="true">«</span>
              </button>
            </li>
            {startPage > 1 && (
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(1)}>
                  1
                </button>
              </li>
            )}
            {startPage > 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            {pageNumbers.map((num) => (
              <li key={num} className={`page-item ${currentPage === num ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(num)}>
                  {num}
                </button>
              </li>
            ))}
            {endPage < totalPages - 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            {endPage < totalPages && (
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </button>
              </li>
            )}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next"
              >
                <span aria-hidden="true">»</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  // --- JSX Return ---
  return (
    <>
      <div className="breadcrumbs">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="bread-inner">
                <ul className="bread-list">
                  <li>
                    <Link to="/">Trang chủ<i className="ti-arrow-right"></i></Link>
                  </li>
                  <li className="active">
                    {searchQuery ? `Tìm kiếm: ${searchQuery}` : 'Lọc'}
                  </li>
                </ul>
                {searchQuery && (
                  <div className="text-muted mt-2">
                    ({searchResultsCount} kết quả dựa trên từ khóa "{searchQuery}")
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="product-area shop-sidebar shop section">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4 col-12">
              <div className="shop-sidebar">
                <form onSubmit={handleFilterChange}>
                  <div className="single-widget category">
                    <h3 className="title">Sắp xếp</h3>
                    <div className="sort-list">
                      <label className="d-flex align-items-center mb-2">
                        <input
                          type="radio"
                          name="sort"
                          value="default"
                          defaultChecked={filters.sort === 'default'}
                        />
                        <span className="ms-2">Liên quan</span>
                      </label>
                      <label className="d-flex align-items-center mb-2">
                        <input
                          type="radio"
                          name="sort"
                          value="price_asc"
                          defaultChecked={filters.sort === 'price_asc'}
                        />
                        <span className="ms-2">Giá tăng dần</span>
                      </label>
                      <label className="d-flex align-items-center mb-2">
                        <input
                          type="radio"
                          name="sort"
                          value="price_desc"
                          defaultChecked={filters.sort === 'price_desc'}
                        />
                        <span className="ms-2">Giá giảm dần</span>
                      </label>
                    </div>
                  </div>

                  <div className="single-widget range">
                    <h3 className="title">Mức giá</h3>
                    <ul className="check-box-list">
                      <li>
                        <label>
                          <input name="price" type="radio" value="below_2" defaultChecked={filters.price === 'below_2'} />
                          Dưới 2 triệu
                        </label>
                      </li>
                      <li>
                        <label>
                          <input name="price" type="radio" value="2_3_5" defaultChecked={filters.price === '2_3_5'} />
                          2 triệu - 3.5 triệu
                        </label>
                      </li>
                      <li>
                        <label>
                          <input
                            name="price"
                            type="radio"
                            value="above_3_5"
                            defaultChecked={filters.price === 'above_3_5'}
                          />
                          Hơn 3.5 triệu
                        </label>
                      </li>
                      <li>
                        <label>
                          <input name="price" type="radio" value="" defaultChecked={filters.price === ''} />
                          Mọi mức giá
                        </label>
                      </li>
                    </ul>
                  </div>

                  <button type="submit" className="btn" style={{ margin: 10 }}>
                    Lọc giá & Sắp xếp
                  </button>
                </form>
              </div>
            </div>
            {/* Product Area */}
            <div className="col-lg-9 col-md-8 col-12">
              <div className="product-area section p-3">
                <div className="container px-0">
                  <div className="row">
                    <div className="col-12">
                      <div className="product-info">
                        {/* Tabs Loài - Ẩn khi có searchQuery */}
                        {!searchQuery && (
                          <div className="nav-main">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                              {speciesLoading && (
                                <li className="nav-item">
                                  <span className="nav-link disabled">Đang tải loài...</span>
                                </li>
                              )}
                              {!speciesLoading && error && speciesList.length === 0 && (
                                <li className="nav-item">
                                  <span className="nav-link text-danger">{error}</span>
                                </li>
                              )}
                              {!speciesLoading && !error && speciesList.length === 0 && (
                                <li className="nav-item">
                                  <span className="nav-link disabled">Không có loài nào.</span>
                                </li>
                              )}
                              {!speciesLoading && !error && (
                                <>
                                  <li className="nav-item" role="presentation">
                                    <button
                                      className={`nav-link ${selectedSpecies === 'all' && !searchQuery ? 'active' : ''}`}
                                      id="all-tab"
                                      type="button"
                                      role="tab"
                                      aria-selected={selectedSpecies === 'all' && !searchQuery}
                                      onClick={() => handleSpeciesChange('all')}
                                      disabled={petsLoading || speciesLoading}
                                    >
                                      Tất cả
                                    </button>
                                  </li>
                                  {speciesList.map((species) => (
                                    <li key={species} className="nav-item" role="presentation">
                                      <button
                                        className={`nav-link ${selectedSpecies === species && !searchQuery ? 'active' : ''}`}
                                        id={`${species}-tab`}
                                        type="button"
                                        role="tab"
                                        aria-selected={selectedSpecies === species && !searchQuery}
                                        onClick={() => handleSpeciesChange(species)}
                                        disabled={petsLoading || speciesLoading}
                                      >
                                        {species}
                                      </button>
                                    </li>
                                  ))}
                                </>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Khu vực hiển thị sản phẩm */}
                        <div id="product-display-area" className="tab-content mt-4">
                          <div className="row" role="tabpanel">
                            {!speciesLoading && error && !petsLoading && (
                              <div className="col-12">
                                <div className="alert alert-danger my-4" role="alert">{error}</div>
                              </div>
                            )}

                            {petsLoading &&
                              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                                <div key={`skeleton-${index}`} className="col-xl-3 col-lg-4 col-md-4 col-12 mb-4">
                                  <div className="single-product skeleton-inline-card">
                                    <div className="skeleton skeleton-img"></div>
                                    <div className="skeleton-content">
                                      <div className="skeleton skeleton-text skeleton-title"></div>
                                      <div className="skeleton skeleton-text skeleton-price"></div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                            {!petsLoading && !error && currentPets.length > 0 && (
                              currentPets.map((pet) => {
                                let imageSource = defaultImageUrl;
                                if (pet && pet.imageUrl && typeof pet.imageUrl === 'string' && pet.imageUrl.trim() !== '') {
                                  const relativePath = pet.imageUrl.startsWith('/')
                                    ? pet.imageUrl.substring(1)
                                    : pet.imageUrl;
                                  imageSource = `${BACKEND_BASE_URL}/${relativePath}`;
                                }

                                return (
                                  <div key={pet.id} className="col-xl-3 col-lg-4 col-md-4 col-12 mb-4">
                                    <div className="single-product">
                                      <div className="product-img position-relative">
                                        <Link to={`/user/pet/${pet.id}`}>
                                          <img
                                            className="default-img"
                                            src={imageSource}
                                            alt={pet.name || 'Thú cưng'}
                                            loading="lazy"
                                            onError={(e) => {
                                              if (e.target.src !== defaultImageUrl) {
                                                e.target.onerror = null;
                                                e.target.src = defaultImageUrl;
                                              }
                                            }}
                                            style={{
                                              aspectRatio: '1 / 1',
                                              objectFit: 'cover',
                                              backgroundColor: '#f5f5f5',
                                            }}
                                          />
                                        </Link>

                                        <div
                                          className={`pet-status-overlay ${pet.status === 'available'
                                            ? 'status-available'
                                            : pet.status === 'pending'
                                              ? 'status-pending'
                                              : 'status-sold'
                                            }`}
                                        >
                                          {pet.status === 'available'
                                            ? 'Có sẵn'
                                            : pet.status === 'pending'
                                              ? 'Đang nhập'
                                              : 'Hết hàng'}
                                        </div>

                                        <div className="button-head">
                                          <div className="product-action">
                                            <a
                                              data-toggle="modal"
                                              title="Quick View"
                                              href="#"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleOpenModal(pet);
                                              }}
                                            >
                                              <i className="ti-eye"></i>
                                              <span>Xem chi tiết</span>
                                            </a>
                                            <a
                                              title="Wishlist"
                                              href="#"
                                              onClick={async (e) => {
                                                e.preventDefault();
                                                try {
                                                  await addPetToWishlist(pet.id);
                                                  toast.success('Đã thêm vào danh sách yêu thích!');
                                                } catch (err) {
                                                  if (err.response?.status === 409) {
                                                    toast.info(
                                                      err.response.data.message ||
                                                      'Sản phẩm đã có trong danh sách yêu thích.'
                                                    );
                                                  } else {
                                                    toast.error('Lỗi khi thêm vào danh sách yêu thích!');
                                                  }
                                                }
                                              }}
                                            >
                                              <i className="ti-heart"></i>
                                              <span>Yêu thích</span>
                                            </a>
                                          </div>
                                          <div className="product-action-2">
                                            <a
                                              title="Thêm vào giỏ hàng"
                                              href="#"
                                              onClick={async (e) => {
                                                e.preventDefault();
                                                try {
                                                  const existingItem = cartItems?.find(
                                                    (item) => item.pet?.id === pet.id
                                                  );
                                                  const currentQty = existingItem?.quantity || 0;
                                                  const stock = pet.quantity;

                                                  if (currentQty + 1 > stock) {
                                                    toast.warning('🚫 Số lượng vượt quá tồn kho!');
                                                    return;
                                                  }

                                                  await addToCart({ petId: pet.id, quantity: 1 });
                                                  window.dispatchEvent(new Event('cart-updated'));
                                                  toast.success('Đã thêm vào giỏ hàng!');

                                                  const updated = await getCartByUser();
                                                  setCartItems(updated);
                                                } catch (err) {
                                                  toast.error('Lỗi khi thêm vào giỏ hàng');
                                                }
                                              }}
                                            >
                                              Thêm vào giỏ hàng
                                            </a>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="product-content">
                                        <h3>
                                          <Link to={`/pet/${pet.id}`}>{pet.name || 'Chưa có tên'}</Link>
                                        </h3>
                                        <div className="product-price">
                                          <span>{formatPrice(pet.price)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}

                            {!petsLoading && !error && selectedSpecies && allPetsForSpecies.length === 0 && !speciesLoading && (
                              <div className="col-12 text-center my-5">
                                <p>
                                  {searchQuery
                                    ? `Không tìm thấy thú cưng nào cho từ khóa "${searchQuery}".`
                                    : `Không tìm thấy thú cưng nào thuộc danh mục "${selectedSpecies === 'all' ? 'Tất cả' : selectedSpecies}".`}
                                </p>
                              </div>
                            )}
                            {!petsLoading && !error && !selectedSpecies && speciesList.length > 0 && !speciesLoading && (
                              <div className="col-12 text-center my-5">
                                <p>Vui lòng chọn một danh mục để xem danh sách thú cưng.</p>
                              </div>
                            )}

                            {renderPagination()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductDetailModal isOpen={isModalOpen} onClose={handleCloseModal} pet={selectedPet} />
      </section>
    </>
  );
}