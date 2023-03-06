class Script {
  path: string;
  contents: string;

  constructor(path: string) {
    this.path = path;
    this.contents = "";
  }
}

const scriptList: Script[] = [
  new Script("./example.py")
];

async function loadScripts() {
  await Promise.all(
    scriptList.map(async (script) => {
      console.log("in here")
      const imgUrl = new URL(script.path, import.meta.url).href
      console.log(imgUrl)
      const response = await fetch(imgUrl);
      console.log(response)
      script.contents = await response.text();
      return script;
    })
  );
  return scriptList;
}

export default loadScripts;