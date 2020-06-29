import * as React from "react";
import TextareaAutosize from 'react-autosize-textarea';
import { Note } from "../note";

interface Props {
    onCreate: (titel: string, content: string) => void;
}

export const NewNoteCard = (props: Props) => {
    const titleText = React.createRef<HTMLTextAreaElement>();
    const contentText = React.createRef<HTMLTextAreaElement>();
    const [title, setTitle] = React.useState<string>("");
    const [content, setContent] = React.useState<string>("");

    React.useEffect(() => {
        titleText.current?.addEventListener("keypress", ev => {
            if (ev.key === "Enter") {
                ev.preventDefault();
                ev.stopPropagation();
                contentText.current?.focus();
            }
        });
    }, []);

    return (
        <div className="newNoteCard">
            <div className="newNoteHeader">
                <TextareaAutosize className="newCardTextarea" ref={titleText} value={title} onChange={e => setTitle(e.currentTarget.value)} placeholder="title" />
            </div>
            <div className="newNoteBody">
                <TextareaAutosize className="newCardTextarea" ref={contentText} rows={3} value={content} onChange={e => setContent(e.currentTarget.value)} placeholder="content..." />
                <button onClick={ev => props.onCreate(title, content)}>Upload</button>
            </div>
        </div>
    );
};