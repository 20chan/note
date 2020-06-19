import * as React from "react";

interface Note {
    id: string;
    title: string;
    content: string;
}

export const NotePage = () => {
    const [notes, setNotes] = React.useState<Note[]>([]);
    React.useEffect(() => {
        console.log("effect");
        fetch("/api/note", {
            method: "GET",
        }).then(async resp => {
            console.log("fetch");
            setNotes(await resp.json());
        });
    }, []);

    return (
        <ul>
        { notes.map(n =>
            <li key={n.id}>{n.title}</li>)
        }
        </ul>
    );
};