import React, { useState } from 'react';
import { RECIPES_CATALOG } from '../../models/constants';

export function CafeteriaView({
  currentUser,
  cafeterias,
  menuItems,
  setMenuItems,
  orders = [],
  setOrders,
  isDarkMode
}) {
  const [activeTab, setActiveTab] = useState('orders'); // Cambiado a 'orders' para ir directo a pedidos al hacer clic
  const [selectedDay, setSelectedDay] = useState(() => new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState('todos');
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  // Obtener la cafetería vinculada al usuario administrador actual
  const myCafeteria = cafeterias.find(c => c.ownerId === currentUser.id || c.id === currentUser.id);

  // Filtrar platillos publicados del cafetín
  const publishedMenuItems = myCafeteria ? menuItems.filter(m => 
    m.cafeteriaId === myCafeteria.id && 
    (m.date ? m.date === selectedDay : true) &&
    (mealType === 'todos' ? true : m.category === mealType)
  ) : [];

  // FILTRADO FLEXIBLE DE PEDIDOS (Por ID de cafetín o Nombre de cafetín)
  const myOrders = myCafeteria ? orders.filter(o => 
    o.cafeteriaId === myCafeteria.id || 
    (o.cafeteriaName && myCafeteria.name && o.cafeteriaName.toLowerCase().includes(myCafeteria.name.toLowerCase()))
  ) : orders;

  // Activar/Publicar una opción del Catálogo Maestro al Menú del Día
  const handlePublishFromCatalog = (recipe) => {
    if (!myCafeteria) return;

    const alreadyPublished = menuItems.some(
      m => m.cafeteriaId === myCafeteria.id && m.date === selectedDay && m.name === recipe.name
    );

    if (alreadyPublished) {
      alert(`"${recipe.name}" ya está publicado en el menú para el ${selectedDay}.`);
      return;
    }

    const newPublishedDish = {
      id: 'pub_' + Date.now() + Math.random(),
      cafeteriaId: myCafeteria.id,
      date: selectedDay,
      name: recipe.name,
      price: recipe.price,
      category: recipe.category,
      description: recipe.description,
      image: recipe.image,
      stock: 20
    };

    setMenuItems([...menuItems, newPublishedDish]);
    alert(`¡"${recipe.name}" ha sido publicado en el menú del día!`);
  };

  // Quitar platillo del menú del día
  const handleUnpublishDish = (dishId) => {
    setMenuItems(menuItems.filter(m => m.id !== dishId));
  };

  // Vaciar Menú
  const handleClearDayMenu = () => {
    if (confirm(`¿Deseas desmarcar todo el menú para la fecha ${selectedDay}?`)) {
      setMenuItems(menuItems.filter(m => !(m.cafeteriaId === myCafeteria?.id && m.date === selectedDay)));
    }
  };

  // Actualizar estado de entrega del pedido
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  if (!myCafeteria) {
    return (
      <div className={`p-8 text-center rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <p className="text-4xl mb-2">🏪</p>
        <h3 className="font-extrabold text-lg">No se encontró un cafetín vinculado a esta cuenta de administrador.</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner Principal del Cafetín */}
      <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-lg flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black">{myCafeteria.name}</h2>
          <p className="text-emerald-200 text-xs mt-1">Panel de Control de Menú Diario • Cód: <strong>{currentUser.schoolCode || "12117"}</strong></p>
        </div>

        {/* Botones para alternar entre Pestañas */}
        <div className="flex gap-2 bg-emerald-950/60 p-1.5 rounded-2xl border border-emerald-800/50 text-xs font-bold">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2.5 rounded-xl transition ${activeTab === 'menu' ? 'bg-amber-400 text-slate-900 font-black shadow' : 'text-emerald-200 hover:text-white'}`}
          >
            📋 Menú Publicado ({publishedMenuItems.length})
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition ${activeTab === 'orders' ? 'bg-amber-400 text-slate-900 font-black shadow' : 'text-emerald-200 hover:text-white'}`}
          >
            📥 Pedidos ({myOrders.length})
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PESTAÑA 1: GESTIÓN Y PUBLICACIÓN DEL MENÚ DIARIO                          */}
      {/* ========================================================================= */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className={`p-4 rounded-3xl border flex flex-wrap gap-4 justify-between items-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1">Fecha Programada</label>
                <input 
                  type="date" 
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="p-2 border rounded-xl text-xs font-bold bg-gray-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1">Filtrar Categoría</label>
                <div className="flex gap-1">
                  {['todos', 'desayuno', 'almuerzo', 'snack', 'extra', 'bebida'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setMealType(cat)}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold uppercase transition ${mealType === cat ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-slate-600 dark:bg-slate-800 dark:text-gray-300'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleClearDayMenu}
                className="px-3 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-xl hover:bg-red-200 transition"
              >
                🗑️ Limpiar Día
              </button>
              <button
                onClick={() => setShowCatalogModal(true)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-black rounded-xl shadow transition flex items-center gap-1"
              >
                📖 Abrir Catálogo Maestro y Publicar
              </button>
            </div>
          </div>

          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
            <h3 className="font-extrabold text-base mb-1">
              👁️ Menú Visible para los Estudiantes ({selectedDay})
            </h3>
            <p className="text-xs text-gray-400 mb-4">Los alumnos solo podrán reservar los elementos que estén listados aquí abajo[cite: 2].</p>

            {publishedMenuItems.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-2xl">
                <p className="text-4xl mb-2">🚫</p>
                <p className="text-sm font-bold text-gray-500">No has publicado ningún alimento para esta fecha.</p>
                <p className="text-xs text-gray-400 mt-1">Haz clic en <strong>"Abrir Catálogo Maestro y Publicar"</strong> para seleccionar el menú de hoy.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {publishedMenuItems.map(dish => (
                  <div key={dish.id} className={`p-3 rounded-2xl border flex gap-3 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-emerald-50/40 border-emerald-100'}`}>
                    <img src={dish.image} alt={dish.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm">{dish.name}</h4>
                          <span className="text-xs font-black text-emerald-600">${dish.price.toFixed(2)}</span>
                        </div>
                        <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded inline-block my-1">
                          {dish.category}
                        </span>
                        <p className="text-xs text-gray-400 line-clamp-1">{dish.description}</p>
                      </div>
                      <button 
                        onClick={() => handleUnpublishDish(dish.id)}
                        className="mt-2 py-1 px-2 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold rounded-lg border border-red-200 text-center"
                      >
                        ❌ Quitar del menú
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA 2: RECEPCIÓN Y GESTIÓN DE PEDIDOS RECIBIDOS                       */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
          <h3 className="font-black text-lg mb-1">📥 Reservas y Pedidos Recibidos ({myOrders.length})</h3>
          <p className="text-xs text-gray-400 mb-6">Actualiza el estado de entrega a medida que prepares o entregues los alimentos[cite: 1, 2].</p>

          {myOrders.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-2xl">
              <p className="text-4xl mb-2">📥</p>
              <p className="text-sm font-bold text-gray-500">No hay reservas activas registradas para este cafetín en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myOrders.map(ord => (
                <div key={ord.id} className={`p-5 rounded-3xl border ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-gray-50 border-gray-200'} shadow-sm`}>
                  
                  {/* Encabezado del Pedido */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-black text-sm text-emerald-700 dark:text-emerald-400">{ord.id}</span>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-white">Estudiante: <strong>{ord.studentName || "Estudiante"}</strong></h4>
                    </div>
                    <span className="text-base font-black text-emerald-600">${(ord.total || 0).toFixed(2)}</span>
                  </div>

                  {/* Lista de alimentos y extras solicitados */}
                  <div className="my-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 space-y-1">
                    <p className="text-[10px] font-extrabold uppercase text-gray-400 mb-1">Detalle del Pedido:</p>
                    {ord.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="font-semibold">• {item.name}</span>
                        <span className="font-bold text-emerald-600">${(item.price || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hora de retiro elegida */}
                  <div className="text-xs text-gray-500 mb-3 flex justify-between items-center">
                    <span>Hora de Retiro: <strong>{ord.pickupTime || "Recreo 1"}</strong></span>
                  </div>

                  {/* Selector de Estado de Pedido */}
                  <div className="pt-3 border-t border-gray-200/40 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400">Estado de Entrega:</span>
                    <select
                      value={ord.status || 'pending'}
                      onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                      className="text-xs font-black p-2 rounded-xl bg-white text-slate-900 border shadow-sm outline-none"
                    >
                      <option value="pending">⏳ Pendiente</option>
                      <option value="preparing">👨‍🍳 En Cocina</option>
                      <option value="ready">✅ Listo para Retiro</option>
                      <option value="delivered">🎉 Entregado</option>
                    </select>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL DEL CATÁLOGO MAESTRO DE OPCIONES */}
      {showCatalogModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl p-6 w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-black text-xl">📖 Catálogo Maestro de Opciones</h3>
                <p className="text-xs text-gray-400">Selecciona los platos/snacks/bebidas para publicar el {selectedDay}:</p>
              </div>
              <button 
                onClick={() => setShowCatalogModal(false)}
                className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full font-bold text-xs hover:bg-gray-200"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RECIPES_CATALOG.map(recipe => {
                const isAlreadyPublished = menuItems.some(
                  m => m.cafeteriaId === myCafeteria.id && m.date === selectedDay && m.name === recipe.name
                );

                return (
                  <div key={recipe.id} className={`p-3 rounded-2xl border flex gap-3 items-center ${isDarkMode ? 'border-slate-800 bg-slate-800/40' : 'border-gray-100 bg-gray-50'}`}>
                    <img src={recipe.image} alt={recipe.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs">{recipe.name}</h4>
                        <span className="text-xs font-black text-emerald-600">${recipe.price.toFixed(2)}</span>
                      </div>
                      <span className="text-[9px] uppercase font-bold text-gray-400 block my-0.5">{recipe.category}</span>
                      <p className="text-[10px] text-gray-400 line-clamp-1">{recipe.description}</p>
                      
                      <button
                        onClick={() => handlePublishFromCatalog(recipe)}
                        disabled={isAlreadyPublished}
                        className={`mt-2 py-1 px-3 text-[10px] font-black rounded-lg w-full transition ${
                          isAlreadyPublished 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow'
                        }`}
                      >
                        {isAlreadyPublished ? '✓ Ya Publicado' : '＋ Publicar en Menú'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}