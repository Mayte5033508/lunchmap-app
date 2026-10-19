import React, { useEffect } from 'react';
import { LogoLunchMap } from '../components/LogoLunchMap';

export function LoginView({ authCtrl, isDarkMode }) {
  // Inicialización de Google solo cuando se selecciona el tab de Estudiante
  useEffect(() => {
    if (authCtrl.roleType !== 'student' || authCtrl.currentUser) return;

    let isMounted = true;

    const initGoogle = () => {
      if (!isMounted) return;

      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: "424539269776-5m7c0o47g1pmu40s3sclbog283qsl8rn.apps.googleusercontent.com",
          callback: authCtrl.handleGoogleResponse
        });

        const btnContainer = document.getElementById("googleButtonDiv");
        if (btnContainer) {
          btnContainer.innerHTML = ""; 
          window.google.accounts.id.renderButton(btnContainer, { 
            theme: "outline", 
            size: "large", 
            width: 280,
            text: "continue_with" 
          });
        }
      } else {
        setTimeout(initGoogle, 300);
      }
    };

    initGoogle();

    return () => {
      isMounted = false;
    };
  }, [authCtrl.roleType, authCtrl.currentUser, authCtrl.handleGoogleResponse]);

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-emerald-950 text-slate-800'}`}>
      <div className={`p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md text-center ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
        
        {/* Encabezado */}
        <div className="flex justify-center items-center gap-2 mb-2">
          <LogoLunchMap className="w-16 h-12" />
          <h1 className="text-3xl font-extrabold tracking-tight">LunchMap</h1>
        </div>
        <p className="text-xs text-emerald-600 font-semibold uppercase tracking-widest mb-6">Desarrollado por TechNova</p>
        
        {/* Selector de Rol */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase mb-2 text-left">Selecciona tipo de acceso</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              type="button" 
              className={`p-3 rounded-xl border text-xs font-extrabold transition ${authCtrl.roleType === 'student' ? 'bg-emerald-800 text-white shadow' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'}`} 
              onClick={() => authCtrl.setRoleType('student')}
            >
              👨‍🎓 Estudiante
            </button>
            <button 
              type="button" 
              className={`p-3 rounded-xl border text-xs font-extrabold transition ${authCtrl.roleType === 'cafeteria' ? 'bg-emerald-800 text-white shadow' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'}`} 
              onClick={() => authCtrl.setRoleType('cafeteria')}
            >
              🏪 Cafetín / Admin
            </button>
          </div>
        </div>

        {/* CÓDIGO DE ESCUELA (Común para ambos) */}
        <div className="mb-6 text-left">
          <label className="block text-xs font-bold uppercase mb-1">Código de Infraestructura del Colegio</label>
          <input 
            type="text" 
            placeholder="Ej. 12117" 
            className="w-full p-3 border rounded-xl text-slate-900 text-sm font-mono font-bold tracking-wider" 
            value={authCtrl.schoolCode} 
            onChange={e => authCtrl.setSchoolCode(e.target.value)} 
          />
        </div>

        {/* FORMULARIO ESTUDIANTE (Exclusivo Google @clases.edu.sv) */}
        {authCtrl.roleType === 'student' ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 text-left">
              🔒 <strong>Acceso Exclusivo Estudiantil</strong><br/>
              Inicia sesión con tu correo institucional <strong>@clases.edu.sv</strong>.
            </div>
            <div id="googleButtonDiv" className="flex justify-center w-full overflow-hidden min-h-[44px]"></div>
          </div>
        ) : (
          /* FORMULARIO CAFETÍN (Usuario y Contraseña) */
          <form onSubmit={authCtrl.handlePasswordLogin} className="space-y-4 text-left">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900">
              🔑 <strong>Panel de Cafetín Escolar</strong><br/>
              Ingresa tus credenciales de administración.
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Usuario / Correo</label>
              <input 
                type="text"
                required
                placeholder="Ej. cafetin_central" 
                className="w-full p-3 border rounded-xl text-slate-900 text-sm font-semibold"
                value={authCtrl.cafeteriaLoginData.usernameOrEmail}
                onChange={e => authCtrl.setCafeteriaLoginData({ ...authCtrl.cafeteriaLoginData, usernameOrEmail: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Contraseña</label>
              <input 
                type="password"
                required
                placeholder="••••••••" 
                className="w-full p-3 border rounded-xl text-slate-900 text-sm font-semibold"
                value={authCtrl.cafeteriaLoginData.password}
                onChange={e => authCtrl.setCafeteriaLoginData({ ...authCtrl.cafeteriaLoginData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold rounded-xl text-sm shadow-lg transition mt-2"
            >
              Ingresar al Panel ➔
            </button>
          </form>
        )}

      </div>
    </div>
  );
}