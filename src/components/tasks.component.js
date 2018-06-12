import { CardContent, Tooltip } from '@material-ui/core';
import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Task from './task.component';

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
    }

    componentWillReceiveProps(newProps) {
        if (newProps.tasks.length !== this.props.tasks.length) {
            this.setState({ selectedIndex: 0 });
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.content}>
                <div className={classes.toolbar} />
                <Card className="tasks-card">
                    <Typography gutterBottom variant="title" component="h2">
                        {this.props.title}
                    </Typography>

                    {this.props.tasks.length === 0 &&
                        <CardContent>
                            <Typography align="center">
                                A fresh start, anything to add?
                                <br />
                                <Button onClick={this.props.onNewTask}>Create Task</Button>
                            </Typography>
                        </CardContent>
                    }

                    {this.props.tasks.map((task, index) =>
                        <Task
                            task={task}
                            index={index}
                            key={task.id}
                            isSelected={this.props.isSelected && this.state.selectedIndex === index}
                            isReadOnly={!this.props.selectedList.id}
                            onMouseOver={() => this.select(index)}
                            onDelete={() => this.props.onDeleteTask(task)}
                            onEdit={() => this.props.onEditTask(task)}
                            onTaskUpdate={newTitle => this.props.onTaskUpdate(task, newTitle)}
                            onCheck={() => this.props.onTaskCheck(task)} />
                    )}
                </Card>

                <Tooltip title="Add Task">
                    <Button variant="fab" color="secondary" className={classes.fab} onClick={this.props.onNewTask} disabled={!this.props.selectedList.id}>
                        <Icon>add</Icon>
                    </Button>
                </Tooltip>
            </div>
        );
    }

    handleKeyDown(event) {
        if (!this.props.isSelected) return;

        const upArrowKey = 38;
        const downArrowKey = 40;
        const enterKey = 13;
        const editKey = 69;
        const deleteKey = 68;

        if (event.keyCode === upArrowKey) {
            event.preventDefault();
            event.stopPropagation();
            const selectedIndex = (this.state.selectedIndex - 1 < 0) ? this.props.tasks.length - 1 : (this.state.selectedIndex - 1);
            this.setState({ selectedIndex });
        } else if (event.keyCode === downArrowKey) {
            event.preventDefault();
            event.stopPropagation();
            const selectedIndex = (this.state.selectedIndex + 1 > this.props.tasks.length - 1) ? 0 : (this.state.selectedIndex + 1);
            this.setState({ selectedIndex });
        } else if (this.props.tasks[this.state.selectedIndex]) {
            const selectedTask = this.props.tasks[this.state.selectedIndex];
            if (event.keyCode === enterKey) {
                if (event.ctrlKey) this.props.onTaskCheck(selectedTask);
                else this.props.onNewTask(selectedTask);
            } else if (event.ctrlKey && event.keyCode === editKey) {
                this.props.onEditTask(selectedTask);
            } else if (event.ctrlKey && event.keyCode === deleteKey) {
                this.props.onDeleteTask(selectedTask);
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    select(index) {
        this.props.onSelect();
        this.setState({ selectedIndex: index });
    }
}

export default withStyles(styles)(Tasks);