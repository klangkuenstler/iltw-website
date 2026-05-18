document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (data.nome && data.email && data.assunto && data.mensagem) {
            alert('Mensagem enviada com sucesso!\n\nObrigado pelo seu contacto.');
            form.reset();
        }
    });
});