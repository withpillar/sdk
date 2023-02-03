import { SupportedEmbeds } from "./types";

import { BaseFrameEventListener, FrameEventsConsumer } from "./events";
import { entries, fromEntries } from "./minimalLib";

type PillarSDKEmbedOptions = {
  baseURL: string;
  publicKey: string;
  organizationName: string;
  embed: SupportedEmbeds;
  iframeOptions?: Partial<HTMLIFrameElement>;
};

export const toStringValues = <O extends Record<string, unknown>>(o: O) =>
  fromEntries(
    entries<Record<string, unknown>>(o ?? ({} as Record<string, unknown>)).map(
      ([k, v]) => [k, "" + v]
    )
  );

export const buildEmbedURL = (opts: PillarSDKEmbedOptions) => {
  const params = new URLSearchParams({
    publicKey: opts.publicKey,
    ...toStringValues(opts.embed),
  });
  return `${opts.baseURL}/member/${
    opts.organizationName
  }/embed?${params.toString()}`;
};

const renderIframe = (element: HTMLDivElement, opts: PillarSDKEmbedOptions) => {
  const url = buildEmbedURL(opts);

  const iframe = document.createElement("iframe");
  iframe.src = url;

  const furtherOptions = opts.iframeOptions ?? {};

  Object.keys(furtherOptions).forEach((k) => {
    // @ts-expect-error
    iframe[k] = furtherOptions[k];
  });

  element.insertAdjacentElement("afterbegin", iframe);
};

const PillarSDK = {
  frameEventsConsumer: new FrameEventsConsumer(),
  render: (elementId: string, opts: PillarSDKEmbedOptions) => {
    const element = document.querySelector(elementId) as HTMLDivElement | null;
    if (!element) {
      console.log(`pillar-sdk: Impossible to find ${elementId}. Aborted`);
      return;
    }
    renderIframe(element, opts);
  },
  onEvent(listener: BaseFrameEventListener) {
    PillarSDK.frameEventsConsumer.setup(listener);
  },
};

(window as any).PillarSDK = PillarSDK;
