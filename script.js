document.addEventListener('keydown', function(event) {
    const key = event.key;
    const currentApp = document.activeElement;
    const applications = document.querySelectorAll('.application');
    const tvScreen = document.querySelector('.tv-screen');
    const appContainer = document.querySelector('.app-container');
    const columns = Math.floor(tvScreen.clientWidth / 340); // Ancho de cada aplicación (incluido el margen)
    const rows = Math.ceil(applications.length / columns); // Número de filas

    let index = Array.from(applications).indexOf(currentApp);
    const column = index % columns; // Columna actual

    if (key === 'ArrowRight') {
        index = (index + 1) % applications.length;
    } else if (key === 'ArrowLeft') {
        index = (index - 1 + applications.length) % applications.length;
    } else if (key === 'ArrowUp') {
        if (index >= columns) { // Verificar si estamos en la primera fila
            index -= columns;
        }
    } else if (key === 'ArrowDown') {
        if (index + columns < applications.length) { // Verificar si estamos en la última fila
            index += columns;
        }
    } else if (key === 'Enter') { // Manejo para la tecla Enter
        event.preventDefault(); // Evitar el comportamiento predeterminado del Enter
        if (currentApp.classList.contains('application')) { // Verificar si el elemento enfocado es una aplicación
            window.location.href = currentApp.href; // Seguir el enlace de la aplicación
        }
        return; // Salir de la función después de seguir el enlace
    }

    applications[index].focus();
    selectApplication(applications[index]); // Aplicar el resplandor cuando se mueve con las flechas

    // Evitar el comportamiento predeterminado de las teclas de flecha
    event.preventDefault();
});

document.addEventListener('wheel', function(event) {
    const delta = Math.sign(event.deltaY);
    const currentApp = document.activeElement;
    const applications = document.querySelectorAll('.application');
    const tvScreen = document.querySelector('.tv-screen');
    const appContainer = document.querySelector('.app-container');
    const columns = Math.floor(tvScreen.clientWidth / 340); // Ancho de cada aplicación (incluido el margen)
    const rows = Math.ceil(applications.length / columns); // Número de filas

    let index = Array.from(applications).indexOf(currentApp);
    const column = index % columns; // Columna actual
    const newRow = Math.floor(index / columns) + delta; // Fila a la que se desplazará

    if (newRow >= 0 && newRow < rows) {
        index = column + (newRow * columns);
        applications[index].focus();
        selectApplication(applications[index]); // Aplicar el resplandor cuando se desplaza con la rueda del mouse
    }
    
    // Evitar el comportamiento predeterminado de desplazamiento de la página
    event.preventDefault();
});

function selectApplication(application) {
    const applications = document.querySelectorAll('.application');
    applications.forEach(app => {
        app.classList.remove('selected');
    });

    application.classList.add('selected');
}

document.addEventListener('mouseover', function(event) {
    if (event.target.classList.contains('application')) {
        const applications = document.querySelectorAll('.application');
        applications.forEach((app, index) => {
            if (app === event.target) {
                app.focus();
                selectApplication(app);
            }
        });
    }
});

function applyGlowToApplication(appElement) {
    // No necesitas establecer el estilo del resplandor aquí
    // Solo la clase .selected se encargará de eso
}

function addApplications() {
    const appContainer = document.querySelector('.app-container');
    
    // Cargar el archivo shortcuts.json localmente
    fetch('shortcuts.json') // No es necesario cambiar la ruta si está en la misma carpeta
        .then(response => response.json()) // Parsear como JSON
        .then(shortcuts => {
            shortcuts.forEach(shortcut => {
                const { name, url, icon } = shortcut;
                const application = createApplicationElement(name, url, icon);
                appContainer.appendChild(application);
            });
        })
        .catch(error => console.error('Error al cargar las aplicaciones:', error));
}

window.onload = function() {
    addApplications();
};

function createApplicationElement(name, url, icon) {
    const application = document.createElement('a');
    application.href = url;
    application.className = 'application';
    application.target = '_self';
    const image = document.createElement('img');
    // Corregir la ruta de la imagen
    image.src = `images/icons/${icon}`; 
    image.alt = name;
    application.appendChild(image);
    application.innerHTML += `<br>${name}`;
    return application;
}

function selectApplication(application) {
    const applications = document.querySelectorAll('.application');
    applications.forEach(app => {
        app.classList.remove('selected');
        app.style.border = 'none'; // Elimina cualquier borde existente
        app.style.boxShadow = 'none'; // Elimina cualquier resplandor existente
    });

    application.classList.add('selected');
    applyGlowToApplication(application);
}

