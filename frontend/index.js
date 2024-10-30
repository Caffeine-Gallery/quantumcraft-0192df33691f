import { backend } from 'declarations/backend';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";

// Initialize Lucide icons
lucide.createIcons();

let authClient;
let actor;

// Component categories and their items
const componentCategories = [
    {
        name: 'Basic Elements',
        components: [
            { name: 'Heading', icon: 'type', template: '<h2 class="editable">Heading</h2>' },
            { name: 'Text Block', icon: 'type', template: '<p class="editable">Text block</p>' },
            { name: 'Button', icon: 'square', template: '<button class="btn btn-primary editable">Button</button>' },
            { name: 'Image', icon: 'image', template: '<img src="https://via.placeholder.com/150" alt="Placeholder" class="img-fluid">' }
        ]
    },
    {
        name: 'Layout',
        components: [
            { name: 'Section', icon: 'layout', template: '<div class="section p-3 border rounded mb-3"></div>' },
            { name: 'Container', icon: 'box', template: '<div class="container border rounded p-3 mb-3"></div>' },
            { name: 'Grid', icon: 'grid', template: '<div class="row"><div class="col-md-6 border p-2">Column 1</div><div class="col-md-6 border p-2">Column 2</div></div>' },
            { name: 'Columns', icon: 'columns', template: '<div class="d-flex"><div class="flex-fill border p-2 me-2">Column 1</div><div class="flex-fill border p-2">Column 2</div></div>' }
        ]
    },
    {
        name: 'Advanced',
        components: [
            { name: 'Form', icon: 'square', template: '<form><div class="mb-3"><label class="form-label">Input</label><input type="text" class="form-control"></div><button type="submit" class="btn btn-primary">Submit</button></form>' },
            { name: 'Gallery', icon: 'image', template: '<div class="row"><div class="col-4 mb-3"><img src="https://via.placeholder.com/150" alt="Gallery image" class="img-fluid"></div><div class="col-4 mb-3"><img src="https://via.placeholder.com/150" alt="Gallery image" class="img-fluid"></div><div class="col-4 mb-3"><img src="https://via.placeholder.com/150" alt="Gallery image" class="img-fluid"></div></div>' },
            { name: 'Video', icon: 'video', template: '<div class="ratio ratio-16x9"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video" allowfullscreen></iframe></div>' },
            { name: 'Slider', icon: 'sliders', template: '<div id="carouselExample" class="carousel slide"><div class="carousel-inner"><div class="carousel-item active"><img src="https://via.placeholder.com/800x400" class="d-block w-100" alt="Slide 1"></div><div class="carousel-item"><img src="https://via.placeholder.com/800x400" class="d-block w-100" alt="Slide 2"></div></div><button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button></div>' }
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
                <div class="border rounded p-2 text-center component-item" draggable="true" data-component="${component.name}" data-template="${encodeURIComponent(component.template)}">
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
    const draggableElements = document.querySelectorAll('.component-item');
    draggableElements.forEach(elem => {
        elem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                component: e.target.dataset.component,
                template: e.target.dataset.template
            }));
        });
    });
}

// Handle drop on canvas
function handleCanvasDrop(e) {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text'));
    const newElement = document.createElement('div');
    newElement.className = 'component border rounded p-2 mb-2 position-relative';
    newElement.innerHTML = decodeURIComponent(data.template);
    newElement.innerHTML += `
        <div class="component-controls position-absolute top-0 end-0 p-1">
            <button class="btn btn-sm btn-outline-secondary me-1 move-btn"><i data-lucide="move"></i></button>
            <button class="btn btn-sm btn-outline-danger delete-btn"><i data-lucide="trash-2"></i></button>
        </div>
    `;
    e.target.appendChild(newElement);
    lucide.createIcons();
    addComponentEventListeners(newElement);
}

// Add event listeners to component
function addComponentEventListeners(component) {
    const moveBtn = component.querySelector('.move-btn');
    const deleteBtn = component.querySelector('.delete-btn');
    const editableElements = component.querySelectorAll('.editable');

    moveBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        component.draggable = true;
        component.addEventListener('dragstart', handleDragStart);
        component.addEventListener('dragend', handleDragEnd);
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this component?')) {
            component.remove();
        }
    });

    editableElements.forEach(elem => {
        elem.contentEditable = true;
        elem.addEventListener('focus', () => {
            elem.dataset.before = elem.innerHTML;
        });
        elem.addEventListener('blur', () => {
            if (elem.dataset.before !== elem.innerHTML) {
                // Content changed, you might want to save or update something here
            }
        });
    });
}

// Handle drag start
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', 'move');
    e.target.style.opacity = '0.5';
}

// Handle drag end
function handleDragEnd(e) {
    e.target.style.opacity = '1';
    e.target.draggable = false;
    e.target.removeEventListener('dragstart', handleDragStart);
    e.target.removeEventListener('dragend', handleDragEnd);
}

// Initialize the application
async function init() {
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        handleAuthenticated();
    }

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
    if (!actor) {
        alert('Please log in to save your website.');
        return;
    }

    const canvas = document.getElementById('canvas');
    const websiteData = canvas.innerHTML;
    try {
        await actor.saveWebsite(websiteData);
        alert('Website saved successfully!');
    } catch (error) {
        console.error('Error saving website:', error);
        alert('Failed to save website. Please try again.');
    }
}

// Publish website
async function publishWebsite() {
    if (!actor) {
        alert('Please log in to publish your website.');
        return;
    }

    try {
        const publishedUrl = await actor.publishWebsite();
        alert(`Website published successfully! URL: ${publishedUrl}`);
    } catch (error) {
        console.error('Error publishing website:', error);
        alert('Failed to publish website. Please try again.');
    }
}

// Handle authenticated user
async function handleAuthenticated() {
    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    actor = Actor.createActor(backend.idlFactory, {
        agent,
        canisterId: backend.canisterId,
    });
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
