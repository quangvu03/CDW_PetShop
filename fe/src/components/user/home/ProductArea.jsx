import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getPetsBySpecies, getAllSpecies } from '../../../services/petService';
import { addPetToWishlist } from '../../../services/wishlistService';
import { addToCart, getCartByUser } from '../../../services/cartService';
import { toast } from 'react-toastify';
import ProductDetailModal from './ProductDetailModal';

const BACKEND_BASE_URL = 'http://localhost:8080';

// --- Dữ liệu pet giả định (di chuyển ra ngoài component) ---
const dummyPetData = {
    id: 999,
    name: 'Test Pet (Ảnh Thật)',
    species: 'Mèo',
    breed: 'Mèo Ta Mix',
    price: 1200000,
    gender: 'female',
    age: 12,
    color: 'Vàng Trắng',
    size: 'medium',
    origin: 'Việt Nam',
    description: 'Test hiển thị thumbnails với các ảnh thật từ internet. Click thumbnail để đổi ảnh chính.',
    imageUrl: 'https://picsum.photos/seed/maincat/600/600',
    imageUrls: [
        'https://picsum.photos/seed/catthumb1/600/600',
        'https://picsum.photos/seed/catthumb2/600/600',
        'https://picsum.photos/seed/catthumb3/600/600',
        'https://picsum.photos/seed/catthumb4/600/600',
        'https://picsum.photos/seed/catthumb5/600/600',
        '/uploads/pets/mèo_server_1.jpg'
    ],
};

// --- Hàm format giá ---
const formatPrice = (price, t) => {
    const numericPrice = Number(price);
    if (price === null || price === undefined || isNaN(numericPrice)) {
        return t('product_contact', { defaultValue: 'Liên hệ' });
    }
    if (numericPrice >= 1000000) {
        return `${(numericPrice / 1000000).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} triệu đồng`;
    }
    return `${numericPrice.toLocaleString('vi-VN')} đồng`;
};

// --- Số sản phẩm mỗi trang ---
const ITEMS_PER_PAGE = 8; // Hoặc 9, 12 tùy layout

export default function ProductArea() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [speciesList, setSpeciesList] = useState([]);
    const [selectedSpecies, setSelectedSpecies] = useState('');
    const [allPetsForSpecies, setAllPetsForSpecies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [speciesLoading, setSpeciesLoading] = useState(true);
    const [petsLoading, setPetsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(dummyPetData); // Sử dụng dummyPetData đã khai báo bên ngoài

    const defaultImageUrl = "/assets/user/images/default-pet-placeholder.png";

    // --- useEffect: Lấy danh sách loài ---
    useEffect(() => {
        let isMounted = true;
        setSpeciesLoading(true);
        setError(null);
        getAllSpecies()
            .then(response => {
                if (isMounted) {
                    const fetchedSpecies = response.data || [];
                    setSpeciesList(fetchedSpecies);
                    if (fetchedSpecies.length > 0 && !selectedSpecies) {
                        setSelectedSpecies(prevSelected => prevSelected || fetchedSpecies[0]);
                    } else if (fetchedSpecies.length === 0) {
                        setSelectedSpecies('');
                    }
                }
            })
            .catch(err => {
                if (isMounted) {
                    console.error("Lỗi tải danh sách loài:", err);
                    setError(t('product_error', { defaultValue: 'Không thể tải danh sách loài.' }));
                    setSpeciesList([]);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setSpeciesLoading(false);
                }
            });

        return () => { isMounted = false; };
    }, []);

    // --- useEffect: Lấy TOÀN BỘ Pet khi selectedSpecies THAY ĐỔI ---
    useEffect(() => {
        let isMounted = true;
        if (selectedSpecies) {
            setPetsLoading(true);
            setError(null);
            setAllPetsForSpecies([]);

            getPetsBySpecies(selectedSpecies)
                .then(response => {
                    if (isMounted) {
                        if (Array.isArray(response.data)) {
                            setAllPetsForSpecies(response.data);
                        } else {
                            console.error("API Lỗi định dạng: Cần trả về mảng!", response.data);
                            setError(t('product_error', { defaultValue: 'Lỗi định dạng dữ liệu từ máy chủ.' }));
                            setAllPetsForSpecies([]);
                        }
                    }
                })
                .catch(err => {
                    if (isMounted) {
                        console.error(`Lỗi tải thú cưng cho loài ${selectedSpecies}:`, err);
                        setError(t('product_error', { defaultValue: 'Không thể tải danh sách thú cưng.' }));
                        setAllPetsForSpecies([]);
                    }
                })
                .finally(() => {
                    if (isMounted) {
                        setPetsLoading(false);
                    }
                });
        } else {
            if (isMounted) {
                setAllPetsForSpecies([]);
                setPetsLoading(false);
            }
        }
        return () => { isMounted = false; };
    }, [selectedSpecies]);

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

    // --- Tính toán currentPets (Client-Side) ---
    const currentPets = useMemo(() => {
        if (!Array.isArray(allPetsForSpecies)) return [];
        const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
        return allPetsForSpecies.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, allPetsForSpecies]);

    // --- Tính totalPages (Client-Side) ---
    const totalPages = useMemo(() => {
        if (!Array.isArray(allPetsForSpecies)) return 0;
        return Math.ceil(allPetsForSpecies.length / ITEMS_PER_PAGE);
    }, [allPetsForSpecies]);

    // --- Event Handlers ---
    const handleSpeciesChange = (species) => {
        if (species !== selectedSpecies) {
            setSelectedSpecies(species);
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
        if (totalPages >= pageNumbersToShow && (endPage - startPage + 1) < pageNumbersToShow) {
            if (currentPage <= Math.floor(pageNumbersToShow / 2) + 1) { endPage = Math.min(totalPages, pageNumbersToShow); }
            else if (currentPage >= totalPages - Math.floor(pageNumbersToShow / 2)) { startPage = Math.max(1, totalPages - pageNumbersToShow + 1); }
            else { startPage = Math.max(1, endPage - pageNumbersToShow + 1); }
        }
        const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

        return (
            <div className="col-12">
                <nav aria-label="Page navigation" className="mt-4 d-flex justify-content-center">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous">
                                <span aria-hidden="true">«</span>
                            </button>
                        </li>
                        {startPage > 1 && <li className="page-item"><button className="page-link" onClick={() => handlePageChange(1)}>1</button></li>}
                        {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                        {pageNumbers.map(num => (
                            <li key={num} className={`page-item ${currentPage === num ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(num)}>{num}</button>
                            </li>
                        ))}
                        {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                        {endPage < totalPages && <li className="page-item"><button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button></li>}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next">
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
        <div className="product-area section">
            <div className="container">
                {/* === Tiêu đề === */}
                <div className="row">
                    <div className="col-12">
                        <div className="section-title">
                            <h2>{t('product_hot_pets', { defaultValue: 'Thú cưng hot' })}</h2>
                        </div>
                    </div>
                </div>

                {/* === Phần chính: Tabs và Sản phẩm === */}
                <div className="row">
                    <div className="col-12">
                        <div className="product-info">
                            {/* --- Tabs Loài --- */}
                            <div className="nav-main">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    {speciesLoading && (<li className="nav-item"><span className="nav-link disabled">{t('product_loading_species', { defaultValue: 'Đang tải loài...' })}</span></li>)}
                                    {!speciesLoading && error && speciesList.length === 0 && (<li className="nav-item"><span className="nav-link text-danger">{error}</span></li>)}
                                    {!speciesLoading && !error && speciesList.length === 0 && (<li className="nav-item"><span className="nav-link disabled">{t('product_no_species', { defaultValue: 'Không có loài nào.' })}</span></li>)}
                                    {!speciesLoading && !error && speciesList.length > 0 && (
                                        speciesList.map(species => (
                                            <li key={species} className="nav-item" role="presentation">
                                                <button
                                                    className={`nav-link ${selectedSpecies === species ? 'active' : ''}`}
                                                    id={`${species}-tab`}
                                                    type="button"
                                                    role="tab"
                                                    aria-selected={selectedSpecies === species}
                                                    onClick={() => handleSpeciesChange(species)}
                                                    disabled={petsLoading || speciesLoading}
                                                >
                                                    {species}
                                                </button>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>

                            {/* --- Khu vực hiển thị sản phẩm --- */}
                            <div id="product-display-area" className="tab-content mt-4">
                                <div className="row" role="tabpanel">
                                    {/* 1. Hiển thị lỗi fetch pet */}
                                    {!speciesLoading && error && !petsLoading && (
                                        <div className="col-12">
                                            <div className="alert alert-danger my-4" role="alert">{error}</div>
                                        </div>
                                    )}

                                    {/* 2. Hiển thị Skeleton Inline khi đang tải PETS */}
                                    {petsLoading && (
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
                                        ))
                                    )}

                                    {/* 3. Hiển thị Sản phẩm thật */}
                                    {!petsLoading && !error && currentPets.length > 0 && (
                                        currentPets.map(pet => {
                                            let imageSource = defaultImageUrl;
                                            if (pet && pet.imageUrl && typeof pet.imageUrl === 'string' && pet.imageUrl.trim() !== '') {
                                                const relativePath = pet.imageUrl.startsWith('/') ? pet.imageUrl.substring(1) : pet.imageUrl;
                                                imageSource = `${BACKEND_BASE_URL}/${relativePath}`;
                                            }

                                            return (
                                                <div key={pet.id} className="col-xl-3 col-lg-4 col-md-4 col-12 mb-4">
                                                    <div className="single-product">
                                                        <div className="product-img position-relative">
                                                            <a href={`/user/pet/${pet.id}`}>
                                                                <img
                                                                    className="default-img"
                                                                    src={imageSource}
                                                                    alt={pet.name || t('unknown', { defaultValue: 'Thú cưng' })}
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
                                                            </a>

                                                            <div
                                                                className={`pet-status-overlay ${pet.status === 'available'
                                                                        ? 'status-available'
                                                                        : pet.status === 'pending'
                                                                            ? 'status-pending'
                                                                            : 'status-sold'
                                                                    }`}
                                                            >
                                                                {pet.status === 'available'
                                                                    ? t('product_available', { defaultValue: 'Có sẵn' })
                                                                    : pet.status === 'pending'
                                                                        ? t('product_pending', { defaultValue: 'Đang nhập' })
                                                                        : t('product_sold_out', { defaultValue: 'Hết hàng' })}
                                                            </div>

                                                            <div className="button-head">
                                                                <div className="product-action">
                                                                    <a
                                                                        data-toggle="modal"
                                                                        title={t('product_quick_view', { defaultValue: 'Quick View' })}
                                                                        href="#"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            handleOpenModal(pet);
                                                                        }}
                                                                    >
                                                                        <i className="ti-eye"></i><span>{t('product_quick_view', { defaultValue: 'Xem chi tiết' })}</span>
                                                                    </a>
                                                                    <a
                                                                        title={t('product_wishlist', { defaultValue: 'Wishlist' })}
                                                                        href="#"
                                                                        onClick={async (e) => {
                                                                            e.preventDefault();
                                                                            try {
                                                                                await addPetToWishlist(pet.id);
                                                                                toast.success(t('product_added_to_wishlist', { defaultValue: 'Đã thêm vào danh sách yêu thích!' }));
                                                                            } catch (err) {
                                                                                if (err.response?.status === 409) {
                                                                                    toast.info(t('product_already_in_wishlist', { defaultValue: 'Sản phẩm đã có trong danh sách yêu thích.' }));
                                                                                } else {
                                                                                    toast.error(t('product_wishlist_error', { defaultValue: 'Lỗi khi thêm vào danh sách yêu thích!' }));
                                                                                }
                                                                            }
                                                                        }}
                                                                    >
                                                                        <i className="ti-heart"></i><span>{t('product_wishlist', { defaultValue: 'Yêu thích' })}</span>
                                                                    </a>
                                                                </div>
                                                                <div className="product-action-2">
                                                                    <a
                                                                        title={t('product_add_to_cart', { defaultValue: 'Thêm vào giỏ hàng' })}
                                                                        href="#"
                                                                        onClick={async (e) => {
                                                                            e.preventDefault();
                                                                            try {
                                                                                const existingItem = cartItems?.find((item) => item.pet?.id === pet.id);
                                                                                const currentQty = existingItem?.quantity || 0;
                                                                                const stock = pet.quantity;

                                                                                if (currentQty + 1 > stock) {
                                                                                    toast.warning(t('product_cart_out_of_stock', { defaultValue: 'Số lượng vượt quá tồn kho!' }));
                                                                                    return;
                                                                                }

                                                                                await addToCart({ petId: pet.id, quantity: 1 });
                                                                                window.dispatchEvent(new Event('cart-updated'));
                                                                                toast.success(t('product_cart_added', { defaultValue: 'Đã thêm vào giỏ hàng!' }));

                                                                                const updated = await getCartByUser();
                                                                                setCartItems(updated);
                                                                            } catch (err) {
                                                                                toast.error(t('product_cart_error', { defaultValue: 'Lỗi khi thêm vào giỏ hàng' }));
                                                                            }
                                                                        }}
                                                                    >
                                                                        {t('product_add_to_cart', { defaultValue: 'Thêm vào giỏ hàng' })}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="product-content">
                                                            <h3><a href={`/pet/${pet.id}`}>{pet.name || t('unknown', { defaultValue: 'Chưa có tên' })}</a></h3>
                                                            <div className="product-price">
                                                                <span>{formatPrice(pet.price, t)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}

                                    {/* 4. Thông báo không có sản phẩm */}
                                    {!petsLoading && !error && currentPets.length === 0 && !speciesLoading && (
                                        <div className="col-12 text-center my-5">
                                            <p>{t('product_no_pets', { defaultValue: 'Không tìm thấy thú cưng nào thuộc loài \"{selectedSpecies}\".', selectedSpecies })}</p>
                                        </div>
                                    )}
                                    {/* 5. Thông báo khi chưa chọn loài */}
                                    {!petsLoading && !error && !selectedSpecies && speciesList.length > 0 && !speciesLoading && (
                                        <div className="col-12 text-center my-5">
                                            <p>{t('product_select_species', { defaultValue: 'Vui lòng chọn một loài để xem danh sách thú cưng.' })}</p>
                                        </div>
                                    )}

                                    {/* --- Render Phân Trang --- */}
                                    {renderPagination()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ProductDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                pet={selectedPet}
            />
        </div>
    );
}