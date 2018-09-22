import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';

import AboutDialog from './about-dialog.component';
import Button from '@material-ui/core/Button';
import CreateTaskDialog from './create-task-dialog.component';
import CreateTaskListDiaog from './create-task-list-dialog.component.js';
import Header from './header.component';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import TaskLists from './task-lists.component';
import Tasks from './tasks.component';
import config from './../config';
import googleTasksApi from 'google-tasks-api';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4995EC'
    },
  }
});

const styles = theme => ({
  appFrame: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },

  topLoadingBar: {
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  }
});

class App extends Component {
  state = {
    lists: [],
    selectedList: {},
    isLoading: false,
    tasks: [],
    isDrawerOpen: false,
    notification: undefined,
    editedList: undefined,
    editedTask: undefined,
    selectedItem: 'tasks',
    openDialog: undefined,
    nextNewTaskPositon: 0,
    appState: 'init',
  };

  constructor() {
    super();

    googleTasksApi.authorize(config.clientId, 'redirect')
      .then(() => this.init());
  }

  async init() {
    if (googleTasksApi.isSignedIn()) {
      this.setState({ appState: 'init' }, async () => {
        await googleTasksApi.loadClient();
        const lists = (await googleTasksApi.listTaskLists()) || [];

        if (lists.length > 0) {
          const selectedList = lists[0];
          const tasks = (await googleTasksApi.listTasks(selectedList.id)) || [];
          this.setTasks(tasks);
          this.setState({ appState: 'ready', lists, selectedList, });
        }
      });
    } else {
      this.setState({ appState: 'auth' });
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("beforeunload", this.onUnload.bind(this))
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("beforeunload", this.onUnload.bind(this))
  }

  render() {
    const { classes } = this.props;

    if (this.state.appState === 'init') {
      return (
        <MuiThemeProvider theme={theme}>
          <LinearProgress variant="query" />
        </MuiThemeProvider>
      );
    } else if (this.state.appState === 'auth') {
      return (
        <MuiThemeProvider theme={theme}>
          <Dialog open={true}>
            <DialogTitle>
              Hello
            </DialogTitle>
            <DialogContent>
              Welcome to Awesome Google Tasks!
              <br />
              This is an alternative client to Google Tasks, so you have to sign in with your Google Account. 
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleSignInClick.bind(this)} color="primary">
                Sign In with Google
            </Button>
            </DialogActions>
          </Dialog>
        </MuiThemeProvider>
      );
    } else if (this.state.appState === 'ready') {
      let title = '';
      switch (this.state.selectedList) {
        case 'all':
          title = 'All Tasks';
          break;

        case 'completed':
          title = 'Completed Tasks';
          break;

        case 'incomplete':
          title = 'Incomplete Tasks';
          break;

        default:
          title = this.state.selectedList.title;
          break;
      }

      return (
        <MuiThemeProvider theme={theme}>
          {this.state.isLoading && <LinearProgress variant="query" className={classes.topLoadingBar} />}
          <div className={classes.appFrame}>

            <Header
              onNewTaskList={this.handleNewTaskList.bind(this)} />

            <TaskLists
              lists={this.state.lists}
              selectedListId={this.state.selectedList.id || this.state.selectedList}
              isSelected={!this.state.openDialog && this.state.selectedItem === 'taskLists'}
              onSelectedListChanged={this.handleSelectedListChange.bind(this)}
              onRenameList={this.handleRenameList.bind(this)}
              onDeleteList={this.handleDeleteList.bind(this)}
              onAboutClick={this.handleAboutClick.bind(this)}
              onNewList={this.handleNewTaskList.bind(this)}
              onSelect={() => this.setState({ selectedItem: 'taskLists' })} />

            <Tasks
              title={title}
              tasks={this.state.tasks}
              selectedList={this.state.selectedList}
              isSelected={!this.state.openDialog && this.state.selectedItem === 'tasks'}
              onTaskUpdate={this.handleTaskUpdate.bind(this)}
              onTaskCheck={this.handleTaskCheck.bind(this)}
              onDeleteTask={this.handleDeleteTask.bind(this)}
              onEditTask={this.handleEditTask.bind(this)}
              onNewTask={this.handleNewTask.bind(this)}
              onSelect={() => this.setState({ selectedItem: 'tasks' })}
            />

            {this.state.openDialog === 'list' &&
              <CreateTaskListDiaog
                title={this.state.editedList ? this.state.editedList.title : ''}
                isEditMode={Boolean(this.state.editedList)}
                onSubmit={this.handleCreateTaskListSubmit.bind(this)}
                onCancel={this.handleCreateTaskListCancel.bind(this)} />}

            {this.state.openDialog === 'task' &&
              <CreateTaskDialog
                isEditMode={true}
                task={this.state.editedTask}
                onSubmit={this.handleEditTaskSubmit.bind(this)}
                onCancel={this.handleEditTaskCancel.bind(this)} />}

            {this.state.openDialog === 'about' && <AboutDialog onClose={this.handleAboutClose.bind(this)} />}

            {this.state.notification &&
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                open={true}
                message={this.state.notification.message}
                action={this.state.notification.undoHandler &&
                  <Button onClick={this.state.notification.undoHandler.bind(this)} color="secondary" size="small">Undo</Button>
                } />
            }
          </div>
        </MuiThemeProvider>
      );
    }
  }

  onUnload(e) {
    if (this.taskUpdateTimer) {
      e.returnValue = 'Oops! Looks like Awesome Google Tasks is still saving your data, are you sure you want out?';
      return e.returnValue;
    }
  }

  async handleSignInClick() {
    await googleTasksApi.signIn();
    this.init();
  }

  handleKeyDown(event) {
    const leftArrowKey = 37;
    const rightArrowKey = 39;
    const allTasksKey = 65;

    if (event.keyCode === leftArrowKey) {
      this.setState({ selectedItem: 'taskLists' });
    } else if (event.keyCode === rightArrowKey) {
      this.setState({ selectedItem: 'tasks' });
    } else if (event.ctrlKey && event.keyCode === allTasksKey) {
      this.handleSelectedListChange('all');
      event.preventDefault();
    }
  }

  showNotification(message, undoHandler, closeAfter = 2000) {
    if (this.timer) clearTimeout(this.timer);

    this.setState({ notification: { message, undoHandler } }, () => {
      this.timer = setTimeout(() => this.setState({ notification: undefined }), closeAfter);
    })
  }

  handleAboutClick() {
    this.setState({ openDialog: 'about' });
  }

  handleAboutClose() {
    this.setState({ openDialog: undefined });
  }

  async handleRenameList(list) {
    this.setState({ editedList: list, openDialog: 'list' });
  }

  async handleDeleteList(list) {
    this.setState({ openDialog: undefined, isLoading: true });
    await googleTasksApi.deleteTaskList({ taskListId: list.id });
    const newTaskLists = await googleTasksApi.listTaskLists();
    this.setState({ isLoading: false, lists: newTaskLists });
    this.showNotification('List removed successfuly');
  }

  handleEditTask(task) {
    this.setState({ editedTask: task, openDialog: 'task' });
  }

  setTasks(tasks) {
    tasks = tasks.sort((a, b) => a.position > b.position ? 1 : b.position > a.position ? -1 : 0);
    this.setState({ tasks })
  }

  handleEditTaskCancel() {
    this.setState({ editedTask: undefined, openDialog: undefined });
  }

  async handleEditTaskSubmit(changedTask) {
    this.setState({ editedTask: undefined, openDialog: undefined });

    const newTasks = this.state.tasks.map(task => task.id === changedTask.id ? changedTask : task);
    this.setTasks(newTasks);
    await googleTasksApi.updateTask({
      taskListId: this.state.selectedList.id,
      taskId: changedTask.id,
      title: changedTask.title,
      notes: changedTask.notes,
      due: Date.parse(changedTask.due) ? changedTask.due : undefined,
    });
  }

  async handleDeleteTask(deletedTask) {
    if (this.state.selectedList.id) {
      this.setState({ isLoading: true });
      const newTasks = this.state.tasks.filter(task => task.id !== deletedTask.id);
      this.setTasks(newTasks);
      await googleTasksApi.deleteTask({ taskListId: this.state.selectedList.id, taskId: deletedTask.id });
      this.setState({ isLoading: false });

      const undo = async () => {
        this.setState({ isLoading: true });
        await googleTasksApi.insertTask({ taskListId: this.state.selectedList.id, title: deletedTask.title, status: deletedTask.status, notes: deletedTask.notes, due: deletedTask.due });
        const newTasks = (await googleTasksApi.listTasks(this.state.selectedList.id)) || [];
        this.setTasks(newTasks)
        this.setState({ isLoading: false });
        this.showNotification(`Task '${deletedTask.title}' has been restored`);
      }

      const notification = deletedTask.title ? `Task '${deletedTask.title}' removed successfuly` : 'Task removed successfuly';

      this.showNotification(notification, undo);
    }
  }

  async handleNewTask() {
    if (this.state.selectedList.id) {
      this.setState({ isLoading: true });
      const newTask = await googleTasksApi.insertTask({ taskListId: this.state.selectedList.id, title: '' });
      newTask.position = this.state.nextNewTaskPositon;
      const newTasks = [...this.state.tasks, newTask]
      this.setTasks(newTasks);
      this.setState({ isLoading: false, nextNewTaskPositon: this.state.nextNewTaskPositon - 1 });
    }
  }

  async handleCreateTaskListSubmit(title) {
    this.setState({ openDialog: undefined, isLoading: true });

    if (title) {
      if (this.state.editedList) {
        await googleTasksApi.updateTaskList({ taskListId: this.state.editedList.id, title });
        this.showNotification(`'${this.state.editedList.title}' was renamed to '${title}'`);

      } else {
        await googleTasksApi.insertTaskList({ title });
        this.showNotification('List created successfuly');
      }
      const newTaskLists = await googleTasksApi.listTaskLists();
      this.setState({ isLoading: false, lists: newTaskLists, editedList: undefined });
    }
  }

  handleCreateTaskListCancel() {
    this.setState({ openDialog: undefined });
  }

  handleNewTaskList() {
    this.setState({ openDialog: 'list' });
  }

  handleTaskUpdate(changedTask, newTitle) {
    if (this.taskUpdateTimer) clearTimeout(this.taskUpdateTimer);
    const newTasks = this.state.tasks.map(task => task.id === changedTask.id ? { ...task, title: newTitle } : task);
    this.setTasks(newTasks);

    this.taskUpdateTimer = setTimeout(async () => {
      await googleTasksApi.updateTask({ taskListId: this.state.selectedList.id, taskId: changedTask.id, title: newTitle });
      this.taskUpdateTimer = undefined;
      this.showNotification('All changes saved');
    }, 50);
  }

  async handleTaskCheck(changedTask) {
    const newStatus = (changedTask.status === 'completed' ? 'needsAction' : 'completed');
    const newTasks = this.state.tasks.map(task => task.id === changedTask.id ? { ...task, status: newStatus } : task);
    this.setTasks(newTasks);
    await googleTasksApi.updateTask({ taskListId: this.state.selectedList.id, taskId: changedTask.id, status: newStatus });
  }

  async handleSelectedListChange(list) {
    if (list === this.state.selectedList || (list.id && list.id === this.state.selectedList.id)) return;

    this.setState({ isLoading: true, });
    let tasks = [];

    if (list === 'all') {
      tasks = await this.listAllTasks();
    } else if (list === 'completed') {
      tasks = (await this.listAllTasks()).filter(task => task.status === 'completed');
    } else if (list === 'incomplete') {
      tasks = (await this.listAllTasks()).filter(task => task.status !== 'completed');
    } else {
      tasks = (await googleTasksApi.listTasks(list.id)) || [];
    }

    this.setState({ selectedList: list, tasks, isLoading: false, })
  }

  async listAllTasks() {
    const tasks = [];
    for (const list of this.state.lists) {
      tasks.push(...(await googleTasksApi.listTasks(list.id)));
    }

    return tasks;
  }
}

export default withStyles(styles)(App);