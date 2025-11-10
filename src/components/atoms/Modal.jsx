// Modal.js
import React, { useState, useEffect } from 'react';
import { getJSON, setJSON } from '../../utils/storage';
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
  // Variant size options for products with sizes (esencias, velas)
  const essenceSizes = [
    { label: '125 ml', value: 125, price: 35 },
    { label: '250 ml', value: 250, price: 70 }
  ];
  const candleSizes = [
    { label: '8 g', value: 8, price: 35 },
    { label: '20 g', value: 20, price: 60 }
  ];

  const detectVariantOptions = (p) => {
    const name = String(p?.name || '').toLowerCase();
    if (name.includes('esencia') || name.includes('esencias') || p?.id === 7) return essenceSizes;
    if (name.includes('vela') || name.includes('velas') || p?.id === 5) return candleSizes;
    return null;
  };

  const [variantOptions, setVariantOptions] = useState(detectVariantOptions(product));
  const [selectedVariant, setSelectedVariant] = useState(variantOptions ? variantOptions[0] : null);

  // Reset variant options/selection whenever the modal opens with a different product
  useEffect(() => {
    const opts = detectVariantOptions(product);
    setVariantOptions(opts);
    setSelectedVariant(opts ? opts[0] : null);
  }, [product.id]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [triedBlobFetch, setTriedBlobFetch] = useState(false);
  const [videoIsLfsPointer, setVideoIsLfsPointer] = useState(false);

  useEffect(() => {
    const storedComments = getJSON(`comments_${product.id}`, []) || [];
    setComments(storedComments);
  }, [product.id]);

  // Prevent background page from scrolling while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, []);

  // If this product has a video and we want to show it by default for product id 3,
  // If this product has a video, show the video by default when opening the modal.
  useEffect(() => {
    // currentImageIndex will be set after we confirm the video exists
    setCurrentImageIndex(0);
  }, [product.id, product.video, product.images.length]);

  // Check if the product video file is reachable on the server (HEAD request)
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (!product.video) {
        if (mounted) setVideoAvailable(false);
        return;
      }
      try {
        const res = await fetch(product.video, { method: 'HEAD' });
        if (mounted) {
          // also verify browser can play this video mime type
          let playable = false;
          try {
            const extMatch = product.video.match(/\.([a-z0-9]+)(?:\?|$)/i);
            const ext = extMatch ? extMatch[1].toLowerCase() : '';
            const videoEl = document.createElement('video');
            const mimeMap = { mp4: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg' };
            const mime = mimeMap[ext] || '';
            if (mime && typeof videoEl.canPlayType === 'function') {
              const can = videoEl.canPlayType(mime);
              playable = !!can && can !== 'no';
            }
          } catch (err) {
            playable = false;
          }
          const okAndPlayable = res.ok && playable;
          setVideoAvailable(okAndPlayable);
          if (!okAndPlayable) {
            console.warn(`Video not available or unsupported: ${product.video}`, { status: res.status, playable });
            // Try a fallback GET -> blob in case HEAD is blocked or server headers are incorrect
            try {
              const getRes = await fetch(product.video);
              if (getRes.ok) {
                // Detect Git LFS pointer responses (text pointer) before treating as binary
                try {
                  const textPreview = await getRes.clone().text();
                  if (typeof textPreview === 'string' && textPreview.includes('git-lfs') && textPreview.includes('oid sha256')) {
                    // This is a Git LFS pointer file, not the real binary
                    if (mounted) {
                      setVideoIsLfsPointer(true);
                      setVideoAvailable(false);
                    }
                    return;
                  }
                } catch (e) {
                  // ignore text preview errors and continue to try binary path
                }

                const contentType = getRes.headers.get('content-type') || 'video/mp4';
                const ab = await getRes.arrayBuffer();
                const blob = new Blob([ab], { type: contentType });
                const url = URL.createObjectURL(blob);
                if (mounted) {
                  setVideoBlobUrl(url);
                  // attempt to set available if browser can play this blob type
                  try {
                    const videoEl = document.createElement('video');
                    const can = typeof videoEl.canPlayType === 'function' ? videoEl.canPlayType(contentType) : '';
                    if (can && can !== 'no') {
                      setVideoAvailable(true);
                      console.info('Video blob fallback available for', product.video);
                    } else {
                      console.warn('Blob fetched but browser reports cannot play this type:', contentType);
                    }
                  } catch (err) {
                    console.warn('Error checking blob playability', err);
                  }
                }
              }
            } catch (err) {
              console.warn('Fallback GET for video failed:', product.video, err);
            }
          }
        }
      } catch (err) {
        if (mounted) {
          setVideoAvailable(false);
          console.warn(`Error checking video ${product.video}:`, err);
        }
      }
    };
    check();
    return () => { mounted = false; };
  }, [product.video]);

  // When we know whether video is available, set the currentImageIndex appropriately
  useEffect(() => {
    if (videoAvailable) {
      setCurrentImageIndex(product.images.length);
    } else {
      setCurrentImageIndex(0);
    }
  }, [videoAvailable, product.images.length]);

  // Cleanup blob URL when modal unmounts or product changes
  useEffect(() => {
    return () => {
      if (videoBlobUrl) {
        URL.revokeObjectURL(videoBlobUrl);
        setVideoBlobUrl(null);
      }
    };
  }, [videoBlobUrl]);

  // helper to handle video playback errors with more diagnostics and a last-resort retry
  const handleVideoError = async (e) => {
    try {
      const mediaError = e?.currentTarget?.error || null;
      console.warn('Video playback error event:', { src: e?.currentTarget?.currentSrc, mediaError, product: product.video });
      // If we haven't tried blob fallback yet, attempt a GET->blob now
      if (!triedBlobFetch && product.video) {
        setTriedBlobFetch(true);
        try {
          const getRes = await fetch(product.video);
          if (getRes.ok) {
            // detect Git LFS pointer
            try {
              const txt = await getRes.clone().text();
              if (typeof txt === 'string' && txt.includes('git-lfs') && txt.includes('oid sha256')) {
                console.warn('Detected Git LFS pointer during error fallback for', product.video);
                setVideoIsLfsPointer(true);
                setVideoAvailable(false);
                return;
              }
            } catch (e) {
              // ignore
            }

            const contentType = getRes.headers.get('content-type') || 'video/mp4';
            const ab = await getRes.arrayBuffer();
            const blob = new Blob([ab], { type: contentType });
            const url = URL.createObjectURL(blob);
            setVideoBlobUrl(url);
            // don't immediately hide — let the video element try to play the blob
            console.info('Retrying playback using blob fallback for', product.video, 'content-type:', contentType);
            return;
          } else {
            console.warn('Fallback GET returned non-ok status', getRes.status, product.video);
          }
        } catch (err) {
          console.warn('Fallback GET failed during onError handler:', err, product.video);
        }
      }
    } catch (err) {
      console.warn('Error in video error handler:', err);
    }
    // if we reach here, disable video to avoid repeated errors
    setVideoAvailable(false);
  };

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
  setJSON(`comments_${product.id}`, updatedComments);
    setComment('');
    setRating(0);
  };

  const handleAddToCart = (e) => {
    const isVariantProduct = !!variantOptions;
    let item;
    if (isVariantProduct && selectedVariant) {
      item = {
        id: `${product.id}-${selectedVariant.value}`,
        name: `${product.name} ${selectedVariant.label}`,
        price: selectedVariant.price,
        qty: quantity,
        image: product.image,
        isMembership: false
      };
    } else {
      item = { id: product.id, name: product.name, price: product.price, qty: quantity, image: product.image, isMembership: false };
    }
    addToCart(item);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const nextImage = () => {
    const total = product.images.length + (product.video ? 1 : 0);
    setCurrentImageIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    const total = product.images.length + (product.video ? 1 : 0);
    setCurrentImageIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const averageRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : 0;

  // Only treat common video container extensions as video (exclude .mpeg/.mp3 podcasts)
  const isVideoSrc = (src) => typeof src === 'string' && /\.(mp4|webm|ogv)$/i.test(src);

  // Precompute some values for rendering
  const imagesCount = product.images.length;
  const totalMediaCount = product.images.length + (product.video && videoAvailable ? 1 : 0);
  const isVideoIndex = product.video && videoAvailable && currentImageIndex === imagesCount;
  const currentMedia = product.images[currentImageIndex];
  const isEssenceProduct = String(product.name || '').toLowerCase().includes('esencia') || String(product.name || '').toLowerCase().includes('esencias') || product.id === 7;
  const displayedPrice = isEssenceProduct ? selectedSize.price : product.price;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* SVG sharpen filter definition for higher perceived video quality */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true" focusable="false">
          <defs>
            <filter id="modal-sharpen-filter" x="-10%" y="-10%" width="120%" height="120%">
              {/* simple sharpen kernel */}
              <feConvolveMatrix order="3" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" divisor="1" />
            </filter>
          </defs>
        </svg>
        {/* Header */}
        <div className="modal-header">
          <h2>{product.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Left Column - Images */}
          <div className="modal-images-section">
            <div className="main-image-container">
              {isVideoIndex ? (
                videoIsLfsPointer ? (
                  <div className="video-unavailable-lfs">
                    <img
                      src={product.image || currentMedia || ''}
                      alt={`${product.name} poster`}
                      className="main-image"
                    />
                    <div className="lfs-message" style={{ padding: 16 }}>
                      <p style={{ margin: 0 }}>Vídeo no disponible en el servidor.</p>
                      <p style={{ margin: '6px 0 12px 0', fontSize: '13px', color: '#666' }}>
                        Parece que el servidor está sirviendo un puntero Git LFS en vez del archivo real.
                      </p>
                      <a
                        href={product.video}
                        target="_blank"
                        rel="noreferrer"
                        className="download-video-btn"
                        style={{
                          display: 'inline-block',
                          padding: '8px 12px',
                          background: '#169c7c',
                          color: '#fff',
                          borderRadius: 6,
                          textDecoration: 'none'
                        }}
                      >
                        Descargar vídeo
                      </a>
                    </div>
                  </div>
                ) : videoBlobUrl ? (
                  <video
                    className="main-video"
                    playsInline
                    controls
                    src={videoBlobUrl}
                    loop
                    muted
                    onError={handleVideoError}
                  />
                ) : (
                  <video
                    className="main-video"
                    playsInline
                    autoPlay
                    muted
                    loop
                    onClick={(e) => { e.preventDefault(); e.currentTarget.play(); }}
                    onDoubleClick={(e) => { e.preventDefault(); }}
                    onContextMenu={(e) => e.preventDefault()}
                    onError={handleVideoError}
                    onAbort={handleVideoError}
                  >
                    <source src={product.video} type={(() => {
                      const m = (product.video || '').match(/\.([a-z0-9]+)(?:\?|$)/i);
                      const ext = m ? m[1].toLowerCase() : '';
                      return ext === 'mp4' ? 'video/mp4' : ext === 'webm' ? 'video/webm' : ext === 'ogv' ? 'video/ogg' : 'video/mp4';
                    })()} />
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                currentMedia ? (
                  <img
                    src={currentMedia}
                    alt={`${product.name} ${currentImageIndex + 1}`}
                    className="main-image"
                  />
                ) : (
                  <Product3DViewer />
                )
              )}

              { (product.images.length + (product.video && videoAvailable ? 1 : 0)) > 1 && (
                <>
                  <button onClick={prevImage} className="image-nav prev" aria-label="Anterior">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M15 18L9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button onClick={nextImage} className="image-nav next" aria-label="Siguiente">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div className="image-indicators">
                    {Array.from({ length: product.images.length + (product.video ? 1 : 0) }).map((_, index) => (
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
            {(product.images.length + (product.video ? 1 : 0)) > 1 && (
              <div className="thumbnail-gallery">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  >
                    <img src={img} alt={`Miniatura ${index + 1}`} />
                  </button>
                ))}

                {product.video && videoAvailable && (
                  <button
                    key="video-thumb"
                    onClick={() => setCurrentImageIndex(product.images.length)}
                    className={`thumbnail ${product.images.length === currentImageIndex ? 'active' : ''}`}
                  >
                    <div className="thumbnail-video-wrap">
                      <video src={product.video} muted playsInline loop className="thumbnail-video" />
                      <div className="video-overlay">▶</div>
                    </div>
                  </button>
                )}

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
              <span className="price">${displayedPrice.toLocaleString('es-MX')}</span>
              <span className="currency">MXN</span>
            </div>

            {isEssenceProduct && (
              <div style={{ marginTop: 8 }}>
                <label style={{ fontSize: 13, color: '#64748b', marginRight: 8 }}>Tamaño:</label>
                <select value={selectedSize.value} onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  const s = essenceSizes.find(x => x.value === v) || essenceSizes[0];
                  setSelectedSize(s);
                }} style={{ padding: 8, borderRadius: 8 }} onClick={(e) => e.stopPropagation()}>
                  {essenceSizes.map(s => <option key={s.value} value={s.value}>{s.label} - ${s.price}</option>)}
                </select>
              </div>
            )}

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


      </div>
    </div>
  );
};

export default Modal;