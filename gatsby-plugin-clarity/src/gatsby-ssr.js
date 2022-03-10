import React from "react";

export const onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const { delayLoad, delayLoadTime, clarity_project_id, enable_on_dev_env } = pluginOptions;
  let enabledOnDev = enable_on_dev_env === false ? false : true;
  if (!clarity_project_id) return;

  const snippet = `
    const loadClarity = function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=gatsby";
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    };
    ${!delayLoad ? `loadClarity(window, document, "clarity", "script", "${pluginOptions.clarity_project_id}")` : ``}
  `;

  const delayedLoader = `
    window.claritySnippetLoaded = false;
    window.claritySnippetLoading = false;

    window.claritySnippetLoader = function (callback) {
      if (!window.claritySnippetLoaded && !window.claritySnippetLoading) {
        window.claritySnippetLoading = true;

        function loader() {
          loadClarity(window, document, "clarity", "script", "${pluginOptions.clarity_project_id}")
          window.claritySnippetLoading = false;
          window.claritySnippetLoaded = true;
          if (callback) { callback() }
        }

        setTimeout(
          function () {
            "requestIdleCallback" in window
              ? requestIdleCallback(function () { loader() })
              : loader();
          },
          ${delayLoadTime} || 1000
        )
      }
    }
    window.addEventListener('scroll', function() { window.claritySnippetLoader() }, { once: true };)
  `;

  // if delayLoad option is true, use the delayed loader
  const snippetToUse = `
    ${snippet}
    ${delayLoad ? delayedLoader : ''}
  `;

  // only render snippet if enable for dev or production environment
  if (enabledOnDev || process.env.NODE_ENV === `production`) {
    return setHeadComponents([
      <script
        key={`gatsby-plugin-clarity`}
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: snippetToUse,
        }}
      />,
    ]);
  }

  return null;
};
