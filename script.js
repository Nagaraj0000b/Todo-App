class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
        this.applyTheme();
    }

    bindEvents() {
        // Todo functionality
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Navigation
        document.getElementById('homeBtn').addEventListener('click', () => this.showSection('home'));
        document.getElementById('aboutBtn').addEventListener('click', () => this.showSection('about'));
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        
        if (!text) return;

        const todo = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.render();
        this.updateStats();
        input.value = '';
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.saveTodos();
        this.render();
        this.updateStats();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
        this.updateStats();
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveTodos();
        this.render();
        this.updateStats();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active': return this.todos.filter(todo => !todo.completed);
            case 'completed': return this.todos.filter(todo => todo.completed);
            default: return this.todos;
        }
    }

    render() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            todoList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <div style="font-size: 48px; margin-bottom: 16px;">📝</div>
                    <p>No tasks ${this.currentFilter === 'all' ? 'yet' : this.currentFilter}</p>
                </div>
            `;
            return;
        }

        todoList.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item">
                <div class="todo-checkbox ${todo.completed ? 'completed' : ''}" 
                     onclick="app.toggleTodo(${todo.id})"></div>
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">×</button>
            </div>
        `).join('');
    }

    updateStats() {
        const activeTodos = this.todos.filter(todo => !todo.completed).length;
        const todoCount = document.getElementById('todoCount');
        todoCount.textContent = `${activeTodos} task${activeTodos !== 1 ? 's' : ''} remaining`;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    showSection(section) {
        const todoApp = document.getElementById('todoApp');
        const aboutSection = document.getElementById('aboutSection');
        const homeBtn = document.getElementById('homeBtn');
        const aboutBtn = document.getElementById('aboutBtn');

        if (section === 'home') {
            todoApp.style.display = 'block';
            aboutSection.style.display = 'none';
            homeBtn.classList.add('active');
            aboutBtn.classList.remove('active');
        } else {
            todoApp.style.display = 'none';
            aboutSection.style.display = 'block';
            homeBtn.classList.remove('active');
            aboutBtn.classList.add('active');
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    applyTheme() {
        const icon = document.querySelector('.theme-icon');
        
        if (this.theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            icon.textContent = '🌙';
        } else {
            document.documentElement.removeAttribute('data-theme');
            icon.textContent = '☀️';
        }
    }
}

// Initialize app
const app = new TodoApp();

// Set home as active by default
document.getElementById('homeBtn').classList.add('active');