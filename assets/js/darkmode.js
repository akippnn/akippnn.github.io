const userPref = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
const currentTheme = localStorage.getItem('theme') ?? userPref;
const syntaxTheme = document.querySelector("#theme-link");

const giscusDark = {
  setConfig: {
    theme: "noborder_dark",
  },
};
const giscusLight = {
  setConfig: {
    theme: "noborder_light",
  },
};

function giscusSendMessage(message) {
  const iframe = document.querySelector('iframe.giscus-frame');
  if (!iframe) return;
  iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
}

{{ $darkSyntax := resources.Get "styles/_dark_syntax.scss" | resources.ToCSS (dict "outputStyle" "compressed") | resources.Fingerprint "md5" | resources.Minify  }}
{{ $lightSyntax := resources.Get "styles/_light_syntax.scss" | resources.ToCSS (dict "outputStyle" "compressed") | resources.Fingerprint "md5" | resources.Minify  }}

if (currentTheme) {
  giscusSendMessage(currentTheme === 'dark' ? giscusDark : giscusLight);
  document.documentElement.setAttribute('saved-theme', currentTheme);
  syntaxTheme.href = currentTheme === 'dark' ?  '{{ $darkSyntax.Permalink }}' :  '{{ $lightSyntax.Permalink }}';
}

const switchTheme = (e) => {
  if (e.target.checked) {
    document.documentElement.setAttribute('saved-theme', 'dark');
    giscusSendMessage(giscusDark);
    localStorage.setItem('theme', 'dark');
    syntaxTheme.href = '{{ $darkSyntax.Permalink }}';
  }
  else {
    document.documentElement.setAttribute('saved-theme', 'light');
    giscusSendMessage(giscusLight);
    localstorage.setitem('theme', 'light');
    syntaxTheme.href = '{{ $lightSyntax.Permalink }}';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Darkmode toggle
  const toggleSwitch = document.querySelector('#darkmode-toggle');

  // listen for toggle
  toggleSwitch.addEventListener('change', switchTheme, false);

  if (currentTheme === 'dark') {
    toggleSwitch.checked = true
  }
})
