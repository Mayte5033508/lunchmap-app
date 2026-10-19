import React, { useState } from 'react';
import { ALWAYS_AVAILABLE_EXTRAS } from '../../models/constants';

export function StudentView({ 
  currentUser, 
  cafeterias, 
  menuItems, 
  cart, 
  setCart, 
  orders = [],
  onCheckout, 
  isDarkMode 
}) {
  const [selectedCafeteriaProfile, setSelectedCafeteriaProfile] = useState(null);
  const [pickupTime, setPickupTime] = useState('Recreo 1');
  const [showCartModal, setShowCartModal] = useState(false);

  const DEFAULT_SCHOOL_CODE = "12117";
  const userSchoolCode = currentUser?.schoolCode || DEFAULT_SCHOOL_CODE;
  const schoolCafeterias = cafeterias.filter(c => (c.schoolCode || DEFAULT_SCHOOL_CODE) === userSchoolCode);

  // Filtrar los pedidos que ha realizado el estudiante actual
  const myActiveOrders = orders.filter(o => o.studentId === currentUser?.id || o.studentName === currentUser?.name);

  // Funciones para gestionar el carrito de compras
  const addToCart = (item, cafeteriaName) => {
    setCart([
      ...cart, 
      { 
        ...item, 
        cartId: 'cart_' + Date.now() + Math.random(),
        cafeteriaName: cafeteriaName || item.cafeteriaName || 'Cafetín Escolar'
      }
    ]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(i => i.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    setShowCartModal(false);
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) return;
    onCheckout(pickupTime);
    setShowCartModal(false);
  };

  const totalCart = cart.reduce((s, i) => s + i.price, 0);

  // Botón flotante permanente para acceder al carrito
  const RenderFloatingCartButton = () => (
    <div className="fixed bottom-16 right-4 z-40">
      <button
        onClick={() => setShowCartModal(true)}
        className="bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-emerald-400 transition transform hover:scale-105"
      >
        <span className="text-base">🛒</span>
        <span className="text-xs">Ver mi Pedido</span>
        <span className="bg-amber-400 text-slate-900 font-black text-[10px] px-2 py-0.5 rounded-full">
          {cart.length}
        </span>
      </button>
    </div>
  );

  // Modal para revisar y editar el pedido actual
  const RenderCartModal = () => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className={`rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col max-h-[85vh] ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        
        <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-100 dark:border-slate-800">
          <div>
            <h3 className="font-black text-lg">🛒 Carrito de Compras</h3>
            <p className="text-xs text-gray-400">Puedes pedir productos de cualquiera de los cafetines</p>
          </div>
          <button
            onClick={() => setShowCartModal(false)}
            className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full font-bold text-xs hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-8 flex-1 flex flex-col justify-center">
            <p className="text-4xl mb-2">🛍️</p>
            <p className="text-sm font-bold text-gray-400">Tu carrito de apartado está vacío.</p>
            <p className="text-xs text-gray-400 mt-1">Selecciona un cafetín para agregar tus almuerzos, antojos o extras.</p>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto flex-1 pr-1 space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.cartId} className={`p-3 rounded-2xl border flex justify-between items-center text-xs ${isDarkMode ? 'border-slate-800 bg-slate-800/40' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />}
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <span className="text-[10px] text-emerald-600 font-bold block">{item.cafeteriaName}</span>
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold"
                    title="Eliminar ítem"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1">Hora Programada de Retiro</label>
              <select 
                value={pickupTime} 
                onChange={e => setPickupTime(e.target.value)}
                className="w-full p-2.5 rounded-xl border text-xs font-bold bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Recreo 1">Recreo 1</option>
                <option value="Recreo 2">Recreo 2</option>
                <option value="Almuerzo">Hora de Almuerzo</option>
              </select>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center font-black text-base">
                <span>Total a Pagar:</span>
                <span className="text-emerald-600">${totalCart.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={clearCart}
                  className="py-2.5 border border-red-200 text-red-600 font-bold text-xs rounded-xl hover:bg-red-50 transition"
                >
                  Vaciar Carrito
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className="py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl shadow transition"
                >
                  Confirmar Apartado
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );

  // VISTA DETALLADA DEL MENÚ DE UN CAFETÍN SELECCIONADO
  if (selectedCafeteriaProfile) {
    const cafeteriaDishes = menuItems.filter(m => m.cafeteriaId === selectedCafeteriaProfile.id);

    return (
      <div className="animate-fadeIn space-y-6">
        <button
          onClick={() => setSelectedCafeteriaProfile(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm"
        >
          ⬅ Volver a Cafetines
        </button>

        <div className={`p-6 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <img src={selectedCafeteriaProfile.logo} alt={selectedCafeteriaProfile.name} className="w-16 h-16 rounded-2xl object-cover border shadow" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black">{selectedCafeteriaProfile.name}</h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase">Abierto</span>
              </div>
              <p className="text-xs font-bold text-emerald-600 mt-1">📍 {selectedCafeteriaProfile.location}</p>
            </div>
          </div>
        </div>

        {/* MENÚ PUBLICADO */}
        <div>
          <h3 className="font-black text-lg mb-3">🍽️ Menú Publicado del Día</h3>
          {cafeteriaDishes.length === 0 ? (
            <div className={`p-8 text-center rounded-3xl border border-dashed ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <p className="text-3xl mb-1">📋</p>
              <p className="text-sm font-bold text-gray-500">Este cafetín aún no ha publicado alimentos para el día de hoy.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cafeteriaDishes.map(dish => (
                <div key={dish.id} className={`border rounded-2xl p-3 flex gap-3 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-100'} shadow-sm`}>
                  <img src={dish.image} alt={dish.name} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm">{dish.name}</h4>
                        <span className="text-xs font-black text-emerald-600">${dish.price.toFixed(2)}</span>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded inline-block my-1">{dish.category}</span>
                      <p className="text-xs text-gray-400 line-clamp-2">{dish.description}</p>
                    </div>
                    <button
                      onClick={() => addToCart(dish, selectedCafeteriaProfile.name)}
                      className="mt-2 py-1.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg transition shadow flex justify-center items-center gap-1"
                    >
                      ＋ Agregar a mi Pedido
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EXTRAS DISPONIBLES SIEMPRE */}
        <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50/50 border-emerald-100'}`}>
          <h3 className="font-extrabold text-sm mb-1 text-emerald-900 dark:text-emerald-300">➕ Complementos y Extras (Disponibles Siempre)</h3>
          <p className="text-xs text-gray-500 mb-3">Puedes solicitar extras adicionales:</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ALWAYS_AVAILABLE_EXTRAS.map(extra => (
              <div key={extra.id} className="p-2.5 rounded-xl border bg-white dark:bg-slate-800 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold">{extra.name}</p>
                  <p className="text-emerald-600 font-black">${extra.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => addToCart(extra, selectedCafeteriaProfile.name)}
                  className="px-2 py-1 bg-emerald-800 text-white rounded-lg font-bold hover:bg-emerald-900"
                >
                  ＋
                </button>
              </div>
            ))}
          </div>
        </div>

        {RenderFloatingCartButton()}
        {showCartModal && RenderCartModal()}
      </div>
    );
  }

  // VISTA PRINCIPAL DE ESTUDIANTE (MUESTRA CAFETINES Y PEDIDOS REALIZADOS)
  return (
    <div className="space-y-6">
      {/* Banner Superior */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-black mb-1">¡Hola, {currentUser.name}! 👋</h2>
        <p className="text-emerald-200 text-sm">Servidor Escolar: <strong>Código {userSchoolCode}</strong></p>
      </div>

      {/* SECCIÓN 1: MIS PEDIDOS REALIZADOS Y SU ESTADO */}
      {myActiveOrders.length > 0 && (
        <div className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-amber-50/60 border-amber-200'}`}>
          <h3 className="font-extrabold text-base mb-3 text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <span>📋 Mis Pedidos Confirmados ({myActiveOrders.length})</span>
          </h3>
          <div className="space-y-3">
            {myActiveOrders.map(ord => (
              <div key={ord.id} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-amber-100'} shadow-sm`}>
                <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-slate-800 dark:text-white">{ord.id}</span>
                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                      🏪 {ord.cafeteriaName || 'Cafetín'}
                    </span>
                  </div>
                  <span className="text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-slate-700 px-2 py-0.5 rounded-full uppercase">
                    {ord.status === 'pending' ? '⏳ Pendiente' : ord.status === 'preparing' ? '👨‍🍳 En Cocina' : ord.status === 'ready' ? '✅ Listo' : '🎉 Entregado'}
                  </span>
                </div>

                <div className="text-xs text-gray-500 my-2 pl-2 border-l-2 border-amber-400">
                  {ord.items?.map((it, idx) => (
                    <span key={idx} className="block">• {it.name} (${it.price.toFixed(2)})</span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-gray-100 dark:border-slate-700">
                  <span className="text-gray-400">Hora de Retiro: <strong className="text-slate-800 dark:text-white">{ord.pickupTime}</strong></span>
                  <span className="text-emerald-600 font-black text-sm">${ord.total?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: TARJETAS DE LOS 3 CAFETINES SIN DESCRIPCIÓN INDIVIDUAL */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg">🏪 Selecciona un Cafetín para Explorar su Menú</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schoolCafeterias.map(caf => {
            const publishedCount = menuItems.filter(m => m.cafeteriaId === caf.id).length;
            const hasActiveOrder = myActiveOrders.some(o => o.cafeteriaId === caf.id || o.cafeteriaName === caf.name);

            return (
              <div 
                key={caf.id} 
                onClick={() => setSelectedCafeteriaProfile(caf)}
                className={`p-5 rounded-3xl border cursor-pointer hover:border-emerald-500 transition shadow-sm flex flex-col justify-between relative ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}
              >
                {/* Etiqueta si ya realizaste un pedido en este cafetín */}
                {hasActiveOrder && (
                  <span className="absolute -top-2 right-4 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                    ✅ Pedido Realizado
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <img src={caf.logo} alt={caf.name} className="w-14 h-14 rounded-2xl object-cover border" />
                  <div>
                    <h4 className="font-extrabold text-base">{caf.name}</h4>
                    <p className="text-xs text-emerald-600 font-semibold">📍 {caf.location}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-slate-800">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${publishedCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {publishedCount > 0 ? `🍽️ ${publishedCount} Alimentos hoy` : '⏳ 0 publicaciones'}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">Ver Menú ➔</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {RenderFloatingCartButton()}
      {showCartModal && RenderCartModal()}
    </div>
  );
}