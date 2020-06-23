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

    if (!auth) {
        return (
            <div>
                <em>trying to auth...</em>
            </div>
        );
    }
    return (
        <ul>
        { notes.map(n =>
            <li key={n.id}>{n.title}</li>)
        }
        </ul>
    );
};

export default withRouter(NotePage);