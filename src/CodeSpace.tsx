import { useState, useEffect } from 'react';
import Editor, { EditorProps } from "@monaco-editor/react";
import { pyodide } from './main';
import { Grid, Paper, Typography, styled } from '@mui/material';
import React from 'react';


function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number): T {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

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

function CodeSpace() {
    console.log("render")
    const [output, setOutput] = useState<string>(''); // Define state for the output box
    const [stdOut, setStdOut] = useState<string>('');

    // define a custom output handler
    const outputHandler = (text: String) => {
        // handle the output text here
        console.log(text);
        setStdOut((prevStdOut) => {
            return prevStdOut + text + "\r\n"
        });
    };
    // redirect Python's stdout to the custom output handler
    pyodide.setStdout({batched: outputHandler});

    // Run these only once
    useEffect(() => {
        // define a custom output handler
        const outputHandler = (text: String) => {
            // handle the output text here
            console.log(text);
            setStdOut((prevStdOut) => {
                return prevStdOut + text + "\r\n"
            });
        };
        // redirect Python's stdout to the custom output handler
        pyodide.setStdout({batched: outputHandler});
      }, []);

    function handleEditorChange(value: string, event: any) {
        setStdOut("")
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
                        defaultValue="# comment
print('Hello World!')
x=1"

                        onChange={(value, event) => {
                            debouncedHandleEditorChange(value, event)
                        }}
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
