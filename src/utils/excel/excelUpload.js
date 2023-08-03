import React from 'react';

function ExcelUpload({ onFileUpload }) {
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        onFileUpload(file);
    };

    return <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />;
}

export default ExcelUpload;
