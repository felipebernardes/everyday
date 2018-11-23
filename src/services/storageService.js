class StorageService {
  constructor() {
    this.localStorage = window.localStorage;
  }

  getLocalStorage() {
    const ls = JSON.parse(window.localStorage.getItem('everyday-database'));
    return ls || { projects: []};
  }

  saveLocalStorage(ls) {
    window.localStorage.removeItem('everyday-database');
    window.localStorage.setItem('everyday-database', JSON.stringify(ls));
  }

  getProjectIndex(projectName) {
    const ls = this.getLocalStorage();
    let projectIndex;
  }

  saveProject(updatedProject) {
    let projectIndex;
    const ls = this.getLocalStorage();

    ls.projects.forEach((p, i) => {
      if (p.name === updatedProject.name) {
        projectIndex = i;
      };
    });

    if (projectIndex >= 0) {
      ls.projects[projectIndex] = updatedProject;
    } else {
      ls.projects.push(updatedProject);
    }

    this.saveLocalStorage(ls);
  }
}
