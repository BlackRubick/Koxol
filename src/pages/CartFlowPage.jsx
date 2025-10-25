import React from 'react';
import CartFlow from '../pages/CartFlow';

const CartFlowPage = () => {
    return (
        <div style={styles.container}>
            <CartFlow />
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Inter, Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: '1rem', // Agregar padding interno para diseño limpio
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        overflow: 'hidden',
    },
};

export default CartFlowPage;