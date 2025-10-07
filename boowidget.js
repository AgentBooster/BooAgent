(function() {
    // Función para inyectar los recursos externos necesarios (Tailwind y Google Fonts)
    function loadExternalResources() {
        const resources = [
            { type: 'script', src: 'https://cdn.tailwindcss.com' },
            { type: 'link', rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
        ];

        resources.forEach(resource => {
            if (resource.type === 'script') {
                if (!document.querySelector(`script[src="${resource.src}"]`)) {
                    const script = document.createElement('script');
                    script.src = resource.src;
                    document.head.appendChild(script);
                }
            } else if (resource.type === 'link') {
                if (!document.querySelector(`link[href="${resource.href}"]`)) {
                    const link = document.createElement('link');
                    link.rel = resource.rel;
                    link.href = resource.href;
                    document.head.appendChild(link);
                }
            }
        });
    }

    // Contenido CSS del componente
    const widgetCSS = `
        /* --- Solución para el FOUC --- */
        #boo-ai-widget-container {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        #boo-ai-widget-container.widget-loaded {
            opacity: 1;
        }
        /* --- FIN de la solución --- */

        body {
            font-family: 'Inter', sans-serif;
        }
        #boo-ai-widget-container textarea::-webkit-scrollbar { width: 6px; }
        #boo-ai-widget-container textarea::-webkit-scrollbar-track { background: transparent; }
        #boo-ai-widget-container textarea::-webkit-scrollbar-thumb { background-color: #444444; border-radius: 3px; }
        #boo-ai-widget-container textarea::-webkit-scrollbar-thumb:hover { background-color: #555555; }
        #boo-ai-widget-container .voice-visualizer-bar {
            animation: pulse 1s infinite ease-in-out;
        }
        @keyframes pulse {
            0%, 100% { transform: scaleY(0.2); }
            50% { transform: scaleY(1); }
        }
        #boo-ai-widget-container #file-preview-container {
            display: flex;
            overflow-x: auto;
            overflow-y: hidden;
            flex-wrap: nowrap;
            padding-bottom: 8px;
            scrollbar-width: thin;
            scrollbar-color: #444444 transparent;
        }
        #boo-ai-widget-container #file-preview-container::-webkit-scrollbar { height: 4px; }
        #boo-ai-widget-container #file-preview-container::-webkit-scrollbar-track { background: transparent; }
        #boo-ai-widget-container #file-preview-container::-webkit-scrollbar-thumb { background-color: #444444; border-radius: 2px; }
        #boo-ai-widget-container .file-preview-item {
            position: relative;
            display: flex;
            align-items: center;
            background-color: #2E3033;
            border-radius: 12px;
            padding: 8px;
            margin-right: 8px;
            margin-top: 4px;
            flex-shrink: 0;
            width: 180px;
        }
        #boo-ai-widget-container .file-preview-item .file-icon {
            flex-shrink: 0;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background-color: #EF4444;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #boo-ai-widget-container .file-preview-item .file-info {
            margin-left: 8px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            color: #E5E7EB;
        }
        #boo-ai-widget-container .file-preview-item .file-name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 0.875rem;
            line-height: 1.25rem;
        }
        #boo-ai-widget-container .file-preview-item .file-type {
            font-size: 0.75rem;
            line-height: 1rem;
            color: #9CA3AF;
        }
        #boo-ai-widget-container .file-preview-item .remove-btn {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 16px;
            height: 16px;
            border-radius: 9999px;
            background-color: #4B5563;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        #boo-ai-widget-container .file-preview-item img.preview-image {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            object-fit: cover;
            flex-shrink: 0;
        }
    `;

    // Contenido HTML del componente
    const widgetHTML = `
        <div class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
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
        </div>
    `;

    // Función que contiene toda la lógica interactiva del componente
    function initializeWidgetLogic() {
        const textarea = document.getElementById('prompt-textarea');
        const micButton = document.getElementById('mic-button');
        const sendButton = document.getElementById('send-button');
        const micIcon = document.getElementById('mic-icon');
        const stopIcon = document.getElementById('stop-icon');
        const uploadButton = document.getElementById('upload-button');
        const fileInput = document.getElementById('file-input');
        const filePreviewContainer = document.getElementById('file-preview-container');
        const inputWrapper = document.getElementById('input-wrapper');
        const voiceVisualizer = document.getElementById('voice-visualizer');
        const recordingTimer = document.getElementById('recording-timer');
        const visualizerBarsContainer = voiceVisualizer.querySelector('.gap-0\\.5');
        const promptContainer = document.getElementById('prompt-container');
        const suggestionButtons = document.querySelectorAll('#suggestion-buttons button');
        let isRecording = false;
        let recognition = null;
        let timerInterval = null;
        let fileStore = [];
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'es-ES';
            recognition.onresult = (event) => {
                let interim_transcript = '';
                let final_transcript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
                textarea.value = final_transcript + interim_transcript;
                autoResize();
                updateButtonState();
            };
            recognition.onerror = (event) => {
                console.error("Error en el reconocimiento de voz:", event.error);
                stopRecording();
            };
        }
        const autoResize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        };
        const updateButtonState = () => {
            const hasContent = textarea.value.trim().length > 0 || fileStore.length > 0;
            if (isRecording) {
                micIcon.classList.add('hidden');
                stopIcon.classList.remove('hidden');
                micButton.classList.add('bg-transparent', 'hover:bg-gray-600/30');
                uploadButton.classList.add('hidden');
                sendButton.classList.add('hidden');
                promptContainer.classList.add('border-red-500/70');
            } else {
                micIcon.classList.remove('hidden');
                stopIcon.classList.add('hidden');
                micButton.classList.remove('bg-transparent', 'hover:bg-gray-600/30');
                uploadButton.classList.remove('hidden');
                promptContainer.classList.remove('border-red-500/70');
                if (hasContent) {
                    sendButton.classList.remove('hidden');
                } else {
                    sendButton.classList.add('hidden');
                }
            }
        };
        const startRecording = () => {
            if (!recognition) {
                showCustomAlert("El reconocimiento de voz no es compatible con este navegador.");
                return;
            }
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(stream => {
                isRecording = true;
                inputWrapper.classList.add('hidden');
                filePreviewContainer.classList.add('hidden');
                voiceVisualizer.classList.remove('hidden');
                voiceVisualizer.classList.add('flex');
                let seconds = 0;
                recordingTimer.textContent = '00:00';
                timerInterval = setInterval(() => {
                    seconds++;
                    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
                    const secs = (seconds % 60).toString().padStart(2, '0');
                    recordingTimer.textContent = `${mins}:${secs}`;
                }, 1000);
                startVisualizer();
                recognition.start();
                updateButtonState();
            }).catch(err => {
                console.error("Error al acceder al micrófono:", err);
                showCustomAlert("No se pudo acceder al micrófono. Por favor, revisa los permisos en tu navegador.");
            });
        };
        const stopRecording = () => {
            if (!isRecording) return;
            isRecording = false;
            inputWrapper.classList.remove('hidden');
            filePreviewContainer.classList.remove('hidden');
            voiceVisualizer.classList.add('hidden');
            voiceVisualizer.classList.remove('flex');
            clearInterval(timerInterval);
            stopVisualizer();
            if (recognition) recognition.stop();
            updateButtonState();
        };
        const startVisualizer = () => {
            visualizerBarsContainer.innerHTML = '';
            for (let i = 0; i < 32; i++) {
                const bar = document.createElement('div');
                bar.className = 'w-0.5 rounded-full bg-white/50 voice-visualizer-bar';
                bar.style.animationDelay = `${i * 0.05}s`;
                bar.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
                visualizerBarsContainer.appendChild(bar);
            }
        };
        const stopVisualizer = () => {
            visualizerBarsContainer.innerHTML = '';
        };

        function showCustomAlert(message) {
            const existingAlert = document.getElementById('custom-alert');
            if (existingAlert) existingAlert.remove();
            const alertBox = document.createElement('div');
            alertBox.id = 'custom-alert';
            Object.assign(alertBox.style, {
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '9999px',
                zIndex: '1000',
                fontSize: '14px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'opacity 0.5s'
            });
            alertBox.textContent = message;
            document.body.appendChild(alertBox);
            setTimeout(() => {
                alertBox.style.opacity = '0';
                setTimeout(() => alertBox.remove(), 500);
            }, 3000);
        }
        const handleFileUpload = (files) => {
            const totalFiles = fileStore.length + files.length;
            if (totalFiles > 6) {
                showCustomAlert("Puedes subir un máximo de 6 archivos.");
                fileInput.value = '';
                return;
            }
            for (const file of files) {
                const fileId = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
                file.id = fileId;
                fileStore.push(file);
                const previewWrapper = document.createElement('div');
                previewWrapper.className = 'file-preview-item';
                previewWrapper.setAttribute('data-file-id', fileId);
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-btn';
                removeBtn.innerHTML = '<svg class="h-2.5 w-2.5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    const wrapperToRemove = e.currentTarget.closest('[data-file-id]');
                    if (wrapperToRemove) {
                        const idToRemove = wrapperToRemove.getAttribute('data-file-id');
                        wrapperToRemove.remove();
                        fileStore = fileStore.filter(f => f.id !== idToRemove);
                        updateButtonState();
                    }
                };
                const fileInfo = document.createElement('div');
                fileInfo.className = 'file-info';
                const fileNameSpan = document.createElement('span');
                fileNameSpan.className = 'file-name';
                fileNameSpan.textContent = file.name;
                const fileTypeSpan = document.createElement('span');
                fileTypeSpan.className = 'file-type';
                fileInfo.appendChild(fileNameSpan);
                fileInfo.appendChild(fileTypeSpan);
                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.className = 'preview-image';
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                    previewWrapper.appendChild(img);
                    fileTypeSpan.textContent = file.type.split('/')[1].toUpperCase();
                } else {
                    const iconContainer = document.createElement('div');
                    iconContainer.className = 'file-icon';
                    iconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
                    previewWrapper.appendChild(iconContainer);
                    const extension = file.name.split('.').pop();
                    fileTypeSpan.textContent = extension ? extension.toUpperCase() : 'Archivo';
                }
                previewWrapper.appendChild(fileInfo);
                previewWrapper.appendChild(removeBtn);
                filePreviewContainer.appendChild(previewWrapper);
            }
            fileInput.value = '';
            updateButtonState();
        };
        const handleSubmit = () => {
            console.log("Enviando:", textarea.value, fileStore);
            textarea.value = "";
            filePreviewContainer.innerHTML = '';
            fileStore = [];
            autoResize();
            updateButtonState();
        }
        suggestionButtons.forEach(button => {
            button.addEventListener('click', () => {
                textarea.value = button.textContent;
                textarea.dispatchEvent(new Event('input', {
                    bubbles: true
                }));
                textarea.focus();
            });
        });
        textarea.addEventListener('input', () => {
            autoResize();
            updateButtonState();
        });
        micButton.addEventListener('click', () => {
            if (isRecording) {
                stopRecording();
            } else {
                startRecording();
            }
        });
        sendButton.addEventListener('click', () => {
            handleSubmit();
        });
        uploadButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => handleFileUpload(fileInput.files));
        promptContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            promptContainer.classList.add('border-blue-500/50');
        });
        promptContainer.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            promptContainer.classList.remove('border-blue-500/50');
        });
        promptContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            promptContainer.classList.remove('border-blue-500/50');
            if (e.dataTransfer.files) {
                handleFileUpload(e.dataTransfer.files);
            }
        });
        updateButtonState();
    }

    // --- Punto de entrada principal ---
    document.addEventListener('DOMContentLoaded', () => {
        // 1. Cargar dependencias externas
        loadExternalResources();

        // 2. Crear un contenedor para el widget
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'boo-ai-widget-container';
        
        // 3. Inyectar el CSS del widget
        const styleElement = document.createElement('style');
        styleElement.textContent = widgetCSS;
        document.head.appendChild(styleElement);

        // 4. Inyectar el HTML del widget en el contenedor
        widgetContainer.innerHTML = widgetHTML;

        // 5. Agregar el contenedor al body de la página
        document.body.appendChild(widgetContainer);

        // 6. Inicializar toda la lógica del widget
        initializeWidgetLogic();
        
        // 7. Revelar el widget suavemente
        // Le damos un respiro mínimo al navegador para que Tailwind actúe
        setTimeout(() => {
            widgetContainer.classList.add('widget-loaded');
        }, 50); // 50 milisegundos suelen ser suficientes
    });
})();
