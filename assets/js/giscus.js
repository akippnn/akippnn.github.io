class Giscus {

  constructor() {
    this.dark = {
      setConfig: {
        theme: "noborder_dark",
      },
    };
    this.light = {
      setConfig: {
        theme: "noborder_light",
      },
    };

  };

  giscusSendMessage(message) {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) return;
    iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
  };
}