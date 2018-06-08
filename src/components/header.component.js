import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import { Tooltip } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import config from './../config';
import { withStyles } from '@material-ui/core/styles';

const { drawerWidth } = config;

const styles = {
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
  },

  flex: {
    flex: 1,
  }
};

class Header extends Component {
  state = {
    menuElement: undefined,
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Awesome Google Tasks
            </Typography>

            <Tooltip title="Add List">
              <IconButton color="inherit" onClick={this.props.onNewTaskList}>
                <Icon>add</Icon>
              </IconButton>
            </Tooltip>

            <IconButton color="inherit" onClick={this.handleMenuClick.bind(this)}>
              <Icon>more_vert</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Menu
          anchorEl={this.state.menuElement}
          open={Boolean(this.state.menuElement)}
          onClose={this.handleMenuClose.bind(this)}>

          <MenuItem onClick={() => this.props.onClearCompletedTasks()}>Clear Completed Tasks</MenuItem>
        </Menu>
      </div>
    );
  }

  handleMenuClick(event) {
    this.setState({ menuElement: event.currentTarget });
  }

  handleMenuClose() {
    this.setState({ menuElement: undefined });
  }
}

export default withStyles(styles)(Header);