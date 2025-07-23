import React from 'react';
import Sidebar from '../../components/Sidebar';

const Productos = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold">Productos</h1>
                <p>Contenido de la pantalla de productos.</p>
            </div>
        </div>
    );
};

export default Productos;