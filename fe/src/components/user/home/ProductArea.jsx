import React, { useState, useEffect, useMemo } from 'react';
// 1. Đảm bảo đường dẫn service đúng và service KHÔNG gửi page/size
import { getPetsBySpecies, getAllSpecies } from '../../../services/petService';
// 2. Đảm bảo đường dẫn CSS đúng và CSS có quy tắc cần thiết
import '../../../assets/user/css/User.css';

// --- 3. ĐỊNH NGHĨA BASE URL CỦA BACKEND ---
// !!! THAY ĐỔI CHO PHÙ HỢP VỚI MÔI TRƯỜNG CỦA BẠN !!!
const BACKEND_BASE_URL = 'http://localhost:8080';

// --- Hàm format giá ---
const formatPrice = (price) => {
    const numericPrice = Number(price);
    if (price === null || price === undefined || isNaN(numericPrice)) {
        return "Liên hệ";
    }
    if (numericPrice >= 1000000) {
        return `${(numericPrice / 1000000).toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} triệu đồng`;
    }
    return `${numericPrice.toLocaleString('vi-VN')} đồng`;
};

// --- Số sản phẩm mỗi trang ---
const ITEMS_PER_PAGE = 8; // Hoặc 9, 12 tùy layout

export default function ProductArea() {
    // --- State ---
    const [speciesList, setSpeciesList] = useState([]);
    const [selectedSpecies, setSelectedSpecies] = useState('');
    const [allPetsForSpecies, setAllPetsForSpecies] = useState([]); // Luôn khởi tạo là mảng rỗng
    const [currentPage, setCurrentPage] = useState(1);
    const [speciesLoading, setSpeciesLoading] = useState(true);
    const [petsLoading, setPetsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Ảnh mặc định của Frontend ---
    const defaultImageUrl = "/assets/user/images/default-pet-placeholder.png"; // Đảm bảo đường dẫn này đúng

    // --- useEffect: Lấy danh sách loài ---
    useEffect(() => {
        let isMounted = true; // Cờ để tránh cập nhật state nếu component unmount
        setSpeciesLoading(true);
        setError(null);
        getAllSpecies()
            .then(response => {
                if (isMounted) {
                    const fetchedSpecies = response.data || [];
                    setSpeciesList(fetchedSpecies);
                    if (fetchedSpecies.length > 0 && !selectedSpecies) {
                        // Chỉ set lần đầu, tránh trigger effect không cần thiết nếu selectedSpecies đã có
                        setSelectedSpecies(prevSelected => prevSelected || fetchedSpecies[0]);
                    } else if (fetchedSpecies.length === 0) {
                        setSelectedSpecies('');
                    }
                }
            })
            .catch(err => {
                if (isMounted) {
                    console.error("Lỗi tải danh sách loài:", err);
                    setError("Không thể tải danh sách loài.");
                    setSpeciesList([]);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setSpeciesLoading(false);
                }
            });

        // Cleanup function
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Chạy một lần khi mount

    // --- useEffect: Lấy TOÀN BỘ Pet khi selectedSpecies THAY ĐỔI ---
     useEffect(() => {
        let isMounted = true; // Cờ cleanup
         // Chỉ fetch khi selectedSpecies có giá trị hợp lệ
         if (selectedSpecies) {
             setPetsLoading(true);
             setError(null);
             // Reset danh sách về rỗng TRƯỚC KHI fetch để hiển thị skeleton
             setAllPetsForSpecies([]);

             getPetsBySpecies(selectedSpecies) // Gọi API client-side
                 .then(response => {
                    if (isMounted) {
                        // Quan trọng: Xác thực API trả về MẢNG
                        if (Array.isArray(response.data)) {
                            setAllPetsForSpecies(response.data); // Cập nhật với dữ liệu mới
                        } else {
                            console.error("API Lỗi định dạng: Cần trả về mảng!", response.data);
                            setError("Lỗi định dạng dữ liệu từ máy chủ.");
                            setAllPetsForSpecies([]); // Set mảng rỗng khi lỗi định dạng
                        }
                    }
                 })
                 .catch(err => {
                    if (isMounted) {
                        console.error(`Lỗi tải thú cưng cho loài ${selectedSpecies}:`, err);
                        setError(`Không thể tải danh sách thú cưng.`);
                        setAllPetsForSpecies([]); // Set mảng rỗng khi lỗi fetch
                    }
                 })
                 .finally(() => {
                    if (isMounted) {
                        setPetsLoading(false); // Tắt loading
                    }
                 });
         } else {
              // Nếu không có loài nào được chọn (ví dụ ban đầu hoặc danh sách rỗng)
              if (isMounted) {
                  setAllPetsForSpecies([]); // Đảm bảo là mảng rỗng
                  setPetsLoading(false);
              }
         }
         // Cleanup function
         return () => {
             isMounted = false;
         };
     }, [selectedSpecies]); // Chỉ phụ thuộc vào selectedSpecies


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
            setCurrentPage(1); // Reset về trang 1 ngay khi đổi loài
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
            const productContainer = document.getElementById('product-display-area');
            if (productContainer) {
                const headerOffset = 80; // Điều chỉnh nếu header của bạn cao hơn
                const elementPosition = productContainer.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        }
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
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}> <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous"><span aria-hidden="true">«</span></button> </li>
                        {startPage > 1 && <li className="page-item"><button className="page-link" onClick={() => handlePageChange(1)}>1</button></li>}
                        {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                        {pageNumbers.map(num => (<li key={num} className={`page-item ${currentPage === num ? 'active' : ''}`}> <button className="page-link" onClick={() => handlePageChange(num)}>{num}</button> </li>))}
                        {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                        {endPage < totalPages && <li className="page-item"><button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button></li>}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}> <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next"><span aria-hidden="true">»</span></button> </li>
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
                            <h2>Thú cưng hot</h2>
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
                                    {speciesLoading && (<li className="nav-item"><span className="nav-link disabled">Đang tải loài...</span></li>)}
                                    {!speciesLoading && error && speciesList.length === 0 && (<li className="nav-item"><span className="nav-link text-danger">{error}</span></li>)}
                                    {!speciesLoading && !error && speciesList.length === 0 && (<li className="nav-item"><span className="nav-link disabled">Không có loài nào.</span></li>)}
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
                                <div className="row" role="tabpanel"> {/* Class row chứa các cột */}

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
                                                <div className="single-product skeleton-inline-card"> {/* Cần CSS */}
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
                                            // Logic xác định URL ảnh
                                            let imageSource = defaultImageUrl;
                                            if (pet && pet.imageUrl && typeof pet.imageUrl === 'string' && pet.imageUrl.trim() !== '') {
                                                const relativePath = pet.imageUrl.startsWith('/') ? pet.imageUrl.substring(1) : pet.imageUrl;
                                                imageSource = `${BACKEND_BASE_URL}/${relativePath}`;
                                            }

                                            return (
                                                <div key={pet.id} className="col-xl-3 col-lg-4 col-md-4 col-12 mb-4">
                                                    <div className="single-product"> {/* Cần CSS min-height */}
                                                        <div className="product-img">
                                                            <a href={`/pet/${pet.id}`}>
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
                                                                    style={{ aspectRatio: '1 / 1', objectFit: 'cover', backgroundColor: '#f5f5f5' }}
                                                                />
                                                            </a>
                                                            <div className="button-head">
                                                                <div className="product-action">
                                                                    <a data-toggle="modal" title="Quick View" href="#"><i className="ti-eye"></i><span>Xem chi tiết</span></a>
                                                                    <a title="Wishlist" href="#"><i className="ti-heart"></i><span>Yêu thích</span></a>
                                                                </div>
                                                                <div className="product-action-2">
                                                                    <a title="Add to cart" href="#">Thêm vào giỏ hàng</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="product-content">
                                                            <h3><a href={`/pet/${pet.id}`}>{pet.name || 'Chưa có tên'}</a></h3>
                                                            <div className="product-price">
                                                                <span>{formatPrice(pet.price)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}

                                    {/* 4. Thông báo không có sản phẩm */}
                                    {!petsLoading && !error && selectedSpecies && allPetsForSpecies.length === 0 && !speciesLoading && (
                                        <div className="col-12 text-center my-5">
                                            <p>Không tìm thấy thú cưng nào thuộc loài "{selectedSpecies}".</p>
                                        </div>
                                    )}
                                    {/* 5. Thông báo khi chưa chọn loài */}
                                    {!petsLoading && !error && !selectedSpecies && speciesList.length > 0 && !speciesLoading && (
                                        <div className="col-12 text-center my-5">
                                            <p>Vui lòng chọn một loài để xem danh sách thú cưng.</p>
                                        </div>
                                    )}

                                    {/* --- Render Phân Trang --- */}
                                    {renderPagination()}

                                </div> {/* Kết thúc .row */}
                            </div> {/* Kết thúc #product-display-area */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}