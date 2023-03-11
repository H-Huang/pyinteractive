import { useState, useEffect, useRef } from 'react';
import Editor, { EditorProps, useMonaco, Monaco } from "@monaco-editor/react";
import { Grid, Paper, Typography, styled } from '@mui/material';
import React from 'react';



function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number): T {
    const [timeoutId, setTimeoutId] = useState<number | null>(null);

    function debounceCallback(...args: any[]) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setTimeoutId(setTimeout(() => {
            callback(...args);
        }, delay));
    }

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return debounceCallback as T;
}

const Wrapper = styled('div')(({ theme }) => ({
    // flexGrow: 1,
    height: '90vh',
}));

function CodeSpace(props: any) {
    console.log(props);
    const script = props.script
    // set default value
    let currentValue: string = `# Type any python code here
print('Hello World!')
x = 1
y = 2
print(f"x + y = {x + y}")`
    if (script) {
        currentValue = script.contents
    }


    // const monaco = useMonaco();

    // const editorRef = useRef(null);
    function handleEditorDidMount(editor: any, monaco: Monaco) {
        console.log("in did mount")
        console.log(editor.value)
    }
    // if (script) {
    //     console.log("in here: " + script.contents)
    //     editorRef.value = script.contents
    // }
  
    // useEffect(() => {
    //   if (monaco) {
    //     console.log("here is the monaco instance:", monaco);
    //   }
    // }, [monaco]);

    const [pyodide, setPyodide] = useState<any>(null);


    async function initialize(): Promise<any> {
        // define a custom output handler
        const outputHandler = (text: String) => {
            // handle the output text here
            console.log(text);
            setStdOut((prevStdOut) => {
                return prevStdOut + text + "\r\n"
            });
        };

        const pyodide = await window.loadPyodide();
        console.log(pyodide)
        await pyodide.loadPackage("micropip");
        const micropip = pyodide.pyimport("micropip");
        await micropip.install('numpy');
        // const scripts = await loadScripts();
        // console.log(scripts)
        pyodide.setStdout({batched: outputHandler});
        return pyodide;
      }

    useEffect(() => {
        console.log("effect")
        initialize().then((pyodide) => {
            setPyodide(pyodide);
        });
        
      }, []);
    
    const [stdOut, setStdOut] = useState<string>('');

    function handleEditorChange(value: string | undefined, event: any) {
        setStdOut('');
        console.log("running")
        pyodide.runPython(value);
    }

    const debouncedHandleEditorChange = useDebounce(handleEditorChange, 1000);

    return (
        <Wrapper>
            <Grid container spacing={3}
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start">
                <Grid item xs={12} sm={7}>
                    <Editor
                        height="80vh"
                        defaultLanguage="python"
                        value={currentValue}
                        onChange={(value, event) => {
                            debouncedHandleEditorChange(value, event)
                        }}
                        onMount={handleEditorDidMount}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <OutputDisplay output={stdOut} />
                </Grid>
            </Grid>
        </Wrapper>
    );
}

const OutputDisplay = React.memo(({ output }: { output: string }) => {
    return (
        <pre>{output}</pre>
    );
  });

export default CodeSpace;
