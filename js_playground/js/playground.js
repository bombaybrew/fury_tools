require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs' } });
require(["vs/editor/editor.main"], () => {


    editor = monaco.editor.create(document.getElementById('monaco-editor-container'), {
        value: `a = 2 + 2; a`,
        language: 'javascript',
        theme: 'vs-dark',
    });

    function evaluateCode() {
        getVal = editor.getValue()
        // get the value of the data
        return getVal
    }
    document.getElementById('evaluate').onclick = displayResult;

    function displayResult() {
        console.log("indisplay result", evaluateCode())
        document.getElementById('result').value = eval(String(evaluateCode()))
    }
});