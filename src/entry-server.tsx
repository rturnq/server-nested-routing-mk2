import { renderToStream } from "solid-js/web";
import { createHandler, StartProvider } from "solid-start/components";
import Root from "~/root";

function renderPage() {
  return async ({
    request,
    manifest,
    headers,
    context = {},
  }: {
    request: Request;
    headers: Response["headers"];
    manifest: Record<string, any>;
    context?: Record<string, any>;
  }) => {
    const url = new URL(request.url);
    const path = url.pathname + url.search;
    const prevPath = request.headers.get("x-solid-referrer");
    const routerContext: any = {};
    const { readable, writable } = new TransformStream();
    const { pipeTo } = renderToStream(() => (
      <StartProvider context={context} manifest={manifest}>
        <Root url={path} prevUrl={prevPath || ""} context={routerContext} />
      </StartProvider>
    ));

    if (routerContext.replaceOutletId) {
      const writer = writable.getWriter();
      const encoder = new TextEncoder();
      writer.write(
        encoder.encode(`${routerContext.replaceOutletId}:${routerContext.newOutletId}=`)
      );
      writer.releaseLock();
      headers.set("Content-Type", "text/plain");
    } else {
      headers.set("Content-Type", "text/html");
    }
    pipeTo(writable);

    return new Response(readable, {
      status: 200,
      headers,
    });
  };
}

export default createHandler(renderPage);
