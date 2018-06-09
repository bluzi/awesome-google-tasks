import { CardContent, Chip, Tooltip } from '@material-ui/core';
import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import dateformat from 'dateformat';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
    toolbar: theme.mixins.toolbar,
    fab: {
        position: 'fixed',
        bottom: theme.spacing.unit * 5,
        right: theme.spacing.unit * 5,
    }
});

class Tasks extends Component {
    state = {
        selectedIndex: 0,
    };

    componentDidMount() {
        document.addEventListener("keydown", event => this.handleKeyDown(event));
        this.reloadTip();
        this.setState({ tipsInterval: setInterval(() => {
            this.reloadTip();
        }, 5000) });
    }

    componentWillReceiveProps(newProps) {
        if (newProps.tasks.length !== this.props.tasks.length) {
            this.setState({ selectedIndex: 0 });
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.tipsInterval);
    }

    render() {
        const { classes } = this.props;

        let tasks; 
        if (this.props.selectedListid) {
            tasks = this.props.tasks.sort((a, b) => new Date(a.position) > new Date(b.position) ? 1 : new Date(b.position) > new Date(a.position) ? -1 : 0);
        } else {
            tasks = this.props.tasks.sort((a, b) => new Date(a.updated) > new Date(b.updated) ? 1 : new Date(b.updated) > new Date(a.updated) ? -1 : 0);
        }

        return (
            <div className={classes.content}>
                <div className={classes.toolbar} />
                <Card className="tasks-card">
                    <Typography gutterBottom variant="title" component="h2">
                        {this.props.title}
                    </Typography>

                    {tasks.length === 0 &&
                        <CardContent>
                            <Typography align="center">
                                A fresh start, anything to add?
                                <br />
                                <Button onClick={this.props.onNewTask}>Create Task</Button>
                            </Typography>
                        </CardContent>
                    }

                    {tasks.map((task, index) =>
                        <div className={classNames({
                            task: true,
                            completed: task.status === 'completed',
                            selected: this.props.isSelected && this.state.selectedIndex === index
                        })} key={task.id} onMouseOver={() => this.select(index)}>
                            <Tooltip title={task.notes || ''} disableHoverListener={!task.notes}>
                                <Checkbox readOnly={!this.props.selectedList.id} checked={task.status === 'completed'} onChange={() => this.props.onTaskCheck(task)} />
                            </Tooltip>

                            <input
                                type="text"
                                autoFocus={index === 0}
                                placeholder="What do you want to do?"
                                readOnly={!this.props.selectedList.id}
                                value={task.title}
                                className="task-title"
                                onChange={event => this.props.onTaskUpdate(task, event.target.value)}
                                onKeyUp={this.handleKeyUp.bind(this)} />

                            {task.due &&
                                <div className="chip-container">
                                    <Chip label={dateformat(new Date(task.due), 'dd/mm/yyyy')} />
                                </div>
                            }

                            <IconButton disabled={!this.props.selectedList.id} onClick={() => this.props.onEditTask(task)}>
                                <Icon>edit</Icon>
                            </IconButton>

                            <IconButton disabled={!this.props.selectedList.id} onClick={() => this.props.onDeleteTask(task)}>
                                <Icon>delete</Icon>
                            </IconButton>
                        </div>
                    )}
                </Card>

                <div className="tip">
                    <strong>Tip:</strong> {this.state.tip}.
                </div>

                <Tooltip title="Add Task">
                    <Button variant="fab" color="secondary" className={classes.fab} onClick={this.props.onNewTask} disabled={!this.props.selectedList.id}>
                        <Icon>add</Icon>
                    </Button>
                </Tooltip>
            </div>
        );
    }

    handleKeyUp(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    handleKeyDown(event) {
        if (!this.props.isSelected) return;

        const upArrowKey = 38;
        const downArrowKey = 40;
        const enterKey = 13;
        const editKey = 69;
        const deleteKey = 68;
        const newKey = 78;

        if (event.keyCode === upArrowKey) {
            const selectedIndex = (this.state.selectedIndex - 1 < 0) ? this.props.tasks.length - 1 : (this.state.selectedIndex - 1);
            this.setState({ selectedIndex });
        } else if (event.keyCode === downArrowKey) {
            const selectedIndex = (this.state.selectedIndex + 1 > this.props.tasks.length - 1) ? 0 : (this.state.selectedIndex + 1);
            this.setState({ selectedIndex });
        } else if (this.props.tasks[this.state.selectedIndex]) {
            const selectedTask = this.props.tasks[this.state.selectedIndex];
            if (event.keyCode === enterKey) {
                this.props.onTaskCheck(selectedTask);
            } else if (event.ctrlKey && event.keyCode === editKey) {
                this.props.onEditTask(selectedTask);
            } else if (event.ctrlKey && event.keyCode === deleteKey) {
                this.props.onDeleteTask(selectedTask);
            } else if (event.ctrlKey && event.keyCode === newKey) {
                this.props.onNewTask(selectedTask);
            }
        }
    }

    reloadTip() {
        const tips = [
            'Use the arrow keys to navigate between tasks and lists',
            'Press CTRL+N to create a new task or a list, depends on the selected context',
            'Press CTRL+E to edit the selected task or list',
            'Press CTRL+D to remove the select task or list',
            'Press Enter while selecting a task to mark it as completed',
            'Press Enter while selecting a list to navigate into it',
            'Use CTRL+A to view all tasks',
        ];

        this.setState({ tip: tips[Math.floor(Math.random() * tips.length)] });
    }

    select(index) {
        this.props.onSelect();
        this.setState({ selectedIndex: index });
    }
}

export default withStyles(styles)(Tasks);