import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
// import { TextField } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
// import Avatar from '@material-ui/core/Avatar';
// import Fab from '@material-ui/core/Fab';
// import AddIcon from '@material-ui/icons/Add';
// import FolderIcon from '@material-ui/icons/Folder';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import Collapse from '@material-ui/core/Collapse';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import SendIcon from '@material-ui/icons/Send';
// import SettingsIcon from '@material-ui/icons/Settings';
// import ExpandLess from '@material-ui/icons/ExpandLess';
// import ExpandMore from '@material-ui/icons/ExpandMore';
// import StarBorder from '@material-ui/icons/StarBorder';
import './Nav.css';

const Nav = (props) => (
  <div className='nav'>
    <Link to='/home'>
      <h2 className='nav-title'>Board Game Loaner</h2>
    </Link>
    <div className='nav-right'>
      {/* Show the link to the info page and the logout button if the user is logged in */}
      <Link className='nav-link' to='/search/users'>
        Search Users
      </Link>
      <Link className='nav-link' to='/search/games'>
        Search Games
      </Link>
      <Link className='nav-link' to='/dashboard'>
        {props.status.userIsSignedIn ? 'Dash Board' : 'Login / Register'}
      </Link>
      {props.status.userIsSignedIn && (
        <>
          <Link className='nav-link' to='/settings'>
            Settings
          </Link>
          <LogOutButton className='nav-link' />
        </>
      )}
    </div>
  </div>
);

// state = {
//   search: '',
//   menuIsOpen: false
// }

// handleClick = () => {
//   this.setState({
//     menuIsOpen: !this.state.menuIsOpen
//   });
// };
// {
//   this.props.status.userIsSignedIn &&
//   <Fab>
//     <List
//       component="nav"
//       aria-labelledby="nested-list-subheader"
//     >
//       <ListItem button onClick={this.handleClick}>
//         {/* <ListItemIcon> */}
//                 Profile
//               {/* </ListItemIcon> */}
//         {this.state.menuIsOpen ? <ExpandLess /> : <ExpandMore />}
//       </ListItem>
//       <Collapse in={this.state.menuIsOpen} timeout="auto" unmountOnExit>
//         <List component="div">
//           <ListItem button onClick={this.handleClick}>
//             {/* <ListItemIcon>
//                     <StarBorder />
//                   </ListItemIcon> */}
//             {/* <ListItemText primary="Starred" /> */}
//             {/* Games */}
//             <ListItemText primary="Games" />
//           </ListItem >
//           <ListItem button onClick={this.handleClick}>
//             <ListItemText primary="Friends" />
//             {/* Friends */}
//           </ListItem>
//           <ListItem button onClick={this.handleClick}>
//             <SettingsIcon />
//             <ListItemText primary="Settings" />
//             {/* Settings */}
//           </ListItem>
//         </List>
//       </Collapse>
//     </List>
//   </Fab>
// }

// Instead of taking everything from state, we just want the user
// object to determine if they are logged in
// if they are logged in, we show them a few more links
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user }) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
  status: state.status
});

export default connect(mapStateToProps)(Nav);
