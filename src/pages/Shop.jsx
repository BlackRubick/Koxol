import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import products from '../data/products';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import ChatbotButton from '../components/atoms/ChatbotButton';
import ChatMessenger from '../components/atoms/ChatMessenger';
import ProductCard from '../components/atoms/ProductCard'; // Import ProductCard
import Modal from '../components/atoms/Modal'; // Import Modal component

const Shop = () => {
	const navigate = useNavigate();
	const { cart, addToCart } = useCart(); 
	const [searchTerm, setSearchTerm] = useState('');
	const [isMobile, setIsMobile] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [volume, setVolume] = useState(0.3);
	const [showVolumeSlider, setShowVolumeSlider] = useState(false);
	const [chatOpen, setChatOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product
	const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
	const cartIconRef = useRef(null);
	const audioRef = useRef(null);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const rootElement = document.getElementById('root');
		if (rootElement) {
			rootElement.classList.add('shop');
		}
		return () => {
			if (rootElement) {
				rootElement.classList.remove('shop');
			}
		};
	}, []);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
			audioRef.current.play().catch(error => {
				console.log('Autoplay bloqueado. El usuario debe interactuar primero.');
				setIsMuted(true);
			});
		}
	}, []);

	const toggleMute = () => {
		if (audioRef.current) {
			audioRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
			if (isMuted && audioRef.current.paused) {
				audioRef.current.play().catch(err => console.log('Error al reproducir:', err));
			}
		}
	};

	const handleVolumeChange = (event) => {
		const newVolume = parseFloat(event.target.value);
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
			if (audioRef.current.muted) {
				audioRef.current.muted = false;
				setIsMuted(false);
			}
		}
		setVolume(newVolume);
	};

	const filters = [
		{ name: 'Llega mañana', active: false },
		{ name: 'FULL', subtitle: 'te da envío gratis', active: false },
		{ name: 'Envío gratis', active: false },
	];

	const categories = [
		{ name: 'Spray', count: products.filter(p => p.name.toLowerCase().includes('spray')).length },
		{ name: 'Crema', count: products.filter(p => p.name.toLowerCase().includes('crema')).length },
		{ name: 'Velas', count: products.filter(p => p.name.toLowerCase().includes('vela')).length },
		{ name: 'Lociones', count: products.filter(p => p.name.toLowerCase().includes('locion')).length },
		{ name: 'Esencias', count: products.filter(p => p.name.toLowerCase().includes('esencia')).length },
		{ name: 'Pulseras', count: products.filter(p => p.name.toLowerCase().includes('pulsera')).length },
	];

	const brands = [
		{ name: 'Koxol', count: products.length },
	];

	const filteredProducts = products.filter(p =>
		p.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleProductClick = (productId) => {
		const product = products.find(p => p.id === productId);
		setSelectedProduct(product);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedProduct(null);
	};

	return (
		<div style={styles.container}>
			{/* Header */}
			<header style={styles.header}>
				<div style={styles.headerContent}>
					{/* Logo que redirige a la raíz */}
					<div style={styles.logo} onClick={() => navigate('/')}>
						<span style={styles.logoKoxol}>K'oxol</span>
						<span style={styles.logoSub}>Tienda Natural </span>
					</div>
					<div style={styles.headerSearchBox}>
						<input
							type="text"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							placeholder="Buscar productos, marcas y más..."
							style={styles.headerSearchInput}
						/>
						<button style={styles.headerSearchBtn}>
							<Search size={20} color="#176c3a" />
						</button>
					</div>
					<div style={styles.headerRight}>
						<MapPin size={18} color="#176c3a" />
						<span style={styles.headerLocation}>Enviar a tu domicilio</span>
						<button ref={cartIconRef} style={styles.headerCartBtn} onClick={() => navigate('/cart')}>
							<ShoppingCart size={22} color="#176c3a" />
							<span style={styles.headerCartCount}>
								{cart.reduce((acc, item) => acc + item.qty, 0)}
							</span>
						</button>
					</div>
				</div>
			</header>

			{/* Main Container con max-width centrado */}
			<div style={isMobile ? styles.mainWrapperMobile : styles.mainWrapper}>
				<div style={isMobile ? styles.mainFullMobile : styles.mainFull}>
					{/* Sidebar */}
					<aside style={isMobile ? styles.sidebarMobile : styles.sidebar}>
						<div style={styles.resultsCount}>
							<h1 style={styles.title}>Catálogo K'oxol</h1>
							<p style={styles.count}>{products.length} resultados</p>
						</div>
						<div style={styles.filterSection}>
							{filters.map((filter, index) => (
								<div key={index} style={styles.filterItem}>
									<label style={styles.filterLabel}>
										<span>{filter.name}</span>
										{filter.subtitle && (
											<span style={styles.filterSubtitle}>
												{filter.subtitle}
											</span>
										)}
									</label>
									<input type="checkbox" style={styles.checkbox} />
								</div>
							))}
						</div>
						<div style={styles.filterSection}>
							<h3 style={styles.filterTitle}>Formato</h3>
							{categories.map((cat, index) => (
								<div key={index} style={styles.categoryItem}>
									<span>{cat.name}</span>
									<span style={styles.categoryCount}>({cat.count})</span>
								</div>
							))}
						</div>
						<div style={styles.filterSection}>
							<h3 style={styles.filterTitle}>Marca</h3>
							{brands.map((brand, index) => (
								<div key={index} style={styles.categoryItem}>
									<span>{brand.name}</span>
									<span style={styles.categoryCount}>({brand.count})</span>
								</div>
							))}
						</div>
					</aside>

					{/* Products Grid */}
					<main style={styles.contentFull}>
						<div style={styles.sortRow}>
							<span style={styles.sortLabel}>Ordenar por</span>
							<select style={styles.sortSelect}>
								<option>Más relevantes</option>
								<option>Menor precio</option>
								<option>Mayor precio</option>
							</select>
						</div>
						<div
							style={
								isMobile
									? styles.productsGridMobile
									: styles.productsGridFull
							}
						>
							{filteredProducts.map(product => (
								<ProductCard
									key={product.id}
									id={product.id}
									price={product.price}
									image={product.image}
									name={product.name}
									desc={product.desc}
									onClick={handleProductClick} // Pass click handler
								/>
							))}
						</div>
					</main>
				</div>
			</div>

			<audio ref={audioRef} src="/musica-relajante.mp3" loop />

			<div 
				onMouseEnter={() => setShowVolumeSlider(true)}
				onMouseLeave={() => setShowVolumeSlider(false)}
				style={{ 
					position: 'fixed', 
					bottom: '40px', 
					left: '20px', 
					zIndex: 1000,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '10px'
				}}
			>
				{showVolumeSlider && (
					<div style={{
						padding: '0',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '10px',
						marginBottom: '10px'
					}}>
						<input
							type="range"
							min="0"
							max="1"
							step="0.01"
							value={volume}
							onChange={handleVolumeChange}
							style={{ 
								width: '100px',
								cursor: 'pointer',
								transform: 'rotate(-90deg)',
								transformOrigin: 'center'
							}}
							title="Ajustar volumen"
							aria-label="Control de volumen"
						/>
						<span style={{ fontSize: '12px', color: '#666', marginTop: '30px' }}>
							{Math.round(volume * 100)}%
						</span>
					</div>
				)}

				<button 
					onClick={toggleMute}
					style={{ 
						width: '60px',
						height: '60px',
						borderRadius: '50%',
						background: isMuted ? '#ccc' : '#4CAF50',
						border: 'none',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
						transition: 'all 0.3s ease',
						color: 'white'
					}}
					title={isMuted ? 'Activar sonido' : 'Silenciar'}
					aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
				>
					{isMuted ? <FaVolumeMute size={28} /> : <FaVolumeUp size={28} />}
				</button>
			</div>

			{/* Botón del chatbot */}
			<ChatbotButton onClick={() => setChatOpen(o => !o)} />

			{/* Ventana del chatbot */}
			<ChatMessenger open={chatOpen} onClose={() => setChatOpen(false)} />

			{isModalOpen && selectedProduct && (
				<Modal
					product={selectedProduct} // Pass the selected product directly
					onClose={closeModal}
				/>
			)}
		</div>
	);
};

const styles = {
	container: {
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
		backgroundColor: '#ebebeb',
		minHeight: '100vh',
		padding: 0,
		margin: 0,
		width: '100vw',
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
	},
	header: {
		background: '#fff',
		borderBottom: '1px solid #e0e0e0',
		position: 'sticky',
		top: 0,
		zIndex: 100,
		boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
		width: '100%',
		boxSizing: 'border-box',
	},
	headerContent: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		maxWidth: '100%',
		margin: 0,
		padding: '12px 20px',
		gap: '20px',
		boxSizing: 'border-box',
		flexWrap: 'wrap',
	},
	logo: {
		fontSize: '1.5rem',
		fontWeight: 800,
		color: '#176c3a',
		letterSpacing: '0.01em',
		minWidth: 140,
		display: 'flex',
		alignItems: 'center',
		gap: 6,
		flexShrink: 0,
		cursor: 'pointer', // Cambiado a pointer
	},
	logoKoxol: {
		color: '#176c3a',
		fontWeight: 900,
	},
	logoSub: {
		color: '#169c7c',
		fontWeight: 600,
	},
	headerSearchBox: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		background: '#f8f8f8',
		borderRadius: 6,
		overflow: 'hidden',
		boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
		alignItems: 'center',
		minWidth: 200,
		maxWidth: 600,
	},
	headerSearchInput: {
		flex: 1,
		border: '1px solid #000',
		borderRadius: '20px', // Added border-radius to make the search input rounded
		padding: '10px 16px',
		fontSize: '15px',
		outline: 'none',
		background: 'transparent',
		color: '#000',
	},
	headerSearchBtn: {
		background: 'none',
		border: 'none',
		padding: '0 14px',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
	},
	headerRight: {
		display: 'flex',
		alignItems: 'center',
		gap: 10,
		fontSize: '14px',
		flexShrink: 0,
		justifyContent: 'flex-end',
	},
	headerLocation: {
		color: '#176c3a',
		fontWeight: 500,
	},
	headerCartBtn: {
		background: 'none',
		border: 'none',
		marginLeft: 10,
		cursor: 'pointer',
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
	},
	headerCartCount: {
		position: 'absolute',
		top: -7,
		right: -7,
		background: '#176c3a',
		color: '#fff',
		borderRadius: '50%',
		fontSize: '11px',
		fontWeight: 700,
		padding: '3px 6px',
		minWidth: 18,
		textAlign: 'center',
	},
	// Wrapper para centrar todo el contenido
	mainWrapper: {
		width: '100vw',
		backgroundColor: '#ebebeb',
		margin: 0,
		padding: 0,
		display: 'flex',
		flexDirection: 'row',
		boxSizing: 'border-box',
		alignItems: 'flex-start',
	},
	mainWrapperMobile: {
		width: '100%',
		backgroundColor: '#ebebeb',
	},
	// Main con max-width centrado
	mainFull: {
		display: 'flex',
		width: '100%',
		margin: 0,
		padding: 0,
		gap: '20px',
		alignItems: 'flex-start',
		boxSizing: 'border-box',
	},
	mainFullMobile: {
		display: 'flex',
		flexDirection: 'column',
		maxWidth: '100%',
		margin: '0 auto',
		padding: '15px',
		gap: '15px',
		boxSizing: 'border-box',
	},
	sidebar: {
		width: '250px',
		flexShrink: 0,
		textAlign: 'left',
		margin: 0,
		padding: 0,
	},
	sidebarMobile: {
		width: '100%',
	},
	resultsCount: {
		backgroundColor: 'white',
		padding: '20px',
		borderRadius: '6px',
		marginBottom: '15px',
		boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
	},
	title: {
		fontSize: '24px',
		fontWeight: '700',
		margin: '0 0 5px 0',
		color: '#176c3a',
	},
	count: {
		fontSize: '14px',
		color: '#666',
		margin: 0,
	},
	filterSection: {
		backgroundColor: 'white',
		padding: '20px',
		borderRadius: '6px',
		marginBottom: '15px',
		boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
	},
	filterItem: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '10px 0',
		borderBottom: '1px solid #f5f5f5',
	},
	filterLabel: {
		display: 'flex',
		flexDirection: 'column',
		fontSize: '14px',
	},
	filterSubtitle: {
		fontSize: '12px',
		color: '#666',
		marginTop: '2px',
	},
	checkbox: {
		width: '18px',
		height: '18px',
		cursor: 'pointer',
	},
	filterTitle: {
		fontSize: '16px',
		fontWeight: '600',
		margin: '0 0 12px 0',
		color: '#333',
	},
	categoryItem: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: '8px 0',
		fontSize: '14px',
		color: '#333',
		cursor: 'pointer',
		transition: 'color 0.2s',
	},
	categoryCount: {
		color: '#999',
		fontSize: '13px',
	},
	contentFull: {
		flex: 1,
		minWidth: 0,
		boxSizing: 'border-box',
		textAlign: 'left',
		margin: 0,
		padding: 0,
	},
	sortRow: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		gap: '10px',
		fontSize: '14px',
		marginBottom: '20px',
		padding: '12px 16px',
		backgroundColor: 'white',
		borderRadius: '6px',
		boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
	},
	sortLabel: {
		color: '#666',
		fontWeight: 500,
	},
	sortSelect: {
		border: 'none',
		fontSize: '14px',
		cursor: 'pointer',
		padding: '6px',
		fontWeight: 500,
		background: 'transparent',
		color: '#333',
		outline: 'none',
	},
	productsGridFull: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
		gap: '16px',
		width: '100%',
		boxSizing: 'border-box',
		justifyItems: 'start',
	},
	productsGridMobile: {
		display: 'grid',
		gridTemplateColumns: '1fr',
		gap: '12px',
		width: '100%',
		boxSizing: 'border-box',
	},
	productCard: {
		backgroundColor: 'white',
		borderRadius: '6px',
		overflow: 'hidden',
		boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
		cursor: 'pointer',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		minHeight: '300px',
	},
	'@global': {
		'.product-card': {
			transition: 'transform 0.3s ease, box-shadow 0.3s ease',
		},
		'.product-card:hover': {
			transform: 'scale(1.05)',
			boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
		},
	},
	productImage: {
		position: 'relative',
		width: '100%',
		paddingTop: '100%',
		backgroundColor: '#f8f8f8',
		overflow: 'hidden',
	},
	image: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	},
	productInfo: {
		padding: '16px',
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
	},
	productName: {
		fontSize: '14px',
		fontWeight: '600',
		color: '#176c3a',
		margin: '0 0 8px 0',
		lineHeight: '1.4',
		minHeight: '40px',
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
	},
	priceContainer: {
		marginBottom: '8px',
	},
	price: {
		fontSize: '24px',
		fontWeight: '700',
		color: '#176c3a',
	},
	productDesc: {
		color: '#666',
		fontSize: '13px',
		margin: '0 0 12px 0',
		lineHeight: '1.4',
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
		flex: 1,
	},
	addButton: {
		width: '100%',
		padding: '12px',
		background: 'linear-gradient(90deg, #169c7c 0%, #2D5016 100%)',
		color: 'white',
		border: 'none',
		borderRadius: '4px',
		fontSize: '14px',
		fontWeight: '600',
		cursor: 'pointer',
		transition: 'transform 0.2s, box-shadow 0.2s',
		marginTop: 'auto',
	},
	'@keyframes moveToCart': {
		'0%': {
			transform: 'scale(1)',
			opacity: 1,
		},
		'50%': {
			transform: 'scale(0.5)',
			opacity: 0.5,
		},
		'100%': {
			transform: 'translate(300px, -300px) scale(0)',
			opacity: 0,
		},
	},
};

export default Shop;