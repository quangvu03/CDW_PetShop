import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPetById } from '../../services/petService';
import { addToCart } from '../../services/cartService';
import { getCommentsByPetId, addComment, deleteComment, reportComment } from '../../services/commentService';
import { toast } from 'react-toastify';
import { getReviewsByPetId } from '../../services/ratingService';
import '../../assets/user/css/User.css';

const RatingComponent = ({ averageRating, totalReviews, ratingData }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={index < Math.round(rating) ? 'text-warning' : 'text-secondary'}
        style={{ fontSize: '1.2rem' }}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="card p-3 mb-4">
      <h2 className="card-title h5 mb-3 text-dark">Đánh giá chung</h2>
      <div className="row">
        <div className="col-md-4 col-12 text-center">
          <div className="h3 font-weight-bold text-dark mb-1">{averageRating.toFixed(1)}</div>
          <div className="mb-1">{renderStars(averageRating)}</div>
          <div className="text-muted small">{totalReviews} đánh giá</div>
        </div>
        <div className="col-md-8 col-12">
          {ratingData.map((item) => (
            <div key={item.stars} className="d-flex align-items-center mb-2">
              <div className="text-right w-25 text-dark font-weight-medium">{item.stars}</div>
              <div className="text-warning mx-2">★</div>
              <div className="progress w-50">
                <div
                  className="progress-bar bg-warning"
                  role="progressbar"
                  style={{ width: `${item.percentage}%` }}
                  aria-valuenow={item.percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="text-right w-25 text-muted small">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getTimeAgo = (createdAt) => {
  const now = new Date();
  const commentDate = new Date(createdAt);
  const diffMs = now - commentDate;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours >= 24) return `${Math.floor(diffHours / 24)} ngày trước`;
  if (diffHours >= 1) return `${diffHours} giờ trước`;
  if (diffMins >= 1) return `${diffMins} phút trước`;
  return 'Vài giây trước';
};

export default function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingData, setRatingData] = useState([
    { stars: 5, percentage: 0 },
    { stars: 4, percentage: 0 },
    { stars: 3, percentage: 0 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyStates, setReplyStates] = useState({});

  useEffect(() => {
    const fetchPetAndReviews = async () => {
      try {
        const petResponse = await getPetById(id);
        setPet(petResponse.data);
        setMainImage(petResponse.data.imageUrl);

        const reviewResponse = await getReviewsByPetId(id);
        const reviews = reviewResponse.data;
        const total = reviews.length;
        setTotalReviews(total);
        if (total > 0) {
          const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
          setAverageRating(sum / total);
          const ratingCounts = [0, 0, 0, 0, 0, 0];
          reviews.forEach((review) => {
            if (review.rating >= 1 && review.rating <= 5) {
              ratingCounts[review.rating]++;
            }
          });
          const newRatingData = [5, 4, 3, 2, 1].map((stars) => ({
            stars,
            percentage: ((ratingCounts[stars] / total) * 100).toFixed(0),
          }));
          setRatingData(newRatingData);
        }

        const commentResponse = await getCommentsByPetId(id);
        setComments(Array.isArray(commentResponse.data) ? commentResponse.data : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Không thể tải dữ liệu');
      }
    };
    fetchPetAndReviews();
  }, [id]);

  const getFullImageUrl = (path) => {
    if (!path || typeof path !== 'string') return '/assets/user/images/default-pet-placeholder.png';
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath || typeof avatarPath !== 'string') return 'https://via.placeholder.com/50';
    return `http://localhost:8080/uploads/avatars/${avatarPath}`;
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

  const handlePostComment = async (content, parentId = null) => {
    if (!content.trim()) return;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Vui lòng đăng nhập để bình luận!');
      return;
    }
    try {
      const commentData = {
        userId: parseInt(userId),
        petId: parseInt(id),
        content,
        parentId,
      };
      await addComment(commentData);
      if (!parentId) {
        setNewComment('');
      }
      if (parentId) {
        setReplyStates((prev) => ({
          ...prev,
          [parentId]: { ...prev[parentId], content: '', isReplying: false },
        }));
      }
      const commentResponse = await getCommentsByPetId(id);
      setComments(Array.isArray(commentResponse.data) ? commentResponse.data : []);
      toast.success('Đã đăng bình luận!');
    } catch (err) {
      toast.error('Lỗi khi đăng bình luận');
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyStates((prev) => ({
      ...prev,
      [commentId]: {
        isReplying: !prev[commentId]?.isReplying,
        content: prev[commentId]?.content || '',
      },
    }));
  };

  const handleReplyChange = (commentId, value) => {
    setReplyStates((prev) => ({
      ...prev,
      [commentId]: { ...prev[commentId], content: value },
    }));
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) return;
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;
    try {
      await deleteComment(commentId);
      toast.success('Xóa bình luận thành công!');
      const commentResponse = await getCommentsByPetId(id);
      setComments(Array.isArray(commentResponse.data) ? commentResponse.data : []);
    } catch (err) {
      toast.error('Lỗi khi xóa bình luận');
    }
  };

  const handleReportComment = async (commentId) => {
    if (!commentId) return;
    try {
      await reportComment(commentId);
      toast.success('Báo cáo bình luận thành công!');
      const commentResponse = await getCommentsByPetId(id);
      setComments(Array.isArray(commentResponse.data) ? commentResponse.data : []);
    } catch (err) {
      toast.error('Lỗi khi báo cáo bình luận');
    }
  };

  // Build nested comment structure
  const buildCommentTree = (comments) => {
    if (!Array.isArray(comments)) return [];
    const commentMap = {};
    const tree = [];

    // Create a map of comments by ID and initialize replies from commentsResponses
    comments.forEach((comment) => {
      comment.replies = Array.isArray(comment.commentsResponses) ? comment.commentsResponses : [];
      commentMap[comment.id] = comment;
    });

    // Build the tree by linking replies based on parentId
    comments.forEach((comment) => {
      if (comment.parentId && commentMap[comment.parentId]) {
        // Avoid duplicate replies
        if (!commentMap[comment.parentId].replies.find((r) => r.id === comment.id)) {
          commentMap[comment.parentId].replies.push(comment);
        }
      } else if (!comment.parentId) {
        tree.push(comment);
      }
    });

    return tree;
  };

  const commentTree = buildCommentTree(comments);

  const renderComments = (comments, depth = 0) => {
    if (!Array.isArray(comments)) return null;
    return comments.map((comment, index) => (
      <div key={comment.id}>
        <div
          className="single-comment mb-3"
          style={{ marginLeft: `${depth * 20}px`, borderRadius: '8px', marginBottom: '0px', paddingLeft: '60px' }}
        >
          <img
            src={getAvatarUrl(comment.avatarUser)}
            alt={`${comment.username} Avatar`}
            style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
          />
          <div className="content" style={{ backgroundColor: '#e3e4e6', padding: '10px', borderRadius: '20px' }}>
            <h4 style={{ fontWeight: 'bold', marginBottom: '15px' }}>{comment.username}</h4>
            <p>{comment.content}</p>
            <div className="d-flex align-items-center gap-3">
              <small className="text-muted">{getTimeAgo(comment.createdAt)}</small>
              {depth === 0 && (
                <a
                  href="#"
                  style={{ marginLeft: '10px' }}
                  className="btn btn-sm btn-outline-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    handleReplyClick(comment.id);
                  }}
                >
                  <i className="fa fa-reply" aria-hidden="true"></i> Reply
                </a>
              )}
              {parseInt(localStorage.getItem('userId')) === comment.userId && (
                <a
                  href="#"
                  style={{ marginLeft: '10px' }}
                  className="btn btn-sm btn-outline-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteComment(comment.id);
                  }}
                >
                  <i className="fa fa-trash" aria-hidden="true"></i> Xóa
                </a>
              )}
              <a
                href="#"
                style={{ marginLeft: '10px' }}
                className="btn btn-sm btn-outline-warning"
                onClick={(e) => {
                  e.preventDefault();
                  handleReportComment(comment.id);
                }}
              >
                <i className="fa fa-flag" aria-hidden="true"></i> Báo cáo
              </a>
            </div>
            {replyStates[comment.id]?.isReplying && (
              <div className="reply-input mt-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Viết phản hồi..."
                    value={replyStates[comment.id]?.content || ''}
                    onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => handlePostComment(replyStates[comment.id]?.content || '', comment.id)}
                  >
                    Post Reply
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => handleReplyClick(comment.id)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {Array.isArray(comment.replies) && comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
        {index < comments.length - 1 && depth === 0 && <hr className="my-3" />}
      </div>
    ));
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
                    <div className="thumbnail-list d-flex gap-2 justify-content-center flex-wrap">
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
                            margin: '5px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            border: mainImage === url ? '2px solid #00bcd4' : '1px solid #ccc',
                            boxShadow: mainImage === url ? '0 0 8px rgba(0, 188, 212, 0.4)' : 'none',
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
                        <a href="#">
                          <i className="fa fa-user"></i>Số lượng: {pet.quantity}
                        </a>
                        <a href="#">
                          <i className="fa fa-calendar"></i>Tuổi: {pet.age} tháng
                        </a>
                        <a href="#">
                          <i className="fa fa-comments"></i>Bình luận({comments.length})
                        </a>
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
                            <li>
                              <a href="#">Cho</a>
                            </li>
                            <li>
                              <a href="#">Meo</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <RatingComponent
                    averageRating={averageRating}
                    totalReviews={totalReviews}
                    ratingData={ratingData}
                  />
                  <div className="col-12">
                    <div className="comments">
                      <h3 className="comment-title" id="comment-size">
                        Bình luận({comments.length})
                      </h3>
                      <div className="reply">
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Viết một bình luận..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => handlePostComment(newComment)}
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>
                      <div id="list-comment">{renderComments(commentTree)}</div>
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
                  <a className="button" href="#">
                    <i className="fa fa-search"></i>
                  </a>
                </div>
              </div>
              <div className="single-widget category">
                <h3 className="title">Danh mục thú cưng</h3>
                <ul className="categor-list">
                  <li>
                    <a href="">Meo</a>
                  </li>
                  <li>
                    <a href="">Cho</a>
                  </li>
                </ul>
              </div>
              <div className="single-widget recent-post">
                <h3 className="title">Bài đăng gần đây</h3>
                {[1, 2, 3].map((i) => (
                  <div className="single-post" key={i}>
                    <div className="image">
                      <img src="https://via.placeholder.com/100x100" alt="#" />
                    </div>
                    <div className="content">
                      <h5>
                        <a href="#">Top 10 Beautyful Women Dress in the world</a>
                      </h5>
                      <ul className="comment">
                        <li>
                          <i className="fa fa-calendar" aria-hidden="true"></i>Jan 11, 2020
                        </li>
                        <li>
                          <i className="fa fa-commenting-o" aria-hidden="true"></i>35
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="single-widget side-tags">
                <h3 className="title">Tags</h3>
                <ul className="tag">
                  {['business', 'wordpress', 'html', 'multipurpose', 'education', 'template', 'Ecommerce'].map(
                    (tag) => (
                      <li key={tag}>
                        <a href="#">{tag}</a>
                      </li>
                    ),
                  )}
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