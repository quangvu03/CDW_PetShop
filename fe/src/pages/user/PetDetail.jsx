import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPetById } from '../../services/petService';
import { addToCart } from '../../services/cartService';
import { toast } from 'react-toastify';
import '../../assets/user/css/User.css';

export default function PetDetail() {
  const { id  } = useParams();
  const [pet, setPet] = useState(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await getPetById(id);
        setPet(response.data);
        setMainImage(response.data.imageUrl);
      } catch (err) {
        toast.error('Không thể tải dữ liệu thú cưng');
      }
    };
    fetchPet();
  }, [id]);

  const getFullImageUrl = (path) => {
    if (!path || typeof path !== 'string') return '/assets/user/images/default-pet-placeholder.png';
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({ petId: pet.id, quantity: 1 });
      toast.success('Đã thêm vào giỏ hàng!');
      localStorage.setItem('cart_updated', Date.now());
    } catch (err) {
      toast.error('Lỗi khi thêm vào giỏ hàng');
    }
  };

  if (!pet) return <div className="container py-5">Đang tải dữ liệu...</div>;
  return (
    <section className="blog-single section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-12">
            <div className="blog-single-main">
              <div className="row">
                <div className="col-12">
                <div className="pet-image-preview w-100 d-flex flex-column align-items-center">
  {/* Ảnh chính chiếm tối đa chiều ngang */}
  <div className="main-image mb-3" style={{ width: '100%', maxWidth: '700px' }}>
    <img
      src={getFullImageUrl(mainImage)}
      alt="Main"
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        objectFit: 'contain',
        border: '1px solid #eee',
      }}
    />
  </div>

  {/* Thumbnails nằm ngang bên dưới */}
  <div className="thumbnail-list d-flex gap-2 justify-content-center">
  {(pet.imageUrls || []).map((url, i) => (
  <img
    key={i}
    src={getFullImageUrl(url)}
    alt={`Thumbnail ${i}`}
    onClick={() => setMainImage(url)}
    style={{
      width: '70px',
      height: '70px',
      objectFit: 'cover',
      margin: '10px',
      borderRadius: '8px',
      cursor: 'pointer',
      border: mainImage === url ? '2px solid #00bcd4' : '1px solid #ccc', // Màu cyan nhẹ đẹp
      boxShadow: mainImage === url ? '0 0 8px rgba(0, 188, 212, 0.4)' : 'none', // hiệu ứng sáng nhẹ
      transition: 'all 0.2s ease',
    }}
  />
))}

  </div>
</div>


                  <div className="blog-detail">
                    <h2 className="blog-title">{pet.name}</h2>
                    <div className="blog-meta">
                      <span className="author">
                        <a href="#"><i className="fa fa-user"></i>Số lượng: {pet.quantity}</a>
                        <a href="#"><i className="fa fa-calendar"></i>Tuổi: {pet.age} tháng</a>
                        <a href="#"><i className="fa fa-comments"></i>Bình luận(0)</a>
                      </span>
                      <button className="blog-meta-buy" onClick={handleAddToCart}>
                        <i className="ti-bag"></i>
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                    <div className="content">
                      <div className="content-infomation">
                        <div className="content-infomation-child">
                          <span>Giới tính: {pet.gender}</span>
                          <span>Kích thước: {pet.size}</span>
                        </div>
                        <div className="content-infomation-child">
                          <span>Xuất xứ: {pet.origin}</span>
                          <span>Chủng loại: {pet.breed}</span>
                        </div>
                      </div>
                      <blockquote>
                        <i className="fa fa-quote-left"></i> Mô tả: {pet.description}
                      </blockquote>
                    </div>
                  </div>
                  <div className="share-social">
                    <div className="row">
                      <div className="col-12">
                        <div className="content-tags">
                          <h4>Thẻ:</h4>
                          <ul className="tag-inner">
                            <li><a href="#">Cho</a></li>
                            <li><a href="#">Meo</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="comments">
                    <h3 className="comment-title" id="comment-size">Bình luận(3)</h3>
                    <div id="list-comment">
                      <div className="single-comment">
                        <img src="" style={{ width: '80px', height: '80px' }} alt="Anh dai dien" />
                        <div className="content">
                          <h4>ngay</h4>
                          <p>binh luan</p>
                          <div className="button">
                            <a href="#" className="btn">
                              <i className="fa fa-reply" aria-hidden="true"></i>Phản hồi
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="reply">
                    <div className="reply-head">
                      <h2 className="reply-title">Để lại bình luận</h2>
                      <form className="form" action="">
                        <div className="row">
                          <input type="hidden" id="petId" name="petId" value="" />
                          <input type="hidden" name="userId" />
                          <div className="col-12">
                            <div className="form-group">
                              <label>Bình luận của bạn<span>*</span></label>
                              <textarea name="note" placeholder=""></textarea>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group button">
                              <button type="submit" className="btn">Đăng bình luận</button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-12">
            <div className="main-sidebar">
              <div className="single-widget search">
                <div className="form">
                  <input type="email" placeholder="Tìm kiếm..." />
                  <a className="button" href="#"><i className="fa fa-search"></i></a>
                </div>
              </div>
              <div className="single-widget category">
                <h3 className="title">Danh mục thú cưng</h3>
                <ul className="categor-list">
                  <li><a href="">Meo</a></li>
                  <li><a href="">Cho</a></li>
                </ul>
              </div>
              <div className="single-widget recent-post">
                <h3 className="title">Bài đăng gần đây</h3>
                {[1, 2, 3].map(i => (
                  <div className="single-post" key={i}>
                    <div className="image">
                      <img src="https://via.placeholder.com/100x100" alt="#" />
                    </div>
                    <div className="content">
                      <h5><a href="#">Top 10 Beautyful Women Dress in the world</a></h5>
                      <ul className="comment">
                        <li><i className="fa fa-calendar" aria-hidden="true"></i>Jan 11, 2020</li>
                        <li><i className="fa fa-commenting-o" aria-hidden="true"></i>35</li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="single-widget side-tags">
                <h3 className="title">Tags</h3>
                <ul className="tag">
                  {['business', 'wordpress', 'html', 'multipurpose', 'education', 'template', 'Ecommerce'].map(tag => (
                    <li key={tag}><a href="#">{tag}</a></li>
                  ))}
                </ul>
              </div>
              <div className="single-widget newsletter">
                <h3 className="title">Newslatter</h3>
                <div className="letter-inner">
                  <h4>
                    Subscribe & get news <br /> latest updates.
                  </h4>
                  <div className="form-inner">
                    <input type="email" placeholder="Enter your email" />
                    <a href="#">Submit</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
