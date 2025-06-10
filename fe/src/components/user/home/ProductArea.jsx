import React, { useState, useEffect, useMemo } from 'react';
import { getPetsBySpecies, getAllSpecies } from '../../../services/petService';
import { addPetToWishlist } from '../../../services/wishlistService';
import { addToCart, getCartByUser} from '../../../services/cartService';
import { toast } from 'react-toastify';
import ProductDetailModal from './ProductDetailModal';

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
    const [allPetsForSpecies, setAllPetsForSpecies] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [speciesLoading, setSpeciesLoading] = useState(true);
    const [petsLoading, setPetsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
// Dữ liệu pet giả định (đặt bên ngoài component hoặc ngay trong state)
// --- DỮ LIỆU TEST VỚI ẢNH THẬT ---
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
    // Ảnh chính (lấy từ picsum)
    imageUrl: 'https://picsum.photos/seed/maincat/600/600',
    // Danh sách ảnh phụ (lấy từ picsum với seed khác nhau)
    imageUrls: [
        'https://picsum.photos/seed/catthumb1/600/600', // Trùng ảnh chính hoặc ảnh đầu list
        'https://picsum.photos/seed/catthumb2/600/600',
        'https://picsum.photos/seed/catthumb3/600/600',
        'https://picsum.photos/seed/catthumb4/600/600',
        'https://picsum.photos/seed/catthumb5/600/600',
         '/uploads/pets/mèo_server_1.jpg'
    ],
};
    // --- Ảnh mặc định của Frontend ---
    const defaultImageUrl = "/assets/user/images/default-pet-placeholder.png"; 

    const [isModalOpen, setIsModalOpen] = useState(false);        
const [selectedPet, setSelectedPet] = useState(dummyPetData);

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

    // +++ 3. THÊM VÀO ĐÂY: Hàm mở và đóng Modal +++
    const handleOpenModal = (pet) => {
        setSelectedPet(pet); // Lưu thông tin pet được click
        setIsModalOpen(true); // Mở modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Đóng modal
        setSelectedPet(null); // Xóa thông tin pet khỏi state khi đóng
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
                                                    <div className="product-img position-relative">
  <a href={`/user/pet/${pet.id}`}>
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
  </a>

  {/* Badge trạng thái đè lên ảnh */}
  <div
    className={`pet-status-overlay ${
      pet.status === 'available'
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
        <i className="ti-eye"></i><span>Xem chi tiết</span>
      </a>
      <a
        title="Wishlist"
        href="#"
        onClick={async (e) => {
          e.preventDefault();
        //   const userId = localStorage.getItem('userId');
          try {
            await addPetToWishlist(pet.id);
            toast.success("Đã thêm vào danh sách yêu thích!");
          } catch (err) {
            if (err.response?.status === 409) {
              toast.info(err.response.data.message || "Sản phẩm đã có trong danh sách yêu thích.");
            } else {
              toast.error("Lỗi khi thêm vào danh sách yêu thích!");
            }
          }
        }}
      >
        <i className="ti-heart"></i><span>Yêu thích</span>
      </a>
    </div>
    <div className="product-action-2">
    <a
  title="Thêm vào giỏ hàng"
  href="#"
  onClick={async (e) => {
    e.preventDefault();
    try {
      const existingItem = cartItems?.find((item) => item.pet?.id === pet.id);
      const currentQty = existingItem?.quantity || 0;
      const stock = pet.quantity;
  
      if (currentQty + 1 > stock) {
        toast.warning("🚫 Số lượng vượt quá tồn kho!");
        return;
      }
  
      await addToCart({ petId: pet.id, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated'));
      toast.success('Đã thêm vào giỏ hàng!');
  
      // Cập nhật giỏ sau khi thêm
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
         <ProductDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            pet={selectedPet}    // <-- TRUYỀN selectedPet vào prop 'pet'
        />
        </div>
    );
}