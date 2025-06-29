if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => {
                console.log('Service Worker registrato con successo:', reg.scope);
            })
            .catch(err => {
                console.error('Registrazione Service Worker fallita:', err);
            });
    });
} else {
    console.warn('Il tuo browser non supporta i Service Worker.');
}

// Un po' di interattività per la pagina
document.getElementById('testButton').addEventListener('click', () => {
    document.getElementById('message').textContent = 'Hai cliccato il pulsante! Funziona!';
});


