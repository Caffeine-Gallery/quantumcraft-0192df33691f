import { backend } from 'declarations/backend';

// Initialize Lucide icons
lucide.createIcons();

// Component categories and their items
const componentCategories = [
    {
        name: 'Basic Elements',
        components: [
            { name: 'Heading', icon: 'type' },
            { name: 'Text Block', icon: 'type' },
            { name: 'Button', icon: 'square' },
            { name: 'Image', icon: 'image' }
        ]
    },
    {
        name: 'Layout',
        components: [
            { name: 'Section', icon: 'layout' },
            { name: 'Container', icon: 'box' },
            { name: 'Grid', icon: 'grid' },
            { name: 'Columns', icon: 'columns' }
        ]
    },
    {
        name: 'Advanced',
        components: [
            { name: 'Form', icon: 'square' },
            { name: 'Gallery', icon: 'image' },
            { name: 'Video', icon: 'video' },
            { name: 'Slider', icon: 'sliders' }
        ]
    }
];

// Populate component list
function populateComponentList() {
    const componentList = document.getElementById('componentList');
    componentList.innerHTML = '';

    componentCategories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'mb-4';
        categoryDiv.innerHTML = `<h6>${category.name}</h6>`;

        const componentsDiv = document.createElement('div');
        componentsDiv.className = 'row g-2';

        category.components.forEach(component => {
            const componentDiv = document.createElement('div');
            componentDiv.className = 'col-6';
            componentDiv.innerHTML = `
                <div class="border rounded p-2 text-center" draggable="true" data-component="${component.name}">
                    <i data-lucide="${component.icon}"></i>
                    <div>${component.name}</div>
                </div>
            `;
            componentsDiv.appendChild(componentDiv);
        });

        categoryDiv.appendChild(componentsDiv);
        componentList.appendChild(categoryDiv);
    });

    // Reinitialize Lucide icons for the newly added components
    lucide.createIcons();

    // Add drag functionality to components
    addDragFunctionality();
}

// Add drag functionality to components
function addDragFunctionality() {
    const draggableElements = document.querySelectorAll('[draggable="true"]');
    draggableElements.forEach(elem => {
        elem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.component);
        });
    });
}

// Handle drop on canvas
function handleCanvasDrop(e) {
    e.preventDefault();
    const componentName = e.dataTransfer.getData('text');
    const newElement = document.createElement('div');
    newElement.className = 'border rounded p-2 mb-2';
    newElement.textContent = componentName;
    e.target.appendChild(newElement);
}

// Initialize the application
function init() {
    populateComponentList();

    const canvas = document.getElementById('canvas');
    canvas.addEventListener('dragover', (e) => e.preventDefault());
    canvas.addEventListener('drop', handleCanvasDrop);

    // Device preview buttons
    document.getElementById('desktopBtn').addEventListener('click', () => setPreviewMode('desktop'));
    document.getElementById('tabletBtn').addEventListener('click', () => setPreviewMode('tablet'));
    document.getElementById('mobileBtn').addEventListener('click', () => setPreviewMode('mobile'));

    // Save and publish buttons
    document.getElementById('saveBtn').addEventListener('click', saveWebsite);
    document.getElementById('publishBtn').addEventListener('click', publishWebsite);
}

// Set preview mode
function setPreviewMode(mode) {
    const canvas = document.getElementById('canvas');
    canvas.className = 'bg-white rounded shadow-sm p-3';
    switch (mode) {
        case 'desktop':
            canvas.style.width = '100%';
            break;
        case 'tablet':
            canvas.style.width = '768px';
            break;
        case 'mobile':
            canvas.style.width = '375px';
            break;
    }
}

// Save website
async function saveWebsite() {
    const canvas = document.getElementById('canvas');
    const websiteData = canvas.innerHTML;
    try {
        await backend.saveWebsite(websiteData);
        alert('Website saved successfully!');
    } catch (error) {
        console.error('Error saving website:', error);
        alert('Failed to save website. Please try again.');
    }
}

// Publish website
async function publishWebsite() {
    try {
        const publishedUrl = await backend.publishWebsite();
        alert(`Website published successfully! URL: ${publishedUrl}`);
    } catch (error) {
        console.error('Error publishing website:', error);
        alert('Failed to publish website. Please try again.');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
