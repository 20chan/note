import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

const LoginPage: React.SFC<RouteComponentProps> = ({ history }) => {
    const [id, setId] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const resp = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ id, password }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (resp.ok) {
            history.push("/");
        } else {
            setPassword("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="type id" value={id} onChange={event => setId(event.target.value)} required />
            <input type="password" placeholder="type password" value={password} onChange={event => setPassword(event.target.value)} required />
            <button>Submit</button>
        </form>
    );
};

export default withRouter(LoginPage);
