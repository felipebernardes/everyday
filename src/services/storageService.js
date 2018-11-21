class StorageService {
  constructor() {
    this.localStorage = window.localStorage;
  }

  getLocalStorage() {
    const ls = JSON.parse(window.localStorage.getItem('everyday-database'));
    return ls || { projects: []};
  }

  saveLocalStorage(ls) {
    window.localStorage.setItem('everyday-database', JSON.stringify(ls));
  }

  getProject(projectName) {
    const ls = this.getLocalStorage();
    const rawProject = ls.projects.filter(p => p.name === projectName);
    if (rawProject.length > 0) {
      return JSON.parse(rawProject);
    }
  }

  saveProject(updatedProject) {
    const project = this.getProject(updatedProject.name);
    const ls = this.getLocalStorage();

    if (project) {
      project = updatedProject;
    } else {
      ls.projects.push(updatedProject);
    }

    this.saveLocalStorage(ls);
  }
}
