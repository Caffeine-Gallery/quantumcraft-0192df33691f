import { backend } from 'declarations/backend';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";

lucide.createIcons();

let authClient;
let actor;
let currentWebsite = { components: [] };

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
    }
];

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

    lucide.createIcons();
    addDragFunctionality();
}

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
    updateCurrentWebsite();
}

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
            updateCurrentWebsite();
        }
    });

    editableElements.forEach(elem => {
        elem.contentEditable = true;
        elem.addEventListener('blur', () => {
            updateCurrentWebsite();
        });
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', 'move');
    e.target.style.opacity = '0.5';
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    e.target.draggable = false;
    e.target.removeEventListener('dragstart', handleDragStart);
    e.target.removeEventListener('dragend', handleDragEnd);
    updateCurrentWebsite();
}

async function init() {
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        handleAuthenticated();
    }

    populateComponentList();

    const canvas = document.getElementById('canvas');
    canvas.addEventListener('dragover', (e) => e.preventDefault());
    canvas.addEventListener('drop', handleCanvasDrop);

    document.getElementById('desktopBtn').addEventListener('click', () => setPreviewMode('desktop'));
    document.getElementById('tabletBtn').addEventListener('click', () => setPreviewMode('tablet'));
    document.getElementById('mobileBtn').addEventListener('click', () => setPreviewMode('mobile'));

    document.getElementById('saveBtn').addEventListener('click', saveWebsite);
    document.getElementById('publishBtn').addEventListener('click', publishWebsite);
}

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

function updateCurrentWebsite() {
    const canvas = document.getElementById('canvas');
    currentWebsite.components = Array.from(canvas.children).map(child => ({
        type: child.querySelector('.editable') ? child.querySelector('.editable').tagName.toLowerCase() : 'div',
        content: child.querySelector('.editable') ? child.querySelector('.editable').innerHTML : child.innerHTML
    }));
}

async function saveWebsite() {
    if (!actor) {
        alert('Please log in to save your website.');
        return;
    }

    try {
        await actor.saveWebsite(JSON.stringify(currentWebsite));
        alert('Website saved successfully!');
    } catch (error) {
        console.error('Error saving website:', error);
        alert('Failed to save website. Please try again.');
    }
}

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

async function handleAuthenticated() {
    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    actor = Actor.createActor(backend.idlFactory, {
        agent,
        canisterId: backend.canisterId,
    });

    try {
        const savedWebsite = await actor.getCurrentWebsite();
        if (savedWebsite) {
            currentWebsite = JSON.parse(savedWebsite);
            renderSavedWebsite();
        }
    } catch (error) {
        console.error('Error loading saved website:', error);
    }
}

function renderSavedWebsite() {
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = '';
    currentWebsite.components.forEach(component => {
        const newElement = document.createElement('div');
        newElement.className = 'component border rounded p-2 mb-2 position-relative';
        newElement.innerHTML = `<${component.type} class="editable">${component.content}</${component.type}>`;
        newElement.innerHTML += `
            <div class="component-controls position-absolute top-0 end-0 p-1">
                <button class="btn btn-sm btn-outline-secondary me-1 move-btn"><i data-lucide="move"></i></button>
                <button class="btn btn-sm btn-outline-danger delete-btn"><i data-lucide="trash-2"></i></button>
            </div>
        `;
        canvas.appendChild(newElement);
        addComponentEventListeners(newElement);
    });
    lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', init);
