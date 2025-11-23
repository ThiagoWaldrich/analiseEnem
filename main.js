// Verificar se o Neutralino está disponível
let isNeutralino = false;

document.addEventListener('DOMContentLoaded', async function() {
    // Referências aos elementos DOM
    const calendarGrid = document.getElementById('calendar-grid');
    const monthSelector = document.getElementById('month-selector');
    const yearSelector = document.getElementById('year-selector');
    const todayBtn = document.getElementById('today-btn');
    const manageSubjectsBtn = document.getElementById('manage-subjects-btn');
    const dayPanel = document.getElementById('day-panel');
    const closePanelBtn = document.getElementById('close-panel');
    const selectedDateEl = document.getElementById('selected-date');
    const studyRoutine = document.getElementById('study-routine');
    const studySummary = document.getElementById('study-summary');
    const dayNotes = document.getElementById('day-notes');
    const modalOverlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal');
    const goalsBtn = document.getElementById('goals-btn');
    const reviewBtn = document.getElementById('review-btn');
    
    // Estado da aplicação
    let currentDate = new Date();
    let selectedDate = null;
    let holidays = {};
    
    // Matérias padrão
    const defaultSubjects = [
        { id: '1', name: 'Matemática', sessions: 4 },
        { id: '2', name: 'Física', sessions: 4 },
        { id: '3', name: 'Química', sessions: 3 },
        { id: '4', name: 'Biologia', sessions: 2 },
        { id: '5', name: 'História', sessions: 1 },
        { id: '6', name: 'Geografia', sessions: 1 },
        { id: '7', name: 'Sociologia', sessions: 1 },
        { id: '8', name: 'Filosofia', sessions: 1 },
        { id: '9', name: 'Português', sessions: 1 },
        { id: '10', name: 'Literatura', sessions: 2 },
        { id: '11', name: 'Redação', sessions: 3 },
        { id: '12', name: 'Simulado', sessions: 1 }
    ];
    
    // Inicialização
    await initApp();

    // Função de inicialização
    async function initApp() {
        await checkNeutralino();
        loadHolidays();
        await renderCalendar();
        setupEventListeners();
        
        // Mostrar mensagem de modo
        console.log(`Calendário - Modo: ${isNeutralino ? 'Neutralino' : 'LocalStorage'}`);
    }
    
    // Verificar se o Neutralino está disponível
    async function checkNeutralino() {
        try {
            if (typeof Neutralino !== 'undefined') {
                await Neutralino.init();
                isNeutralino = true;
                console.log('✅ Calendário usando Neutralino Storage');
            } else {
                isNeutralino = false;
                console.log('📁 Calendário usando LocalStorage');
            }
        } catch (error) {
            isNeutralino = false;
            console.log('📁 Calendário usando LocalStorage (fallback)');
        }
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        monthSelector.addEventListener('change', renderCalendar);
        yearSelector.addEventListener('change', renderCalendar);
        todayBtn.addEventListener('click', goToToday);
        manageSubjectsBtn.addEventListener('click', openManageSubjects);
        closePanelBtn.addEventListener('click', closeDayPanel);
        dayNotes.addEventListener('input', saveDayData);
        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) closeModal();
        });
        
        goalsBtn.addEventListener('click', async function() {
            openModal('Metas', await renderGoalsModal());
        });
        
        reviewBtn.addEventListener('click', async function() {
            openModal('Revisão', await renderReviewModal());
        });
        
        // Event delegation para elementos dinâmicos
        document.addEventListener('click', function(e) {
            // Rating de humor e energia
            if (e.target.classList.contains('rating-option')) {
                const type = e.target.closest('.mood-section') ? 'mood' : 'energy';
                const value = parseInt(e.target.getAttribute('data-value'));
                setRating(type, value);
            }
            
            // Checkbox de estudos
            if (e.target.classList.contains('study-checkbox')) {
                const subjectId = e.target.dataset.subjectId;
                const sessionIndex = parseInt(e.target.dataset.session);
                toggleStudySession(subjectId, sessionIndex);
            }
        });
    }
    
    // Carregar feriados e datas comemorativas
    function loadHolidays() {
        // Feriados nacionais do Brasil para 2026
        holidays = {
            '01-01': 'Ano Novo',
            '02-16': 'Carnaval',
            '02-17': 'Carnaval',
            '04-03': 'Sexta-feira Santa',
            '04-21': 'Tiradentes',
            '05-01': 'Dia do Trabalho',
            '06-04': 'Corpus Christi',
            '09-07': 'Independência do Brasil',
            '10-12': 'Nossa Senhora Aparecida',
            '11-02': 'Finados',
            '11-15': 'Proclamação da República',
            '12-25': 'Natal'
        };
        
        // Datas comemorativas populares
        const commemorativeDates = {
            '02-14': 'Dia dos Namorados',
            '03-08': 'Dia Internacional da Mulher',
            '04-01': 'Dia da Mentira',
            '04-22': 'Descobrimento do Brasil',
            '05-12': 'Dia das Mães',
            '06-12': 'Dia dos Namorados (Brasil)',
            '08-11': 'Dia dos Pais',
            '10-31': 'Halloween',
            '12-31': 'Réveillon'
        };
        
        Object.assign(holidays, commemorativeDates);
    }
    
    // Renderizar o calendário
    async function renderCalendar() {
        calendarGrid.innerHTML = '';
        
        const year = parseInt(yearSelector.value);
        const month = parseInt(monthSelector.value);
        
        // Ajustar o mês atual no seletor
        monthSelector.value = month;
        
        // Primeiro dia do mês
        const firstDay = new Date(year, month, 1);
        // Último dia do mês
        const lastDay = new Date(year, month + 1, 0);
        // Dia da semana do primeiro dia (0 = Domingo, 6 = Sábado)
        const firstDayOfWeek = firstDay.getDay();
        // Número de dias no mês
        const daysInMonth = lastDay.getDate();
        
        // Dias do mês anterior (para preencher o início)
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day', 'empty');
            calendarGrid.appendChild(emptyDay);
        }
        
        // Dias do mês atual
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            
            // Verificar se é hoje
            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // Adicionar número do dia
            const dayNumber = document.createElement('div');
            dayNumber.classList.add('day-number');
            dayNumber.textContent = day;
            dayElement.appendChild(dayNumber);
            
            // Verificar se é feriado ou data comemorativa
            const dateKey = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (holidays[dateKey]) {
                const holidayMarker = document.createElement('div');
                holidayMarker.classList.add('holiday-marker');
                holidayMarker.textContent = holidays[dateKey];
                holidayMarker.title = holidays[dateKey];
                dayElement.appendChild(holidayMarker);
            }
            
            // Adicionar indicadores de estudos
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayData = await getDayData(dateStr);
            const studyProgress = dayData?.studyProgress || {};
            
            // Calcular progresso total do dia
            const subjects = await getDaySubjects(dateStr);
            let completedSessions = 0;
            let totalSessions = 0;
            
            subjects.forEach(subject => {
                totalSessions += subject.sessions;
                const subjectProgress = studyProgress[subject.id] || [];
                completedSessions += subjectProgress.length;
            });
            
            // Adicionar indicador visual se houver estudos
            if (completedSessions > 0) {
                const studyIndicator = document.createElement('div');
                studyIndicator.classList.add('study-indicator');
                
                // Adicionar pontos para cada 25% de progresso
                const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
                const dotsCount = Math.min(Math.ceil(progressPercentage / 25), 4);
                
                for (let i = 0; i < dotsCount; i++) {
                    const studyDot = document.createElement('div');
                    studyDot.classList.add('study-dot');
                    studyIndicator.appendChild(studyDot);
                }
                
                dayElement.appendChild(studyIndicator);
            }
            
            // Adicionar evento de clique
            dayElement.addEventListener('click', function() {
                selectDate(year, month, day);
            });
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    // Ir para a data atual
    function goToToday() {
        currentDate = new Date();
        yearSelector.value = currentDate.getFullYear();
        monthSelector.value = currentDate.getMonth();
        renderCalendar();
        selectDate(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    }
    
    // Selecionar uma data
    async function selectDate(year, month, day) {
        selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Atualizar o painel do dia
        const dateObj = new Date(year, month, day);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        selectedDateEl.textContent = dateObj.toLocaleDateString('pt-BR', options);
        
        // Carregar dados do dia
        await loadDayData(selectedDate);
        
        // Abrir o painel do dia
        openDayPanel();
    }
    
    // Abrir o painel do dia
    function openDayPanel() {
        dayPanel.classList.add('open');
    }
    
    // Fechar o painel do dia
    function closeDayPanel() {
        dayPanel.classList.remove('open');
    }
    
    // Carregar dados do dia selecionado
    async function loadDayData(dateStr) {
        const dayData = await getDayData(dateStr);
        
        // Carregar humor e energia
        const moodOptions = document.querySelectorAll('.mood-section .rating-option');
        const energyOptions = document.querySelectorAll('.energy-section .rating-option');
        
        moodOptions.forEach(option => option.classList.remove('active'));
        energyOptions.forEach(option => option.classList.remove('active'));
        
        if (dayData && dayData.mood) {
            const moodOption = document.querySelector(`.mood-section .rating-option[data-value="${dayData.mood}"]`);
            if (moodOption) moodOption.classList.add('active');
        }
        
        if (dayData && dayData.energy) {
            const energyOption = document.querySelector(`.energy-section .rating-option[data-value="${dayData.energy}"]`);
            if (energyOption) energyOption.classList.add('active');
        }
        
        // Carregar anotações
        dayNotes.value = (dayData && dayData.notes) || '';
        
        // Carregar rotina de estudos
        await renderStudyRoutine(dateStr);
    }
    
    // Renderizar rotina de estudos
    async function renderStudyRoutine(dateStr) {
        const subjects = await getDaySubjects(dateStr);
        const dayData = await getDayData(dateStr);
        const studyProgress = dayData?.studyProgress || {};
        
        let html = '';
        let totalCompleted = 0;
        let totalSessions = 0;
        
        subjects.forEach(subject => {
            const subjectProgress = studyProgress[subject.id] || [];
            const completedSessions = subjectProgress.length;
            const progressPercentage = subject.sessions > 0 ? (completedSessions / subject.sessions) * 100 : 0;
            
            totalCompleted += completedSessions;
            totalSessions += subject.sessions;
            
            html += `
                <div class="study-subject">
                    <div class="subject-header">
                        <span class="subject-name">${subject.name}</span>
                        <span class="subject-sessions">${completedSessions}/${subject.sessions}</span>
                    </div>
                    <div class="checkboxes-container">
            `;
            
            for (let i = 1; i <= subject.sessions; i++) {
                const isChecked = subjectProgress.includes(i);
                html += `
                    <label class="checkbox-label">
                        <input type="checkbox" class="study-checkbox" 
                               data-subject-id="${subject.id}" 
                               data-session="${i}"
                               ${isChecked ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        ${i}
                    </label>
                `;
            }
            
            html += `
                    </div>
                    <div class="subject-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                        <span class="progress-text">${Math.round(progressPercentage)}%</span>
                    </div>
                </div>
            `;
        });
        
        studyRoutine.innerHTML = html;
        updateStudySummary(totalCompleted, totalSessions);
    }
    
    // Atualizar resumo de estudos
    function updateStudySummary(completed, total) {
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        studySummary.innerHTML = `
            <div class="summary-stats">
                <div class="stat">
                    <span class="stat-value">${completed}/${total}</span>
                    <span class="stat-label">Sessões</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${percentage}%</span>
                    <span class="stat-label">Concluído</span>
                </div>
            </div>
        `;
    }
    
    // Definir rating (humor ou energia)
    async function setRating(type, value) {
        if (!selectedDate) return;
        
        // Atualizar visualmente
        const options = document.querySelectorAll(`.${type}-section .rating-option`);
        options.forEach(option => {
            option.classList.remove('active');
            if (parseInt(option.getAttribute('data-value')) === value) {
                option.classList.add('active');
            }
        });
        
        // Salvar no armazenamento
        const dayData = await getDayData(selectedDate) || {};
        dayData[type] = value;
        await saveDayDataToStorage(selectedDate, dayData);
    }
    
    // Alternar sessão de estudo
    async function toggleStudySession(subjectId, session) {
        if (!selectedDate) return;
        
        const dayData = await getDayData(selectedDate) || {};
        if (!dayData.studyProgress) dayData.studyProgress = {};
        
        // Verificar se a matéria existe na estrutura do dia
        const subjects = await getDaySubjects(selectedDate);
        const subject = subjects.find(s => s.id === subjectId);
        
        if (!subject) {
            alert('Esta matéria não existe na estrutura deste dia.');
            return;
        }
        
        // Verificar se a sessão é válida
        if (session < 1 || session > subject.sessions) {
            alert('Sessão inválida para esta matéria.');
            return;
        }
        
        if (!dayData.studyProgress[subjectId]) dayData.studyProgress[subjectId] = [];
        
        const subjectProgress = dayData.studyProgress[subjectId];
        const sessionIndex = subjectProgress.indexOf(session);
        
        if (sessionIndex > -1) {
            // Remover sessão
            subjectProgress.splice(sessionIndex, 1);
        } else {
            // Adicionar sessão
            subjectProgress.push(session);
            subjectProgress.sort((a, b) => a - b);
        }
        
        await saveDayDataToStorage(selectedDate, dayData);
        
        // Atualizar display
        await renderStudyRoutine(selectedDate);
        
        // Atualizar calendário
        await renderCalendar();
    }
    
    // Abrir modal de gerenciamento de matérias
    function openManageSubjects() {
        if (!selectedDate) {
            alert('Selecione um dia primeiro para gerenciar as matérias.');
            return;
        }
        openModal('Gerenciar Matérias - ' + formatDate(selectedDate), renderManageSubjectsModal());
    }
    
    // Função auxiliar para formatar data
    function formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('pt-BR');
    }
    
    // Renderizar modal de gerenciamento de matérias
    function renderManageSubjectsModal() {
        // Carregar matérias e atualizar o modal quando estiverem prontas
        getDaySubjects(selectedDate).then(subjects => {
            let subjectsHTML = '';
            
            subjects.forEach((subject, index) => {
                subjectsHTML += `
                    <div class="subject-item">
                        <div class="subject-info">
                            <span class="subject-item-name">${subject.name}</span>
                            <span class="subject-item-sessions">${subject.sessions} sessão${subject.sessions !== 1 ? 'es' : ''}</span>
                        </div>
                        <div class="subject-actions">
                            <button class="edit-subject" data-index="${index}">✏️</button>
                            <button class="delete-subject" data-index="${index}">🗑️</button>
                        </div>
                    </div>
                `;
            });
            
            const content = `
                <div class="modal-section">
                    <h4>Matérias da Rotina de Estudos - ${formatDate(selectedDate)}</h4>
                    <p><strong>Alterações feitas aqui afetam apenas este dia específico.</strong></p>
                    
                    <div class="subjects-list">
                        ${subjectsHTML || '<p style="text-align: center; color: #666;">Nenhuma matéria cadastrada</p>'}
                    </div>
                    
                    <div class="add-subject-form">
                        <h5>Adicionar Nova Matéria</h5>
                        <div class="form-row">
                            <input type="text" id="new-subject-name" placeholder="Nome da matéria">
                            <input type="number" id="new-subject-sessions" placeholder="Sessões" min="1" max="10" value="1">
                            <button id="add-subject-btn">Adicionar</button>
                        </div>
                    </div>
                    
                    <div class="manage-controls">
                        <button id="reset-default-btn">Restaurar Padrão</button>
                        <button id="save-subjects-btn">Salvar Alterações</button>
                    </div>
                </div>
            `;
            
            // Atualizar o conteúdo do modal
            modalContent.innerHTML = content;
            
            // Configurar os event listeners após o conteúdo ser carregado
            setupManageSubjectsListeners();
        });
        
        // Retornar conteúdo de carregamento inicial
        return '<div class="loading">Carregando matérias...</div>';
    }
    
    // Configurar event listeners do modal de gerenciamento
    function setupManageSubjectsListeners() {
        // Adicionar matéria
        const addSubjectBtn = document.getElementById('add-subject-btn');
        if (addSubjectBtn) {
            addSubjectBtn.addEventListener('click', async function() {
                const nameInput = document.getElementById('new-subject-name');
                const sessionsInput = document.getElementById('new-subject-sessions');
                
                const name = nameInput.value.trim();
                const sessions = parseInt(sessionsInput.value);
                
                if (!name) {
                    alert('Digite o nome da matéria!');
                    return;
                }
                
                if (sessions < 1 || sessions > 10) {
                    alert('O número de sessões deve ser entre 1 e 10!');
                    return;
                }
                
                const subjects = await getDaySubjects(selectedDate);
                const newSubject = {
                    id: Date.now().toString(),
                    name: name,
                    sessions: sessions
                };
                
                subjects.push(newSubject);
                await saveDaySubjects(selectedDate, subjects);
                
                // Limpar campos
                nameInput.value = '';
                sessionsInput.value = '1';
                
                // Recarregar modal
                openManageSubjects();
            });
        }
        
        // Editar matéria
        document.querySelectorAll('.edit-subject').forEach(btn => {
            btn.addEventListener('click', async function() {
                const index = parseInt(this.dataset.index);
                const subjects = await getDaySubjects(selectedDate);
                const subject = subjects[index];
                
                const newName = prompt('Editar nome da matéria:', subject.name);
                if (newName === null) return;
                
                const newSessions = prompt('Editar número de sessões:', subject.sessions);
                if (newSessions === null) return;
                
                const sessions = parseInt(newSessions);
                if (sessions < 1 || sessions > 10) {
                    alert('O número de sessões deve ser entre 1 e 10!');
                    return;
                }
                
                // Atualizar matéria
                subjects[index].name = newName.trim();
                subjects[index].sessions = sessions;
                
                await saveDaySubjects(selectedDate, subjects);
                openManageSubjects();
            });
        });
        
        // Excluir matéria
        document.querySelectorAll('.delete-subject').forEach(btn => {
            btn.addEventListener('click', async function() {
                const index = parseInt(this.dataset.index);
                const subjects = await getDaySubjects(selectedDate);
                const subjectName = subjects[index].name;
                
                if (confirm(`Tem certeza que deseja excluir a matéria "${subjectName}"?`)) {
                    subjects.splice(index, 1);
                    await saveDaySubjects(selectedDate, subjects);
                    openManageSubjects();
                }
            });
        });
        
        // Restaurar padrão
        const resetBtn = document.getElementById('reset-default-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', async function() {
                if (confirm('Restaurar as matérias padrão para este dia? Isso removerá todas as suas alterações.')) {
                    await saveDaySubjects(selectedDate, [...defaultSubjects]);
                    openManageSubjects();
                }
            });
        }
        
        // Salvar e fechar
        const saveBtn = document.getElementById('save-subjects-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', async function() {
                closeModal();
                if (selectedDate) {
                    await renderStudyRoutine(selectedDate);
                }
                await renderCalendar();
            });
        }
    }
    
    // Obter matérias específicas do dia
    async function getDaySubjects(dateStr) {
        const dayData = await getDayData(dateStr);
        // Se o dia tem matérias customizadas, retorna elas, senão retorna as padrão
        return dayData && dayData.customSubjects ? dayData.customSubjects : [...defaultSubjects];
    }
    
    // Salvar matérias específicas do dia
    async function saveDaySubjects(dateStr, subjects) {
        const dayData = await getDayData(dateStr) || {};
        dayData.customSubjects = subjects;
        
        // LIMPAR progresso de estudos quando as matérias são alteradas
        if (dayData.studyProgress) {
            dayData.studyProgress = {};
        }
        
        await saveDayDataToStorage(dateStr, dayData);
    }
    
    // Abrir modal
    function openModal(title, content) {
        modalTitle.textContent = title;
        modalContent.innerHTML = content;
        modalOverlay.style.display = 'flex';
    }
    
    // Fechar modal
    function closeModal() {
        modalOverlay.style.display = 'none';
    }
    
    // Renderizar conteúdo do modal de metas
    async function renderGoalsModal() {
        const goals = await getFromStorage('goals') || {
            weekly: '',
            monthly: ''
        };
        
        return `
            <div class="modal-section">
                <h4>Metas da Semana</h4>
                <textarea id="weekly-goals" placeholder="Digite suas metas para esta semana...">${goals.weekly}</textarea>
            </div>
            <div class="modal-section">
                <h4>Metas do Mês</h4>
                <textarea id="monthly-goals" placeholder="Digite suas metas para este mês...">${goals.monthly}</textarea>
            </div>
            <div class="modal-section">
                <button id="save-goals">Salvar Metas</button>
            </div>
        `;
    }
    
    // Configurar listeners do modal de metas
    function setupGoalsListeners() {
        document.getElementById('save-goals').addEventListener('click', async function() {
            const goals = {
                weekly: document.getElementById('weekly-goals').value,
                monthly: document.getElementById('monthly-goals').value
            };
            await saveToStorage('goals', goals);
            alert('Metas salvas com sucesso!');
            closeModal();
        });
    }
    
    // Renderizar conteúdo do modal de revisão
    async function renderReviewModal() {
        const review = await getFromStorage('review') || {
            weekly: { worked: '', notWorked: '', improve: '' },
            monthly: { worked: '', notWorked: '', improve: '' }
        };
        
        return `
            <div class="modal-section">
                <h4>Revisão Semanal</h4>
                <p>O que funcionou:</p>
                <textarea id="weekly-worked">${review.weekly.worked}</textarea>
                <p>O que não funcionou:</p>
                <textarea id="weekly-not-worked">${review.weekly.notWorked}</textarea>
                <p>O que melhorar:</p>
                <textarea id="weekly-improve">${review.weekly.improve}</textarea>
            </div>
            <div class="modal-section">
                <h4>Revisão Mensal</h4>
                <p>O que funcionou:</p>
                <textarea id="monthly-worked">${review.monthly.worked}</textarea>
                <p>O que não funcionou:</p>
                <textarea id="monthly-not-worked">${review.monthly.notWorked}</textarea>
                <p>O que melhorar:</p>
                <textarea id="monthly-improve">${review.monthly.improve}</textarea>
            </div>
            <div class="modal-section">
                <button id="save-review">Salvar Revisão</button>
            </div>
        `;
    }
    
    // Configurar listeners do modal de revisão
    function setupReviewListeners() {
        document.getElementById('save-review').addEventListener('click', async function() {
            const review = {
                weekly: {
                    worked: document.getElementById('weekly-worked').value,
                    notWorked: document.getElementById('weekly-not-worked').value,
                    improve: document.getElementById('weekly-improve').value
                },
                monthly: {
                    worked: document.getElementById('monthly-worked').value,
                    notWorked: document.getElementById('monthly-not-worked').value,
                    improve: document.getElementById('monthly-improve').value
                }
            };
            await saveToStorage('review', review);
            alert('Revisão salva com sucesso!');
            closeModal();
        });
    }
    
    // Salvar dados do dia (anotações)
    async function saveDayData() {
        if (!selectedDate) return;
        
        const dayData = await getDayData(selectedDate) || {};
        dayData.notes = dayNotes.value;
        await saveDayDataToStorage(selectedDate, dayData);
    }
    
    // Obter dados do dia do armazenamento
    async function getDayData(dateStr) {
        const daysData = await getFromStorage('daysData') || {};
        return daysData[dateStr];
    }
    
    // Salvar dados do dia no armazenamento
    async function saveDayDataToStorage(dateStr, data) {
        const daysData = await getFromStorage('daysData') || {};
        daysData[dateStr] = data;
        await saveToStorage('daysData', daysData);
    }
    
    // ========== SISTEMA DE ARMAZENAMENTO CORRIGIDO ==========
    
    // Utilitários para Neutralino Storage com fallback robusto
    async function saveToStorage(key, data) {
        try {
            if (isNeutralino) {
                await Neutralino.storage.setData(`calendar_${key}`, JSON.stringify(data));
                console.log(`💾 Calendário - Dados salvos no Neutralino: calendar_${key}`);
            } else {
                // Fallback para localStorage
                localStorage.setItem(`calendar_${key}`, JSON.stringify(data));
                console.log(`💾 Calendário - Dados salvos no LocalStorage: calendar_${key}`);
            }
            return true;
        } catch (error) {
            console.error('❌ Calendário - ERRO ao salvar dados:', error);
            // Fallback final para localStorage
            try {
                localStorage.setItem(`calendar_${key}`, JSON.stringify(data));
                console.log(`🆘 Calendário - Backup de emergência salvo: calendar_${key}`);
                return true;
            } catch (e) {
                console.error('💥 Calendário - FALHA TOTAL NO SALVAMENTO');
                return false;
            }
        }
    }
    
    async function getFromStorage(key) {
        try {
            let data;
            if (isNeutralino) {
                data = await Neutralino.storage.getData(`calendar_${key}`);
                console.log(`📥 Calendário - Dados carregados do Neutralino: calendar_${key}`, data ? '✅ Encontrado' : '📝 Não encontrado');
            } else {
                // Fallback para localStorage
                data = localStorage.getItem(`calendar_${key}`);
                console.log(`📥 Calendário - Dados carregados do LocalStorage: calendar_${key}`, data ? '✅ Encontrado' : '📝 Não encontrado');
            }
            
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Calendário - ERRO ao carregar dados:', error);
            // Fallback final para localStorage
            try {
                const data = localStorage.getItem(`calendar_${key}`);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                console.error('💥 Calendário - FALHA TOTAL NO CARREGAMENTO');
                return null;
            }
        }
    }
});