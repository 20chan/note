import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface Note {
    id: string;
    title: string;
    content: string;
}

const NotePage: React.SFC<RouteComponentProps> = ({ history }) => {
    const [auth, setAuth] = React.useState<boolean>(false);
    const [notes, setNotes] = React.useState<Note[]>([]);

    React.useEffect(() => {
        fetch("/api/note", {
            method: "GET",
        }).then(async resp => {
            if (resp.ok) {
                setNotes(await resp.json());
                setAuth(true);
            } else {
                history.push("/login");
            }
        });
    }, []);

    const logout = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const resp = await fetch("/api/auth/logout", {
            method: "GET",
        });
        if (resp.ok) {
            history.push("/login");
        }
    };

    if (!auth) {
        return (
            <div>
                <em>trying to auth...</em>
            </div>
        );
    }
    return (
        <div>
            <button onClick={logout}>logout</button>
            <ul> { notes.map(n =>
                <li key={n.id}>{n.title}</li>)
            }
            </ul>
        </div>
    );
};

export default withRouter(NotePage);