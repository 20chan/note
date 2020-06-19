import * as React from "react";

interface IProps {
}

interface IState {
    id: string;
    password: string;
}

export class LoginForm extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            id: "",
            password: "",
        };
    }

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const resp = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (resp.ok) {

        }
    }

    render = () => {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="type id" value={this.state.id} onChange={event => this.setState({ id: event.target.value })} required />
                <input type="password" placeholder="type password" value={this.state.password} onChange={event => this.setState({ password: event.target.value })} required />
                <button>Submit</button>
            </form>
        )
    }
}