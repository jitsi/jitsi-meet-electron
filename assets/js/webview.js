
onload = () => {
  doLayout();
};

function doLayout() {
    const urlParams = new URLSearchParams(window.location.search);
    const called = urlParams.get('called');
    const password = urlParams.get('p');
    console.log(called)
    webview.src = "https://v2.assemblee.io/join-app?called=" + called + "&p=" + password;
}
