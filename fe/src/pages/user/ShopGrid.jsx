import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPetsBySpecies, getAllSpecies, findPetByName } from '../../services/petService';
import { addPetToWishlist } from '../../services/wishlistService';
import { addToCart, getCartByUser } from '../../services/cartService';
import { toast } from 'react-toastify';
import ProductDetailModal from '../../components/user/home/ProductDetailModal';

const BACKEND_BASE_URL = 'http://localhost:8080';

const formatPrice = (price, t) => {
  const numericPrice = Number(price);
  if (price === null || price === undefined || isNaN(numericPrice)) {
    return t('shop_contact_price', { defaultValue: 'Liên hệ' });
  }
  if (numericPrice >= 1000000) {
    return `${(numericPrice / 1000000).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${t('shop_million', { defaultValue: 'triệu đồng' })}`;
  }
  return `${numericPrice.toLocaleString('vi-VN')} ${t('shop_vnd', { defaultValue: 'đồng' })}`;
};

export default function ShopGrid() {
  const { t } = useTranslation();
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsCount, setSearchResultsCount] = useState(0);
  const location = useLocation();

  const defaultImageUrl = '/assets/user/images/default-pet-placeholder.png';
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
    setCurrentPage(1);
  }, [location.search]);

  const handleFilterChange = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setFilters({
      price: formData.get('price') || '',
      sort: formData.get('sort') || 'default',
    });
    setCurrentPage(1);
  };

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
          setError(t('shop_species_error', { defaultValue: 'Không thể tải danh sách loài.' }));
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
            const response = await findPetByName(searchQuery);
            filteredPets = Array.isArray(response.data) ? response.data : [];
            if (isMounted) {
              setSearchResultsCount(filteredPets.length);
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

          if (filters.price === 'below_2') {
            filteredPets = filteredPets.filter((pet) => pet.price < 2000000);
          } else if (filters.price === '2_3_5') {
            filteredPets = filteredPets.filter((pet) => pet.price >= 2000000 && pet.price <= 3500000);
          } else if (filters.price === 'above_3_5') {
            filteredPets = filteredPets.filter((pet) => pet.price > 3500000);
          }

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
            setError(t('shop_pets_error', { defaultValue: 'Không thể tải danh sách thú cưng.' }));
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

  const currentPets = useMemo(() => {
    if (!Array.isArray(allPetsForSpecies)) return [];
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return allPetsForSpecies.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, allPetsForSpecies]);

  const totalPages = useMemo(() => {
    if (!Array.isArray(allPetsForSpecies)) return 0;
    return Math.ceil(allPetsForSpecies.length / ITEMS_PER_PAGE);
  }, [allPetsForSpecies]);

  const handleSpeciesChange = (species) => {
    if (species !== selectedSpecies) {
      setSelectedSpecies(species);
      setSearchQuery('');
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
                aria-label={t('shop_previous', { defaultValue: 'Previous' })}
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
                aria-label={t('shop_next', { defaultValue: 'Next' })}
              >
                <span aria-hidden="true">»</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <>
      <div className="breadcrumbs">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="bread-inner">
                <ul className="bread-list">
                  <li>
                    <Link to="/">
                      {t('shop_home', { defaultValue: 'Trang chủ' })}
                      <i className="ti-arrow-right"></i>
                    </Link>
                  </li>
                  <li className="active">
                    {searchQuery
                      ? `${t('shop_search_results_prefix', { defaultValue: 'Tìm kiếm: ' })}${searchQuery}`
                      : t('shop_filter', { defaultValue: 'Lọc' })}
                  </li>
                </ul>
                {searchQuery && (
                  <div className="text-muted mt-2">
                    ({searchResultsCount}{" "}
                    {t('shop_results_count_suffix', { defaultValue: 'kết quả dựa trên từ khóa' })} "{searchQuery}")
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
            <div className="col-lg-3 col-md-4 col-12">
              <div className="shop-sidebar">
                <form onSubmit={handleFilterChange}>
                  <div className="single-widget category">
                    <h3 className="title">{t('shop_sort_title', { defaultValue: 'Sắp xếp' })}</h3>
                    <div className="sort-list">
                      <label className="d-flex align-items-center mb-2">
                        <input
                          type="radio"
                          name="sort"
                          value="default"
                          defaultChecked={filters.sort === 'default'}
                        />
                        <span className="ms-2">{t('shop_sort_relevance', { defaultValue: 'Liên quan' })}</span>
                      </label>
                      <label className="d-flex align-items-center mb-2">
                        <input
                          type="radio"
                          name="sort"
                          value="price_asc"
                          defaultChecked={filters.sort === 'price_asc'}
                        />
                        <span className="ms-2">{t('shop_sort_price_asc', { defaultValue: 'Giá tăng dần' })}</span>
                      </label>
                      <label className="d-flex align-items-center mb-2">
                        <input
                          type="radio"
                          name="sort"
                          value="price_desc"
                          defaultChecked={filters.sort === 'price_desc'}
                        />
                        <span className="ms-2">{t('shop_sort_price_desc', { defaultValue: 'Giá giảm dần' })}</span>
                      </label>
                    </div>
                  </div>

                  <div className="single-widget range">
                    <h3 className="title">{t('shop_price_title', { defaultValue: 'Mức giá' })}</h3>
                    <ul className="check-box-list">
                      <li>
                        <label>
                          <input name="price" type="radio" value="below_2" defaultChecked={filters.price === 'below_2'} />
                          {t('shop_price_below_2', { defaultValue: 'Dưới 2 triệu' })}
                        </label>
                      </li>
                      <li>
                        <label>
                          <input name="price" type="radio" value="2_3_5" defaultChecked={filters.price === '2_3_5'} />
                          {t('shop_price_2_3_5', { defaultValue: '2 triệu - 3.5 triệu' })}
                        </label>
                      </li>
                      <li>
                        <label>
                          <input name="price" type="radio" value="above_3_5" defaultChecked={filters.price === 'above_3_5'} />
                          {t('shop_price_above_3_5', { defaultValue: 'Hơn 3.5 triệu' })}
                        </label>
                      </li>
                      <li>
                        <label>
                          <input name="price" type="radio" value="" defaultChecked={filters.price === ''} />
                          {t('shop_price_all', { defaultValue: 'Mọi mức giá' })}
                        </label>
                      </li>
                    </ul>
                  </div>

                  <button type="submit" className="btn" style={{ margin: 10 }}>
                    {t('shop_filter_button', { defaultValue: 'Lọc giá & Sắp xếp' })}
                  </button>
                </form>
              </div>
            </div>
            <div className="col-lg-9 col-md-8 col-12">
              <div className="product-area section p-3">
                <div className="container px-0">
                  <div className="row">
                    <div className="col-12">
                      <div className="product-info">
                        {!searchQuery && (
                          <div className="nav-main">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                              {speciesLoading && (
                                <li className="nav-item">
                                  <span className="nav-link disabled">{t('shop_loading_species', { defaultValue: 'Đang tải loài...' })}</span>
                                </li>
                              )}
                              {!speciesLoading && error && speciesList.length === 0 && (
                                <li className="nav-item">
                                  <span className="nav-link text-danger">{error}</span>
                                </li>
                              )}
                              {!speciesLoading && !error && speciesList.length === 0 && (
                                <li className="nav-item">
                                  <span className="nav-link disabled">{t('shop_no_species', { defaultValue: 'Không có loài nào.' })}</span>
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
                                      {t('shop_all', { defaultValue: 'Tất cả' })}
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
                                            alt={pet.name || t('shop_pet_alt', { defaultValue: 'Thú cưng' })}
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
                                            ? t('shop_available', { defaultValue: 'Có sẵn' })
                                            : pet.status === 'pending'
                                              ? t('shop_pending', { defaultValue: 'Đang nhập' })
                                              : t('shop_sold_out', { defaultValue: 'Hết hàng' })}
                                        </div>

                                        <div className="button-head">
                                          <div className="product-action">
                                            <a
                                              data-toggle="modal"
                                              title={t('shop_quick_view', { defaultValue: 'Quick View' })}
                                              href="#"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleOpenModal(pet);
                                              }}
                                            >
                                              <i className="ti-eye"></i>
                                              <span>{t('shop_quick_view', { defaultValue: 'Xem chi tiết' })}</span>
                                            </a>
                                            <a
                                              title={t('shop_wishlist', { defaultValue: 'Wishlist' })}
                                              href="#"
                                              onClick={async (e) => {
                                                e.preventDefault();
                                                try {
                                                  await addPetToWishlist(pet.id);
                                                  toast.success(t('shop_wishlist_added', { defaultValue: 'Đã thêm vào danh sách yêu thích!' }));
                                                } catch (err) {
                                                  if (err.response?.status === 409) {
                                                    toast.info(
                                                      t('shop_wishlist_exists', { defaultValue: 'Sản phẩm đã có trong danh sách yêu thích.' })
                                                    );
                                                  } else {
                                                    toast.error(t('shop_wishlist_error', { defaultValue: 'Lỗi khi thêm vào danh sách yêu thích!' }));
                                                  }
                                                }
                                              }}
                                            >
                                              <i className="ti-heart"></i>
                                              <span>{t('shop_wishlist', { defaultValue: 'Yêu thích' })}</span>
                                            </a>
                                          </div>
                                          <div className="product-action-2">
                                            <a
                                              title={t('shop_add_to_cart', { defaultValue: 'Thêm vào giỏ hàng' })}
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
                                                    toast.warning(t('shop_out_of_stock', { defaultValue: '🚫 Số lượng vượt quá tồn kho!' }));
                                                    return;
                                                  }

                                                  await addToCart({ petId: pet.id, quantity: 1 });
                                                  window.dispatchEvent(new Event('cart-updated'));
                                                  toast.success(t('shop_cart_added', { defaultValue: 'Đã thêm vào giỏ hàng!' }));

                                                  const updated = await getCartByUser();
                                                  setCartItems(updated);
                                                } catch (err) {
                                                  toast.error(t('shop_cart_error', { defaultValue: 'Lỗi khi thêm vào giỏ hàng' }));
                                                }
                                              }}
                                            >
                                              {t('shop_add_to_cart', { defaultValue: 'Thêm vào giỏ hàng' })}
                                            </a>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="product-content">
                                        <h3>
                                          <Link to={`/pet/${pet.id}`}>{pet.name || t('shop_unnamed', { defaultValue: 'Chưa có tên' })}</Link>
                                        </h3>
                                        <div className="product-price">
                                          <span>{formatPrice(pet.price, t)}</span>
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
                                    ? t('shop_no_search_results', { defaultValue: 'Không tìm thấy thú cưng nào cho từ khóa "{searchQuery}".', searchQuery: searchQuery })
                                    : `${t('shop_no_pets', { defaultValue: 'No pets found in category .' })} ${selectedSpecies === 'all' ? t('shop_all', { defaultValue: 'Tất cả' }) : selectedSpecies}`}
                                </p>
                              </div>
                            )}
                            {!petsLoading && !error && !selectedSpecies && speciesList.length > 0 && !speciesLoading && (
                              <div className="col-12 text-center my-5">
                                <p>{t('shop_select_category', { defaultValue: 'Vui lòng chọn một danh mục để xem danh sách thú cưng.' })}</p>
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