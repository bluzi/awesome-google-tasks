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
    isInitializing: true,
    notification: undefined,
    editedList: undefined,
    editedTask: undefined,
    selectedItem: 'tasks',
    openDialog: undefined,
  };

  constructor() {
    super();

    this.loadLists();
  }

  async loadLists() {
    await googleTasksApi.authorize(config.clientId);
    const lists = await googleTasksApi.listTaskLists();

    if (lists.length > 0) {
      const selectedList = lists[0];
      const tasks = await googleTasksApi.listTasks(selectedList.id) || [];
      this.setState({ lists, selectedList, tasks, isInitializing: false, });
    } else {
      alert('no lists');
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    const { classes } = this.props;

    if (this.state.isInitializing) {
      return (
        <MuiThemeProvider theme={theme}>
          <LinearProgress variant="query" />
        </MuiThemeProvider>
      );
    } else {
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
              onNewTaskList={this.handleNewTaskList.bind(this)}
              onClearCompletedTasks={this.handleClearCompletedTasks.bind(this)} />

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
              onAddSubtask={this.handleAddSubtask.bind(this)}
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

  async handleAddSubtask(task) {
    if (this.state.selectedList.id) {
      this.setState({ isLoading: true });
      await googleTasksApi.insertTask({ taskListId: this.state.selectedList.id, title: '', parent: task.id })
      const newTasks = (await googleTasksApi.listTasks(this.state.selectedList.id)) || [];
      this.setTasks(newTasks);
      this.setState({ isLoading: false });
    }
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

  async handleClearCompletedTasks(list) {
    const completedTasks = (await this.listAllTasks()).filter(task => task.status === 'completed');
    await Promise.all(
      completedTasks.map(task => googleTasksApi.deleteTask({ taskId: task.id }))
    );
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
    const subtasks = tasks.filter(task => task.parent);
    tasks = tasks.filter(task => !task.parent);

    tasks = tasks.sort((a, b) => new Date(a.position) > new Date(b.position) ? 1 : new Date(b.position) > new Date(a.position) ? -1 : 0);

    subtasks.forEach(subtask => {
      const parent = tasks.find(task => task.id === subtask.parent);
      if (parent) {
        tasks.splice(tasks.indexOf(parent) + 1, 0, subtask);
      }
    });

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

  async handleDeleteTask(task) {
    if (this.state.selectedList.id) {
      this.setState({ isLoading: true });
      await googleTasksApi.deleteTask({ taskListId: this.state.selectedList.id, taskId: task.id });
      const newTasks = (await googleTasksApi.listTasks(this.state.selectedList.id)) || [];
      this.setTasks(newTasks);
      this.setState({ isLoading: false });

      const undo = async () => {
        this.setState({ isLoading: true });
        await googleTasksApi.insertTask({ taskListId: this.state.selectedList.id, title: task.title, status: task.status, notes: task.notes, due: task.due });
        const newTasks = (await googleTasksApi.listTasks(this.state.selectedList.id)) || [];
        this.setTasks(newTasks)
        this.setState({ isLoading: false });
        this.showNotification(`Task '${task.title}' has been restored`);
      }

      this.showNotification(`Task '${task.title}' removed successfuly`, undo);
    }
  }

  async handleNewTask() {
    if (this.state.selectedList.id) {
      this.setState({ isLoading: true });
      await googleTasksApi.insertTask({ taskListId: this.state.selectedList.id, title: '' })
      const newTasks = (await googleTasksApi.listTasks(this.state.selectedList.id)) || [];
      this.setTasks(newTasks);
      this.setState({ isLoading: false });
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
    }, 500);
  }

  async handleTaskCheck(changedTask) {
    const newStatus = (changedTask.status === 'completed' ? 'needsAction' : 'completed');
    const newTasks = this.state.tasks.map(task => task.id === changedTask.id ? { ...task, status: newStatus } : task);
    this.setTasks(newTasks);
    await googleTasksApi.updateTask({ taskListId: this.state.selectedList.id, taskId: changedTask.id, status: newStatus });
  }

  async handleSelectedListChange(list) {
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