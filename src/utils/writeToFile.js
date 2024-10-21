export async function writeToFile(workbook,fileName='aa444sd') {
    return workbook.outputAsync()
        .then(workbookBlob => {
            const url = window.URL.createObjectURL(workbookBlob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
}
