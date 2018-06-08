import { CardContent, Chip, Tooltip } from '@material-ui/core';
import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
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
    state = {};

    handleKeyUp(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    render() {
        const { classes } = this.props;

        const tasks = this.props.tasks.sort((a, b) => new Date(a.position) > new Date(b.position) ? 1 : new Date(b.position) > new Date(a.position) ? -1 : 0);

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
                        <div className={"task " + (task.status === 'completed' && 'completed')} key={task.id}>
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

                <Tooltip title="Add Task">
                    <Button variant="fab" color="secondary" className={classes.fab} onClick={this.props.onNewTask} disabled={!this.props.selectedList.id}>
                        <Icon>add</Icon>
                    </Button>
                </Tooltip>
            </div>
        );
    }
}

export default withStyles(styles)(Tasks);
