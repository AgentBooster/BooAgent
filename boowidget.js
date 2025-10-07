(function() {
    // El ID del div donde se insertará el widget. El usuario debe poner <div id="boo-agent-embed"></div> en su HTML.
    const WIDGET_TARGET_ID = 'boo-agent-embed';

    function loadExternalResources() {
        const resources = [
            { type: 'script', src: 'https://cdn.tailwindcss.com' },
            { type: 'link', rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
        ];
        resources.forEach(resource => {
            const el = document.createElement(resource.type);
            if (resource.type === 'script') {
                if (!document.querySelector(`script[src="${resource.src}"]`)) {
                    el.src = resource.src;
                    document.head.appendChild(el);
                }
            } else if (resource.type === 'link') {
                if (!document.querySelector(`link[href="${resource.href}"]`)) {
                    el.rel = resource.rel;
                    el.href = resource.href;
                    document.head.appendChild(el);
                }
            }
        });
    }

    const widgetCSS = `
        #${WIDGET_TARGET_ID} {
            opacity: 0;
            transition: opacity 0.4s ease-in-out;
        }
        #${WIDGET_TARGET_ID}.widget-loaded {
            opacity: 1;
        }
        #${WIDGET_TARGET_ID} body { font-family: 'Inter', sans-serif; }
        #${WIDGET_TARGET_ID} textarea::-webkit-scrollbar { width: 6px; }
        #${WIDGET_TARGET_ID} textarea::-webkit-scrollbar-track { background: transparent; }
        #${WIDGET_TARGET_ID} textarea::-webkit-scrollbar-thumb { background-color: #444444; border-radius: 3px; }
        #${WIDGET_TARGET_ID} textarea::-webkit-scrollbar-thumb:hover { background-color: #555555; }
        #${WIDGET_TARGET_ID} .voice-visualizer-bar { animation: pulse 1s infinite ease-in-out; }
        @keyframes pulse {
            0%, 100% { transform: scaleY(0.2); }
            50% { transform: scaleY(1); }
        }
        #${WIDGET_TARGET_ID} #file-preview-container { display: flex; overflow-x: auto; overflow-y: hidden; flex-wrap: nowrap; padding-bottom: 8px; scrollbar-width: thin; scrollbar-color: #444444 transparent; }
        #${WIDGET_TARGET_ID} #file-preview-container::-webkit-scrollbar { height: 4px; }
        #${WIDGET_TARGET_ID} #file-preview-container::-webkit-scrollbar-track { background: transparent; }
        #${WIDGET_TARGET_ID} #file-preview-container::-webkit-scrollbar-thumb { background-color: #444444; border-radius: 2px; }
        #${WIDGET_TARGET_ID} .file-preview-item { position: relative; display: flex; align-items: center; background-color: #2E3033; border-radius: 12px; padding: 8px; margin-right: 8px; margin-top: 4px; flex-shrink: 0; width: 180px; }
        #${WIDGET_TARGET_ID} .file-preview-item .file-icon { flex-shrink: 0; width: 32px; height: 32px; border-radius: 8px; background-color: #EF4444; display: flex; align-items: center; justify-content: center; }
        #${WIDGET_TARGET_ID} .file-preview-item .file-info { margin-left: 8px; display: flex; flex-direction: column; overflow: hidden; color: #E5E7EB; }
        #${WIDGET_TARGET_ID} .file-preview-item .file-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.875rem; line-height: 1.25rem; }
        #${WIDGET_TARGET_ID} .file-preview-item .file-type { font-size: 0.75rem; line-height: 1rem; color: #9CA3AF; }
        #${WIDGET_TARGET_ID} .file-preview-item .remove-btn { position: absolute; top: -4px; right: -4px; width: 16px; height: 16px; border-radius: 9999px; background-color: #4B5563; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        #${WIDGET_TARGET_ID} .file-preview-item img.preview-image { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
    `;
    
    // HTML del widget SIN el contenedor extra de fondo blanco/gris.
    const widgetHTML = `
        <div class="w-full max-w-4xl rounded-2xl shadow-2xl p-6 md:p-8 text-white relative overflow-hidden" 
             style="background: radial-gradient(125% 125% at 50% 101%, rgba(245,87,2,1) 10.5%, rgba(245,120,2,1) 16%, rgba(245,140,2,1) 17.5%, rgba(245,170,100,1) 25%, rgba(238,174,202,1) 40%, rgba(202,179,214,1) 65%, rgba(148,201,233,1) 100%);">
            <main class="flex-1 flex flex-col items-center text-center">
                <div class="w-full space-y-6">
                    <div class="flex justify-center">
                        <div class="bg-black/20 backdrop-blur-sm rounded-full pl-2 pr-4 py-2 flex items-center gap-3 w-fit">
                            <div class="relative flex-shrink-0">
                                <img class="w-8 h-8 rounded-full object-cover" src="https://res.cloudinary.com/dsdnpstgi/image/upload/v1756503469/Boo_Mastermind_-_vasyl_pavlyuchok_40606_httpss.mj.runDaU8K48LteU_close-up_port_3b5e9292-ef3c-4c7f-93c8-c1a99da3780e_3_skkffe.png" alt="Foto de Boo">
                                <span class="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-gray-800 animate-pulse"></span>
                            </div>
                            <span class="text-sm font-medium">Aquí puedes hablar conmigo.</span>
                        </div>
                    </div>
                    <h1 class="text-4xl md:text-5xl font-bold leading-tight">
                        ¿Puedo ayudarte a evaluar qué agente se adaptaría mejor a tu empresa?
                    </h1>
                    <p class="text-md text-gray-200">
                        Puedo resolver sus dudas, darle ideas sobre agentes, agendarle una reunión... y a veces, ¡llevarle una sorpresa!
                    </p>
                    <div class="relative max-w-2xl mx-auto w-full">
                        <div id="prompt-container" class="rounded-3xl border border-[#444444] bg-[#1F2023] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300">
                            <div id="file-preview-container"></div>
                            <div id="input-wrapper">
                                <textarea id="prompt-textarea" placeholder="Pregúntale a Boo" class="flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] max-h-[240px] resize-none"></textarea>
                            </div>
                            <div id="voice-visualizer" class="hidden flex-col items-center justify-center w-full transition-all duration-300 py-3">
                                <div class="flex items-center gap-2 mb-3">
                                    <div class="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <span id="recording-timer" class="font-mono text-sm text-white/80">00:00</span>
                                </div>
                                <div class="w-full h-10 flex items-center justify-center gap-0.5 px-4"></div>
                            </div>
                            <div class="flex items-center justify-between gap-2 p-0 pt-2">
                                <div class="flex items-center gap-1">
                                    <button id="upload-button" class="flex h-8 w-8 text-[#9CA3AF] cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-600/30 hover:text-[#D1D5DB]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                                    </button>
                                    <input id="file-input" type="file" class="hidden" accept="image/*,application/pdf" multiple>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button id="mic-button" class="h-8 w-8 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 text-[#9CA3AF] bg-transparent hover:bg-gray-600/30 hover:text-[#D1D5DB]">
                                        <svg id="mic-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                                        <svg id="stop-icon" class="hidden h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>
                                    </button>
                                    <button id="send-button" class="hidden h-8 w-8 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 bg-white hover:bg-white/80 text-[#1F2023]">
                                        <svg id="arrow-icon" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="suggestion-buttons" class="flex flex-wrap justify-center gap-2 pt-4 max-w-2xl mx-auto">
                        <button class="bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full px-4 py-2 text-sm transition-colors">Agendar una demostración</button>
                        <button class="bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full px-4 py-2 text-sm transition-colors">Preguntar sobre los precios</button>
                        <button class="bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full px-4 py-2 text-sm transition-colors">¿Cómo funciona la integración?</button>
                        <button class="bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full px-4 py-2 text-sm transition-colors">Comparar los planes</button>
                        <button class="bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full px-4 py-2 text-sm transition-colors">Contactar a ventas</button>
                    </div>
                </div>
            </main>
        </div>
    `;

    function initializeWidgetLogic(container) {
        const textarea = container.querySelector('#prompt-textarea');
        const micButton = container.querySelector('#mic-button');
        // ... (resto de la lógica)
    }

    document.addEventListener('DOMContentLoaded', () => {
        const targetDiv = document.getElementById(WIDGET_TARGET_ID);

        if (!targetDiv) {
            console.error(`Error: No se encontró el elemento con ID "${WIDGET_TARGET_ID}". Asegúrate de añadir <div id="${WIDGET_TARGET_ID}"></div> a tu HTML.`);
            return;
        }

        loadExternalResources();

        const styleElement = document.createElement('style');
        styleElement.textContent = widgetCSS;
        document.head.appendChild(styleElement);

        targetDiv.innerHTML = widgetHTML;

        // Aquí puedes inicializar la lógica pasando el 'targetDiv' como contexto
        // Esto es opcional para este caso, pero es una buena práctica.
        // initializeWidgetLogic(targetDiv);
        
        setTimeout(() => {
            targetDiv.classList.add('widget-loaded');
        }, 100); // Un pequeño retardo para asegurar que Tailwind aplique estilos
    });

})();
