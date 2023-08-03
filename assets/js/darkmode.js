const userPref = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
const currentTheme = localStorage.getItem('theme') ?? userPref
const syntaxTheme = document.querySelector("#theme-link");

{{ $darkSyntax := resources.Get "styles/_dark_syntax.scss" | resources.ToCSS (dict "outputStyle" "compressed") | resources.Fingerprint "md5" | resources.Minify  }}
{{ $lightSyntax := resources.Get "styles/_light_syntax.scss" | resources.ToCSS (dict "outputStyle" "compressed") | resources.Fingerprint "md5" | resources.Minify  }}

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

  const observer = new MutationObserver(mutations => {
    if (document.querySelector(selector)) {
    resolve(document.querySelector(selector));
    observer.disconnect();
    }
  });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

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
    const selector = 'iframe.giscus-frame';
    if (!document.querySelector(selector)) {
      waitForElm(selector).then((elm) => {
        console.log('Element is ready');
        console.log(elm.textContent);
      });
    }
    const iframe = document.querySelector(selector);
    if (!iframe) { console.error("Giscus: iframe could not be found"); return; }
    iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
  };
}

function setTheme(theme) {
  if (theme !== 'dark' && theme !== 'light') { console.log(`Not a theme: ${theme}`); return; }
  document.documentElement.setAttribute('saved-theme', theme);
  if (theme === 'dark') {
    syntaxTheme.href = '{{ $darkSyntax.Permalink }}';
    giscusInterface.giscusSendMessage(giscusInterface.dark);
  } else {
    syntaxTheme.href = '{{ $lightSyntax.Permalink }}';
    giscusInterface.giscusSendMessage(giscusInterface.light);
  }
}

const giscusInterface = new Giscus();

if (currentTheme) {
  setTheme(currentTheme);
}

const switchTheme = (e) => {
  if (e.target.checked) {
    localStorage.setItem('theme', 'dark');
    setTheme('dark');
  }
  else {
    localStorage.setItem('theme', 'light');
    setTheme('light');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Darkmode toggle
  const toggleSwitch = document.querySelector('#darkmode-toggle')

  // listen for toggle
  toggleSwitch.addEventListener('change', switchTheme, false)

  if (currentTheme === 'dark') {
    toggleSwitch.checked = true
  }
})
