import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { MenuList } from '@material-ui/core';
import config from './../config';
import { withStyles } from '@material-ui/core/styles';

const { drawerWidth } = config;

const styles = theme => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },

    toolbar: theme.mixins.toolbar,

    // selectedMenuItem: {
    //     backgroundColor: theme.palette.primary.main,
    //     '& $primary, & $icon': {
    //         color: theme.palette.common.white,
    //     },
    // },
    // primary: {},
    // icon: {},
});

class TaskLists extends Component {
    state = {
        pressedList: undefined,
        menuAnchorElement: undefined,
    }

    render() {
        const { classes } = this.props;

        return (
            <Drawer
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left">
                <div className={classes.toolbar} />
                <Divider />
                <List component="nav">
                    <ListItem button onClick={() => this.handleListClick('all')}>
                        <ListItemIcon>
                            <Icon>list</Icon>
                        </ListItemIcon>
                        <ListItemText primary="All Tasks" />
                    </ListItem>

                    <ListItem button onClick={() => this.handleListClick('completed')}>
                        <ListItemIcon>
                            <Icon>check_circle</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Completed Tasks" />
                    </ListItem>

                    <ListItem button onClick={() => this.handleListClick('incomplete')}>
                        <ListItemIcon>
                            <Icon>check_circle_outline</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Incomplete Tasks" />
                    </ListItem>
                </List>
                <Divider />
                <MenuList>
                    {this.props.lists.map(list =>
                        <MenuItem className={list.id === this.props.selectedListId ? classes.selectedMenuItem : ''} onClick={() => this.handleListClick(list)} key={list.id}>
                            <ListItemIcon className={classes.icon}>
                                <Icon>chevron_right</Icon>
                            </ListItemIcon>

                            <ListItemText inset primary={list.title} />

                            {list.id !== this.props.selectedListId &&
                                <ListItemSecondaryAction>
                                    <IconButton onClick={event => this.handleMoreClick(list, event.currentTarget)}>
                                        <Icon>more_vert</Icon>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            }
                        </MenuItem>
                    )}
                </MenuList>
                <Divider />
                <List>
                    <ListItem button onClick={() => window.open('https://www.github.com/bluzi/awesome-google-tasks')}>
                        <ListItemIcon>
                            <Icon>code</Icon>
                        </ListItemIcon>
                        <ListItemText primary="View Source on GitHub" />
                    </ListItem>
                    <ListItem button onClick={() => window.open('https://mail.google.com/tasks/canvas')}>
                        <ListItemIcon>
                            <Icon>http</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Original Site" />
                    </ListItem>
                    <ListItem button onClick={this.props.onAboutClick}>
                        <ListItemIcon>
                            <Icon>info</Icon>
                        </ListItemIcon>
                        <ListItemText primary="About" />
                    </ListItem>
                </List>
                <Menu
                    anchorEl={this.state.menuAnchorElement}
                    open={Boolean(this.state.menuAnchorElement)}
                    onClose={this.handleMenuClose.bind(this)}>

                    <MenuItem onClick={() => this.handleMenuClose(this.props.onSelectedListChanged(this.state.pressedList))}>Open</MenuItem>
                    <MenuItem onClick={this.handleRename.bind(this)}>Rename</MenuItem>
                    <MenuItem onClick={() => this.handleMenuClose(this.props.onDeleteList(this.state.pressedList))}>Delete</MenuItem>
                </Menu>
            </Drawer>
        );
    }

    handleListClick(list) {
        if (this.props.onSelectedListChanged) {
            this.props.onSelectedListChanged(list);
        }
    }

    handleRename(list) {
        this.handleMenuClose();
        this.props.onRenameList(this.state.pressedList);
    }

    handleMoreClick(list, element) {
        this.setState({ pressedList: list, menuAnchorElement: element });
    }

    handleMenuClose() {
        this.setState({ pressedList: undefined, menuAnchorElement: undefined });
    }
}

export default withStyles(styles)(TaskLists);