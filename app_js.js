// Variables globales
let userData = [];
let editingIndex = -1;
let currentUser = '';

// Usuarios válidos
const validUsers = {
    'admin': 'admin123',
    'usuario': 'pass123',
    'demo': 'demo'
};

// Función de login
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginAlert = document.getElementById('loginAlert');

    if (validUsers[username] && validUsers[username] === password) {
        currentUser = username;
        document.getElementById('currentUser').textContent = username;
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        showSection('capture');
        loginAlert.classList.add('hidden');
    } else {
        loginAlert.classList.remove('hidden');
    }
}

// Función de logout
function logout() {
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    clearForm();
}

// Mostrar secciones
function showSection(section) {
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    document.getElementById(section + 'Section').classList.add('active');
    
    if (section === 'reports') {
        updateStats();
    } else if (section === 'data') {
        loadDataTable();
    }
}

// Guardar registro
function saveRecord() {
    const formData = {
        zafra_ciclo: document.getElementById('zafra_ciclo').value,
        zona: document.getElementById('zona').value,
        campo: document.getElementById('campo').value,
        id_prod: document.getElementById('id_prod').value,
        nombre_productor: document.getElementById('nombre_productor').value,
        superficie: document.getElementById('superficie').value,
        ciclo: document.getElementById('ciclo').value,
        regimen: document.getElementById('regimen').value,
        fecha_avance: document.getElementById('fecha_avance').value,
        observaciones: document.getElementById('observaciones').value,
        timestamp: new Date().toISOString(),
        user: currentUser,
        
        // Labores agrícolas (checkboxes)
        labores: {
            desmonte: document.getElementById('desmonte').checked,
            primer_barbecho: document.getElementById('primer_barbecho').checked,
            segundo_barbecho: document.getElementById('segundo_barbecho').checked,
            ap_encalado: document.getElementById('ap_encalado').checked,
            primera_rastra: document.getElementById('primera_rastra').checked,
            surco: document.getElementById('surco').checked,
            siembra_amp: document.getElementById('siembra_amp').checked,
            siembra_rep: document.getElementById('siembra_rep').checked,
            jta_quema: document.getElementById('jta_quema').checked,
            primer_cultivo: document.getElementById('primer_cultivo').checked,
            primer_cultivo_yta: document.getElementById('primer_cultivo_yta').checked,
            primera_ap_fertilizante: document.getElementById('primera_ap_fertilizante').checked,
            primera_ap_fert_mec: document.getElementById('primera_ap_fert_mec').checked,
            primer_riego: document.getElementById('primer_riego').checked,
            subsuelo_ctral: document.getElementById('subsuelo_ctral').checked,
            primera_limpia: document.getElementById('primera_limpia').checked,
            primera_ap_herbicida: document.getElementById('primera_ap_herbicida').checked,
            segunda_ap_ferti: document.getElementById('segunda_ap_ferti').checked,
            segundo_riego: document.getElementById('segundo_riego').checked,
            segunda_limpia: document.getElementById('segunda_limpia').checked,
            segunda_ap_herbicida: document.getElementById('segunda_ap_herbicida').checked,
            resiembra: document.getElementById('resiembra').checked
        }
    };

    // Validar campos requeridos
    const requiredFields = ['zafra_ciclo', 'zona', 'campo', 'id_prod', 'nombre_productor', 'superficie', 'ciclo', 'regimen', 'fecha_avance'];
    let isValid = true;
    
    for (let field of requiredFields) {
        if (!formData[field]) {
            isValid = false;
            document.getElementById(field).style.borderColor = '#dc3545';
        } else {
            document.getElementById(field).style.borderColor = '#e0e0e0';
        }
    }

    if (!isValid) {
        showAlert('Por favor complete todos los campos requeridos (*)', 'error');
        return;
    }

    if (editingIndex >= 0) {
        userData[editingIndex] = formData;
        editingIndex = -1;
        document.getElementById('cancelEdit').classList.add('hidden');
        showAlert('Registro actualizado exitosamente', 'success');
    } else {
        userData.push(formData);
        showAlert('Registro guardado exitosamente', 'success');
    }

    clearForm();
}

// Limpiar formulario
function clearForm() {
    // Campos de texto
    const textFields = ['zafra_ciclo', 'zona', 'campo', 'id_prod', 'nombre_productor', 'superficie', 'ciclo', 'regimen', 'fecha_avance', 'observaciones'];
    textFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.value = '';
            element.style.borderColor = '#e0e0e0';
        }
    });

    // Checkboxes
    const checkboxes = ['desmonte', 'primer_barbecho', 'segundo_barbecho', 'ap_encalado', 'primera_rastra', 'surco', 'siembra_amp', 'siembra_rep', 'jta_quema', 'primer_cultivo', 'primer_cultivo_yta', 'primera_ap_fertilizante', 'primera_ap_fert_mec', 'primer_riego', 'subsuelo_ctral', 'primera_limpia', 'primera_ap_herbicida', 'segunda_ap_ferti', 'segundo_riego', 'segunda_limpia', 'segunda_ap_herbicida', 'resiembra'];
    checkboxes.forEach(checkbox => {
        document.getElementById(checkbox).checked = false;
    });

    editingIndex = -1;
    document.getElementById('cancelEdit').classList.add('hidden');
}

// Cancelar edición
function cancelEdit() {
    clearForm();
    editingIndex = -1;
    document.getElementById('cancelEdit').classList.add('hidden');
    showAlert('Edición cancelada', 'success');
}

// Mostrar alertas
function showAlert(message, type) {
    const alertDiv = document.getElementById('formAlert');
    alertDiv.className = `alert alert-${type === 'error' ? 'error' : 'success'}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 3000);
}

// Actualizar estadísticas y generar informes
function updateStats() {
    if (userData.length === 0) {
        document.getElementById('totalSuperficie').textContent = '0';
        document.getElementById('avgLaboresPorProductor').textContent = '0';
        document.getElementById('productoresActivos').textContent = '0';
        document.getElementById('porcentajeAvanceGeneral').textContent = '0%';
        return;
    }

    // Estadísticas generales
    const totalSuperficie = userData.reduce((sum, record) => sum + parseFloat(record.superficie || 0), 0);
    const productoresActivos = userData.length;
    
    // Calcular promedio de labores por productor
    let totalLabores = 0;
    userData.forEach(record => {
        if (record.labores) {
            totalLabores += Object.values(record.labores).filter(Boolean).length;
        }
    });
    const avgLabores = userData.length > 0 ? (totalLabores / userData.length).toFixed(1) : 0;
    
    // Porcentaje de avance general (sobre 22 labores)
    const porcentajeAvance = userData.length > 0 ? ((totalLabores / (userData.length * 22)) * 100).toFixed(1) : 0;
    
    // Actualizar tarjetas
    document.getElementById('totalSuperficie').textContent = totalSuperficie.toFixed(1);
    document.getElementById('avgLaboresPorProductor').textContent = avgLabores;
    document.getElementById('productoresActivos').textContent = productoresActivos;
    document.getElementById('porcentajeAvanceGeneral').textContent = porcentajeAvance + '%';
    
    // Generar reportes
    generateLaborSuperficieReport();
    generateZonaAvanceReport();
    generateCicloComparativa();
}

// Reporte de superficie por labor
function generateLaborSuperficieReport() {
    const laborNames = {
        'desmonte': 'Desmonte',
        'primer_barbecho': '1er. Barbecho',
        'segundo_barbecho': '2do. Barbecho',
        'ap_encalado': 'Ap./Encalado',
        'primera_rastra': '1ra. Rastra',
        'surco': 'Surco',
        'siembra_amp': 'Siembra-Amp.',
        'siembra_rep': 'Siembra-Rep.',
        'jta_quema': 'Jta. Quema',
        'primer_cultivo': '1er. Cultivo',
        'primer_cultivo_yta': '1er. Cultivo/Yta.',
        'primera_ap_fertilizante': '1ra. Ap/Fertilizante',
        'primera_ap_fert_mec': '1ra. Ap/Fert.Mec.',
        'primer_riego': '1er. Riego',
        'subsuelo_ctral': 'Subsuelo/Ctral.',
        'primera_limpia': '1ra. Limpia',
        'primera_ap_herbicida': '1ra. Ap/Herbicida',
        'segunda_ap_ferti': '2da. Ap/Ferti.',
        'segundo_riego': '2do. Riego',
        'segunda_limpia': '2da. Limpia',
        'segunda_ap_herbicida': '2da. Ap/Herbicida',
        'resiembra': 'Resiembra'
    };

    const laborStats = {};
    
    // Inicializar contadores
    Object.keys(laborNames).forEach(labor => {
        laborStats[labor] = { superficie: 0, productores: 0 };
    });
    
    // Calcular estadísticas
    userData.forEach(record => {
        const superficie = parseFloat(record.superficie || 0);
        if (record.labores) {
            Object.keys(laborNames).forEach(labor => {
                if (record.labores[labor]) {
                    laborStats[labor].superficie += superficie;
                    laborStats[labor].productores += 1;
                }
            });
        }
    });
    
    // Generar tabla
    let tableHTML = `
        <table class="data-table" style="font-size: 13px;">
            <thead>
                <tr>
                    <th>Labor Agrícola</th>
                    <th>Superficie (Ha)</th>
                    <th>Productores</th>
                    <th>% Avance</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    const totalSuperficie = userData.reduce((sum, record) => sum + parseFloat(record.superficie || 0), 0);
    const totalProductores = userData.length;
    
    Object.keys(laborNames).forEach(labor => {
        const stats = laborStats[labor];
        const porcentaje = totalSuperficie > 0 ? ((stats.superficie / totalSuperficie) * 100).toFixed(1) : 0;
        
        tableHTML += `
            <tr>
                <td><strong>${laborNames[labor]}</strong></td>
                <td>${stats.superficie.toFixed(1)}</td>
                <td>${stats.productores}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="background: #e0e0e0; height: 8px; width: 100px; border-radius: 4px; overflow: hidden;">
                            <div style="background: rgb(34,116,71); height: 100%; width: ${porcentaje}%; transition: width 0.3s;"></div>
                        </div>
                        <span>${porcentaje}%</span>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    document.getElementById('laborSuperficieTable').innerHTML = tableHTML;
}

// Reporte por zona
function generateZonaAvanceReport() {
    const zonaStats = {};
    
    userData.forEach(record => {
        const zona = record.zona || 'Sin zona';
        const superficie = parseFloat(record.superficie || 0);
        
        if (!zonaStats[zona]) {
            zonaStats[zona] = { superficie: 0, productores: 0, laboresTotal: 0 };
        }
        
        zonaStats[zona].superficie += superficie;
        zonaStats[zona].productores += 1;
        
        if (record.labores) {
            zonaStats[zona].laboresTotal += Object.values(record.labores).filter(Boolean).length;
        }
    });
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Zona</th>
                    <th>Superficie (Ha)</th>
                    <th>Productores</th>
                    <th>Labores Promedio</th>
                    <th>% Avance</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    Object.keys(zonaStats).sort().forEach(zona => {
        const stats = zonaStats[zona];
        const laboresPromedio = (stats.laboresTotal / stats.productores).toFixed(1);
        const porcentajeAvance = ((stats.laboresTotal / (stats.productores * 22)) * 100).toFixed(1);
        
        tableHTML += `
            <tr>
                <td><strong>Zona ${zona}</strong></td>
                <td>${stats.superficie.toFixed(1)}</td>
                <td>${stats.productores}</td>
                <td>${laboresPromedio}/22</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="background: #e0e0e0; height: 8px; width: 100px; border-radius: 4px; overflow: hidden;">
                            <div style="background: rgb(34,116,71); height: 100%; width: ${porcentajeAvance}%; transition: width 0.3s;"></div>
                        </div>
                        <span>${porcentajeAvance}%</span>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    document.getElementById('zonaAvanceTable').innerHTML = tableHTML;
}

// Comparativa por ciclo
function generateCicloComparativa() {
    const cicloStats = { 'P': { superficie: 0, productores: 0, labores: 0 }, 
                        'S': { superficie: 0, productores: 0, labores: 0 }, 
                        'R': { superficie: 0, productores: 0, labores: 0 } };
    const cicloNames = { 'P': 'Plantilla', 'S': 'Soca', 'R': 'Resoca' };
    
    userData.forEach(record => {
        const ciclo = record.ciclo;
        const superficie = parseFloat(record.superficie || 0);
        
        if (cicloStats[ciclo]) {
            cicloStats[ciclo].superficie += superficie;
            cicloStats[ciclo].productores += 1;
            
            if (record.labores) {
                cicloStats[ciclo].labores += Object.values(record.labores).filter(Boolean).length;
            }
        }
    });
    
    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Ciclo de Cultivo</th>
                    <th>Superficie (Ha)</th>
                    <th>Productores</th>
                    <th>Labores Promedio</th>
                    <th>% Avance</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    Object.keys(cicloStats).forEach(ciclo => {
        const stats = cicloStats[ciclo];
        if (stats.productores > 0) {
            const laboresPromedio = (stats.labores / stats.productores).toFixed(1);
            const porcentajeAvance = ((stats.labores / (stats.productores * 22)) * 100).toFixed(1);
            
            tableHTML += `
                <tr>
                    <td><strong>${ciclo} - ${cicloNames[ciclo]}</strong></td>
                    <td>${stats.superficie.toFixed(1)}</td>
                    <td>${stats.productores}</td>
                    <td>${laboresPromedio}/22</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="background: #e0e0e0; height: 8px; width: 100px; border-radius: 4px; overflow: hidden;">
                                <div style="background: rgb(34,116,71); height: 100%; width: ${porcentajeAvance}%; transition: width 0.3s;"></div>
                            </div>
                            <span>${porcentajeAvance}%</span>
                        </div>
                    </td>
                </tr>
            `;
        }
    });
    
    tableHTML += '</tbody></table>';
    document.getElementById('cicloComparativa').innerHTML = tableHTML;
}

// Cargar tabla de datos
function loadDataTable() {
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = '';
    
    userData.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.id_prod}</td>
            <td>${record.nombre_productor}</td>
            <td>${record.zona}</td>
            <td>${record.campo}</td>
            <td>${record.superficie} Ha</td>
            <td>${record.ciclo}</td>
            <td>${new Date(record.fecha_avance).toLocaleDateString()}</td>
            <td>
                <button onclick="editRecord(${index})" class="action-btn edit-btn">✏️ Editar</button>
                <button onclick="deleteRecord(${index})" class="action-btn delete-btn">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Editar registro
function editRecord(index) {
    const record = userData[index];
    editingIndex = index;
    
    // Cargar datos básicos
    document.getElementById('zafra_ciclo').value = record.zafra_ciclo;
    document.getElementById('zona').value = record.zona;
    document.getElementById('campo').value = record.campo;
    document.getElementById('id_prod').value = record.id_prod;
    document.getElementById('nombre_productor').value = record.nombre_productor;
    document.getElementById('superficie').value = record.superficie;
    document.getElementById('ciclo').value = record.ciclo;
    document.getElementById('regimen').value = record.regimen;
    document.getElementById('fecha_avance').value = record.fecha_avance;
    document.getElementById('observaciones').value = record.observaciones || '';
    
    // Cargar checkboxes
    if (record.labores) {
        Object.entries(record.labores).forEach(([key, value]) => {
            const checkbox = document.getElementById(key);
            if (checkbox) checkbox.checked = value;
        });
    }
    
    document.getElementById('cancelEdit').classList.remove('hidden');
    showSection('capture');
    showAlert('Registro cargado para edición', 'success');
}

// Eliminar registro
function deleteRecord(index) {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
        userData.splice(index, 1);
        loadDataTable();
        showAlert('Registro eliminado exitosamente', 'success');
    }
}

// Exportar a Excel (completo)
function exportToExcel() {
    if (userData.length === 0) {
        showAlert('No hay datos para exportar', 'error');
        return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Encabezados - Datos básicos + todas las labores
    csvContent += "Zafra-Ciclo,Zona,Campo,ID-Prod,Productor,Superficie,Ciclo,Regimen,Fecha-Avance,Observaciones,Usuario,";
    csvContent += "Desmonte,1er_Barbecho,2do_Barbecho,Ap_Encalado,1ra_Rastra,Surco,Siembra_Amp,Siembra_Rep,Jta_Quema,";
    csvContent += "1er_Cultivo,1er_Cultivo_Yta,1ra_Ap_Fertilizante,1ra_Ap_Fert_Mec,1er_Riego,Subsuelo_Ctral,";
    csvContent += "1ra_Limpia,1ra_Ap_Herbicida,2da_Ap_Ferti,2do_Riego,2da_Limpia,2da_Ap_Herbicida,Resiembra,";
    csvContent += "Total_Labores_Realizadas,Timestamp\n";
    
    userData.forEach(record => {
        // Datos básicos
        const basicData = [
            record.zafra_ciclo,
            record.zona,
            record.campo,
            record.id_prod,
            `"${record.nombre_productor}"`,
            record.superficie,
            record.ciclo,
            record.regimen,
            record.fecha_avance,
            `"${record.observaciones || ''}"`,
            record.user
        ];
        
        // Labores agrícolas (1/0)
        const labores = record.labores || {};
        const laborData = [
            labores.desmonte ? 1 : 0,
            labores.primer_barbecho ? 1 : 0,
            labores.segundo_barbecho ? 1 : 0,
            labores.ap_encalado ? 1 : 0,
            labores.primera_rastra ? 1 : 0,
            labores.surco ? 1 : 0,
            labores.siembra_amp ? 1 : 0,
            labores.siembra_rep ? 1 : 0,
            labores.jta_quema ? 1 : 0,
            labores.primer_cultivo ? 1 : 0,
            labores.primer_cultivo_yta ? 1 : 0,
            labores.primera_ap_fertilizante ? 1 : 0,
            labores.primera_ap_fert_mec ? 1 : 0,
            labores.primer_riego ? 1 : 0,
            labores.subsuelo_ctral ? 1 : 0,
            labores.primera_limpia ? 1 : 0,
            labores.primera_ap_herbicida ? 1 : 0,
            labores.segunda_ap_ferti ? 1 : 0,
            labores.segundo_riego ? 1 : 0,
            labores.segunda_limpia ? 1 : 0,
            labores.segunda_ap_herbicida ? 1 : 0,
            labores.resiembra ? 1 : 0
        ];
        
        // Total de labores realizadas
        const totalLabores = laborData.reduce((sum, labor) => sum + labor, 0);
        
        const row = [...basicData, ...laborData, totalLabores, record.timestamp].join(',');
        csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `base_datos_labores_agricolas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('Base de datos exportada exitosamente (34 columnas)', 'success');
}

// Búsqueda en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    // Configurar búsqueda
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#dataTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Eventos de teclado para login
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('password').focus();
        }
    });

    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });

    // Establecer fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha_avance').value = today;

    // Auto-uppercase para nombre del productor
    document.getElementById('nombre_productor').addEventListener('input', function(e) {
        e.target.value = e.target.value.toUpperCase();
    });

    // Cargar datos de ejemplo
    loadSampleData();
});

// Datos de ejemplo para demostración
function loadSampleData() {
    userData = [
        {
            zafra_ciclo: "2024-2025",
            zona: "4",
            campo: "CAM001",
            id_prod: "2810032",
            nombre_productor: "JUAN PÉREZ LÓPEZ",
            superficie: "3.5",
            ciclo: "P",
            regimen: "R",
            fecha_avance: "2025-01-15",
            observaciones: "Avance normal, suelo en buenas condiciones",
            timestamp: new Date().toISOString(),
            user: "demo",
            labores: {
                desmonte: true,
                primer_barbecho: true,
                segundo_barbecho: false,
                ap_encalado: true,
                primera_rastra: true,
                surco: false,
                siembra_amp: false,
                siembra_rep: false,
                jta_quema: false,
                primer_cultivo: false,
                primer_cultivo_yta: false,
                primera_ap_fertilizante: false,
                primera_ap_fert_mec: false,
                primer_riego: false,
                subsuelo_ctral: false,
                primera_limpia: false,
                primera_ap_herbicida: false,
                segunda_ap_ferti: false,
                segundo_riego: false,
                segunda_limpia: false,
                segunda_ap_herbicida: false,
                resiembra: false
            }
        },
        {
            zafra_ciclo: "2024-2025",
            zona: "5",
            campo: "CAM002",
            id_prod: "2810045",
            nombre_productor: "MARÍA GONZÁLEZ HERNÁNDEZ",
            superficie: "2.8",
            ciclo: "S",
            regimen: "T",
            fecha_avance: "2025-01-16",
            observaciones: "Pendiente aplicación de fertilizante",
            timestamp: new Date().toISOString(),
            user: "demo",
                            labores: {
                desmonte: false,
                primer_barbecho: false,
                segundo_barbecho: false,
                ap_encalado: false,
                primera_rastra: false,
                surco: false,
                siembra_amp: false,
                siembra_rep: false,
                jta_quema: false,
                primer_cultivo: true,
                primer_cultivo_yta: false,
                primera_ap_fertilizante: false,
                primera_ap_fert_mec: false,
                primer_riego: true,
                subsuelo_ctral: false,
                primera_limpia: true,
                primera_ap_herbicida: false,
                segunda_ap_ferti: false,
                segundo_riego: false,
                segunda_limpia: false,
                segunda_ap_herbicida: false,
                resiembra: false
            }
        }
    ];
}