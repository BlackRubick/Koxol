// Modal.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Modal.css';
import './ProductCylinder3D.css'; // Import CSS for 3D cylinder animation
import './ProductCylinderLabel3D.css'; // Import CSS for 3D cylinder label animation
import { Product3DViewer } from './Product3DViewer'; // Import the 3D viewer component

const Modal = ({ product, onClose }) => {
  const { userData } = useAuth();
  const { addToCart } = useCart(); // Access addToCart from CartContext
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem(`comments_${product.id}`)) || [];
    setComments(storedComments);
  }, [product.id]);

  const handleCommentSubmit = () => {
    if (!comment.trim() || rating === 0) return;

    const sessionUser = userData?.name || 'Invitado';
    const newComment = {
      user: sessionUser,
      text: comment,
      rating,
      date: new Date().toLocaleDateString('es-MX')
    };
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments_${product.id}`, JSON.stringify(updatedComments));
    setComment('');
    setRating(0);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity }); // Use addToCart from CartContext
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const averageRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{product.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Left Column - Images */}
          <div className="modal-images-section">
            <div className="main-image-container">
              {currentImageIndex === 3 && product.id === 2 ? (
                <Product3DViewer />
              ) : (
                <img
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} ${currentImageIndex + 1}`}
                  className="main-image"
                />
              )}
              
              {product.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="image-nav prev">‹</button>
                  <button onClick={nextImage} className="image-nav next">›</button>
                  
                  <div className="image-indicators">
                    {product.images.map((_, index) => (
                      <span
                        key={index}
                        className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="thumbnail-gallery">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  >
                    {index === 3 && product.id === 2 ? (
                      <div className="thumbnail-3d">3D</div>
                    ) : (
                      <img src={img} alt={`Miniatura ${index + 1}`} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="modal-info-section">
            <div className="product-description">
              <p>{product.desc}</p>
              
              {comments.length > 0 && (
                <div className="rating-summary">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= averageRating ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">
                    {averageRating} ({comments.length} {comments.length === 1 ? 'reseña' : 'reseñas'})
                  </span>
                </div>
              )}
            </div>

            <div className="product-price">
              <span className="price">${product.price.toLocaleString('es-MX')}</span>
              <span className="currency">MXN</span>
            </div>

            {/* Add to Cart Section */}
            <div className="cart-section">
              <div className="quantity-selector">
                <label>Cantidad:</label>
                <div className="quantity-controls">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span className="quantity-value">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <button onClick={handleAddToCart} className="add-to-cart-btn">
                🛒 Agregar al Carrito
              </button>

              {showSuccessMessage && (
                <div className="success-message">
                  ¡Producto agregado al carrito!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="modal-comments">
          <h3>Reseñas y Comentarios</h3>

          {/* Comment Form */}
          <div className="comment-form">
            <div className="rating-input">
              <label>Tu calificación</label>
              <div className="stars-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="star-btn"
                  >
                    <span className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="comment-input">
              <label>Tu comentario</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia con este producto..."
                rows="3"
              />
            </div>

            <button
              onClick={handleCommentSubmit}
              disabled={!comment.trim() || rating === 0}
              className="submit-comment-btn"
            >
              📤 Enviar Reseña
            </button>
          </div>

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">Sé el primero en dejar una reseña</p>
            ) : (
              comments.map((c, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-user">
                      <div className="user-avatar">👤</div>
                      <div className="user-info">
                        <p className="user-name">{c.user}</p>
                        <p className="comment-date">{c.date}</p>
                      </div>
                    </div>
                    <div className="comment-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star small ${star <= c.rating ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="comment-text">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3D Viewer - Simplified rotating 3D model */}
        <div className="product-3d-viewer">
          <Product3DViewer />
        </div>
      </div>
    </div>
  );
};

export default Modal;