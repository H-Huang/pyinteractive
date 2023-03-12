// Add file name to this list for it to be recognized
// by the app
const scriptNames: string[] = [
  "numpy_example.py",
  "pandas_example.py",
];

const allUrls: URL[] = scriptNames.map((scriptName) => {
  return new URL(`./${scriptName}`, import.meta.url);
});

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
    allUrls.map(async (scriptUrl, index) => {
      console.log("in here")
      const response = await fetch(scriptUrl);
      console.log(scriptUrl)
      console.log(response)
      let scriptName: string = scriptNames[index];

      scriptList.push(new Script(scriptName, await response.text()));
    })
  );
  return scriptList;
}

export { Script, loadScripts };