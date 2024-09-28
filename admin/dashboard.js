const API_URL = '';

function showSection(sectionId) {
  document.querySelectorAll('section').forEach((section) => {
    section.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';
  document.querySelectorAll('.sidebar-nav a').forEach((link) => {
    link.classList.remove('active');
  });
  document
    .querySelector(`.sidebar-nav a[onclick="showSection('${sectionId}')"]`)
    .classList.add('active');
}

async function fetchProjects() {
  try {
    const response = await fetch(`${API_URL}/project/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    const projects = await response.json();
    updateTable(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    document.getElementById(
      'projectTable'
    ).innerHTML = `<p class="error">Error loading projects: ${error.message}</p>`;
  }
}

function updateTable(projects) {
  const tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Team Members</th>
                    <th>Faculty Guide</th>
                    <th>Description</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${projects
                  .map(
                    (project) => `
                    <tr>
                        <td>${project.id}</td>
                        <td>${project.name}</td>
                        <td>${project.team_members.join(', ')}</td>
                        <td>${project.faculty_guide}</td>
                        <td>${project.description}</td>
                        <td>${project.status}</td>
                    </tr>
                `
                  )
                  .join('')}
            </tbody>
        </table>
    `;
  document.getElementById('projectTable').innerHTML = tableHtml;
}

async function addProject(e) {
  e.preventDefault();
  const newProject = {
    name: document.getElementById('addName').value,
    team_members: document
      .getElementById('addTeamMembers')
      .value.split(',')
      .map((member) => member.trim()),
    faculty_guide: document.getElementById('addFacultyGuide').value,
    description: document.getElementById('addDescription').value,
    status: document.getElementById('addStatus').value,
  };
  try {
    const response = await fetch(`${API_URL}/project/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    });
    if (!response.ok) {
      throw new Error('Failed to add project');
    }
    showNotification('Project added successfully', 'success');
    fetchProjects();
    e.target.reset();
  } catch (error) {
    console.error('Error adding project:', error);
    showNotification(`Error adding project: ${error.message}`, 'error');
  }
}

async function updateProject(e) {
  e.preventDefault();
  const id = document.getElementById('updateId').value;
  const updatedProject = {
    name: document.getElementById('updateName').value,
    team_members: document
      .getElementById('updateTeamMembers')
      .value.split(',')
      .map((member) => member.trim()),
    faculty_guide: document.getElementById('updateFacultyGuide').value,
    description: document.getElementById('updateDescription').value,
    status: document.getElementById('updateStatus').value,
  };
  try {
    const response = await fetch(`${API_URL}/project/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProject),
    });
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    showNotification('Project updated successfully', 'success');
    fetchProjects();
    e.target.reset();
  } catch (error) {
    console.error('Error updating project:', error);
    showNotification(`Error updating project: ${error.message}`, 'error');
  }
}

let selectedProjectId = null;

async function filterProjects() {
    const searchQuery = document.getElementById('searchBar').value;
    const projectList = document.getElementById('projectList');

    if (searchQuery.trim().length > 0) {
        try {
            const response = await fetch(`${API_URL}/project/search/?query=${searchQuery}`);
            const projects = await response.json();
            
            projectList.innerHTML = ''; 

            if (projects.length === 0) {
                projectList.innerHTML = '<li>No projects found</li>';
            } else {
                projects.forEach(project => {
                    const listItem = document.createElement('li');
                    listItem.textContent = project.name;
                    listItem.dataset.id = project.id;
                    listItem.addEventListener('click', () => selectProject(project.id, project.name));
                    projectList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    } else {
        projectList.innerHTML = ''; 
    }
}

function selectProject(id, name) {
    document.getElementById('searchBar').value = name;
    selectedProjectId = id;
}

async function deleteProject(e) {
    e.preventDefault();

    if (!selectedProjectId) {
        alert('Please select a project to delete.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/project/delete/${selectedProjectId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete project.');
        }

        alert('Project deleted successfully!');
        filterProjects();
        selectedProjectId = null; 
    } catch (error) {
        console.error('Error deleting project:', error);
        alert(`Error: ${error.message}`);
    }
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.className = type;
  document
    .querySelector('.main-content')
    .insertBefore(
      notification,
      document.querySelector('.main-content').firstChild
    );
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

fetchProjects();
