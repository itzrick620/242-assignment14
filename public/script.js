document.addEventListener('DOMContentLoaded', () => {
    loadCartoons();
    document.getElementById('add-cartoon-button').addEventListener('click', toggleAddCartoonForm);
    document.getElementById('cartoon-form').addEventListener('submit', handleFormSubmit);
});

async function loadCartoons() {
    try {
        const response = await fetch('/api/cartoons');
        const cartoons = await response.json();
        displayCartoons(cartoons);
    } catch (error) {
        console.error('Error loading cartoons:', error);
    }
}

function displayCartoons(cartoons) {
    const cartoonList = document.getElementById('cartoon-list');
    cartoonList.innerHTML = '';
    cartoons.forEach(cartoon => {
        const cartoonElement = document.createElement('section');
        cartoonElement.classList.add('cartoon');
        let charactersList = cartoon.notableCharacters.join(', ');
        cartoonElement.innerHTML = `
            <h3>${cartoon.title}</h3>
            <p><strong>Humor:</strong> ${cartoon.humor}</p>
            <p><strong>Animation Style:</strong> ${cartoon.animationStyle}</p>
            <p><strong>Release Year:</strong> ${cartoon.releaseYear}</p>
            <p><strong>Main Setting:</strong> ${cartoon.mainSetting}</p>
            <p><strong>Notable Characters:</strong> ${charactersList}</p>
        `;
        cartoonList.appendChild(cartoonElement);
    });
}

function toggleAddCartoonForm() {
    const formContainer = document.getElementById('cartoon-form-container');
    formContainer.classList.toggle('hidden');
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const notableCharacters = formData.get('notableCharacters').split(',').map(character => character.trim());

    const newCartoon = {
        title: formData.get('title'),
        humor: formData.get('humor'),
        animationStyle: formData.get('animationStyle'),
        releaseYear: formData.get('releaseYear'),
        mainSetting: formData.get('mainSetting'),
        notableCharacters: notableCharacters,
    };

    try {
        const response = await fetch('/api/cartoons', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCartoon)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        displayCartoons(result);
        toggleAddCartoonForm();
        event.target.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}
