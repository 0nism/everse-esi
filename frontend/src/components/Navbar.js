import React from "react";
import {
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    FormInput,
    Collapse
} from "shards-react";

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
                <NavbarBrand href="#">EVERSE</NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} />

                <Collapse open={this.state.collapseOpen} navbar>
                    <Nav navbar>
                        <NavItem>
                            <NavLink active href="#">
                                Request funds
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}