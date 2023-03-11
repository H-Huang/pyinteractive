// Add URL to this list for it to be recognized
// by the app
// TODO: find if there is an easier way to do this
const allUrls: URL[] = [
  new URL("../public/py_scripts/example.py", import.meta.url)
]

class Script {
  path: string;
  contents: string;

  constructor(path: string, contents: string) {
    this.path = path;
    this.contents = contents;
  }
}

async function loadScripts() {
  const scriptList: Script[] = [];

  await Promise.all(
    allUrls.map(async (scriptUrl) => {
      console.log("in here")
      const response = await fetch(scriptUrl);
      console.log(response)
      let scriptName: string = scriptUrl.pathname.split("/").pop() ?? "";

      scriptList.push(new Script(scriptName, await response.text()));
    })
  );
  return scriptList;
}

export { Script, loadScripts };