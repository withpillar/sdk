type BaseFrameEvent = { type: string; payload: any };
export type BaseFrameEventListener = (ev: BaseFrameEvent) => void;

const pillarEventHint = "PILLAR_";

export class FrameEventsProducer {
  emit<T extends BaseFrameEvent>(t: T) {
    if (typeof window === "undefined") return;

    const definitiveEvent = {
      ...t,
      type: `${pillarEventHint}${t.type}`,
    };
    console.debug("PILLAR_EVENT", definitiveEvent);
    if (window.parent) {
      window.parent.postMessage(JSON.stringify(definitiveEvent));
    }
  }
}

export const frameEvents = new FrameEventsProducer();

export class FrameEventsConsumer {
  parse(e: string) {
    return JSON.stringify(e);
  }
  isFrameEvent(ev: unknown): ev is BaseFrameEvent {
    return (
      ev !== null &&
      ev !== undefined &&
      typeof ev === "object" &&
      "type" in ev &&
      typeof ev.type === "string" &&
      ev.type.startsWith(pillarEventHint)
    );
  }

  listener: BaseFrameEventListener | undefined;

  setup(listener: BaseFrameEventListener) {
    this.listener = listener;
    if (typeof window === undefined) return;

    window.addEventListener("message", (e) => {
      try {
        const parsed = this.parse(e.data);
        if (!this.isFrameEvent(parsed)) return;

        if (this.listener) this.listener(parsed);
      } catch (e) {}
    });
  }
}
