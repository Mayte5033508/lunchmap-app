import React, { useState } from 'react';
import { useAppController } from './controllers/useAppController';
import { useAuthController } from './controllers/useAuthController';
import { LogoLunchMap } from './views/components/LogoLunchMap';
import { LoginView } from './views/pages/LoginView';
import { StudentView } from './views/pages/StudentView';
import { CafeteriaView } from './views/pages/CafeteriaView';

export default function App() {
  const appCtrl = useAppController();
  const authCtrl = useAuthController(appCtrl.users, appCtrl.setUsers, appCtrl.setCafeterias);
  
  const [currentTab, setCurrentTab] = useState('home');
  const isDarkMode = appCtrl.theme === 'dark';

  // Si no hay usuario autenticado, muestra la pantalla de Login
  if (!authCtrl.currentUser) {
    return <LoginView authCtrl={authCtrl} isDarkMode={isDarkMode} />;
  }

  // Verificar el rol del usuario logueado ('student' o 'cafeteria')
  const isStudent = authCtrl.currentUser.role === 'student';

  return (
    <div className={`min-h-screen pb-24 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-slate-800'}`}>
      
      {/* BARRA SUPERIOR DE NAVEGACIÓN */}
      <header className={`${isDarkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-emerald-900 text-white'} sticky top-0 z-40 shadow-md`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="bg-white p-1 rounded-xl shadow-sm">
              <LogoLunchMap className="w-8 h-6" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight leading-none text-white">LunchMap</h1>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">TechNova</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-200 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-emerald-700/50">
              🏫 Cód: {authCtrl.currentUser.schoolCode || "12117"}
            </span>

            {/* Selector de Tema Claro / Oscuro */}
            <button
              onClick={() => appCtrl.setTheme(appCtrl.theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-slate-800 text-amber-300 text-xs font-bold transition hover:bg-slate-700"
              title="Cambiar tema"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Botón de Cierre de Sesión */}
            <button
              onClick={authCtrl.handleLogout}
              className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto p-4">
        {currentTab === 'home' && (
          isStudent ? (
            <StudentView 
              currentUser={authCtrl.currentUser}
              cafeterias={appCtrl.cafeterias}
              menuItems={appCtrl.menuItems}
              cart={appCtrl.cart}
              setCart={appCtrl.setCart}
              orders={appCtrl.orders}
              onCheckout={(pickupTime) => appCtrl.handleCheckout(authCtrl.currentUser, pickupTime)}
              isDarkMode={isDarkMode}
            />
          ) : (
            <CafeteriaView 
              currentUser={authCtrl.currentUser}
              cafeterias={appCtrl.cafeterias}
              menuItems={appCtrl.menuItems}
              setMenuItems={appCtrl.setMenuItems}
              orders={appCtrl.orders}
              setOrders={appCtrl.setOrders}
              isDarkMode={isDarkMode}
            />
          )
        )}
      </main>

      {/* BARRA INFERIOR DE NAVEGACIÓN */}
      <nav className={`fixed bottom-0 left-0 right-0 py-2 px-6 flex justify-around border-t z-40 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <button 
          onClick={() => setCurrentTab('home')} 
          className={`text-xs font-extrabold flex items-center gap-1 ${currentTab === 'home' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          🏠 {isStudent ? 'Inicio y Cafetines' : 'Panel del Cafetín'}
        </button>
      </nav>
      
    </div>
  );
}