import React from "react";
import {
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Collapse
} from "shards-react";

import {
    Link
} from "react-router-dom";

export default class NavExample extends React.Component {
    constructor(props) {
        super(props);

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.toggleNavbar = this.toggleNavbar.bind(this);

        this.state = {
            dropdownOpen: false,
            collapseOpen: false
        };
    }

    toggleDropdown() {
        this.setState({
            ...this.state,
            ...{
                dropdownOpen: !this.state.dropdownOpen
            }
        });
    }

    toggleNavbar() {
        this.setState({
            ...this.state,
            ...{
                collapseOpen: !this.state.collapseOpen
            }
        });
    }

    render() {
        return (
            <Navbar type="dark" theme="primary" expand="md">
                <NavbarBrand tag={Link} to="/">EVERSE</NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} />

                <Collapse open={this.state.collapseOpen} navbar>
                    <Nav navbar>
                        <NavItem>
                            <NavLink active tag={Link} to="/request">
                                Request funds
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}