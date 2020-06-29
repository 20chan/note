import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Note } from "./note";
import { NoteCard } from "./components/noteCard";
import { NewNoteCard } from "./components/newNoteCard";
import "./notes.css";

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

    const submitNewNote = (title: string, content: string) => {
        fetch("/api/note", {
            method: "POST",
            body: JSON.stringify({ title, content }),
            headers: {
                "Content-Type": "application/json",
            }
        });
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
            <div className="newNoteArea">
                <NewNoteCard onCreate={submitNewNote}/>
            </div>
            <div className="notes">
            { notes.map(n =>
                <NoteCard note={n} />
            )}
            </div>
        </div>
    );
};

export default withRouter(NotePage);