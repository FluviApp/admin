import React from 'react';
import Sidebar from '../../components/Sidebar';

const InfoTienda = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold">Información</h1>
                <p>Contenido de la pantalla de pedidos.</p>
            </div>
        </div>
    );
};

export default InfoTienda;