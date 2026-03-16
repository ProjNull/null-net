import van from "vanjs-core";
import { CloseIcon } from "./icons";

const {div,button,h1} = van.tags;


export const showModal = (content:HTMLElement,title:string = "") => {
    const titleRef = van.state(title);
    const modal = div({classList:"modal-overlay"},
        div({classList:"modal"},
            div({classList: "modal-header"},
                h1(titleRef),
                button({classList:"btn", onclick: () => modal.remove()},CloseIcon())
            ),
            div({classList: "modal-content"},
                content
            ),
        )
    )
    van.add(document.body, modal);
    return {
        modal,
        remove: () => modal.remove(),
        setTitle: (title:string) => titleRef.val = title
    };
}