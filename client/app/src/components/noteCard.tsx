import * as React from "react";
import { Note } from "../note";

interface Props {
    note: Note;
}

export const NoteCard: React.FunctionComponent<Props> = ({ note }) => {
    return (
        <div>
            <div className="card-header">{note.title}</div>
            <div className="card-content">{note.content}</div>
        </div>
    );
};