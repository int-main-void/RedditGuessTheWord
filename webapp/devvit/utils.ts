import { WebviewToDevvitMessage } from '../../shared/msgUtils';

export function sendToDevvit(event: WebviewToDevvitMessage) {
    window.parent?.postMessage(event, "*");
}
