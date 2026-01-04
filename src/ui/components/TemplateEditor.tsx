import React, { useState } from 'react';

const TemplateEditor = ({ onSave, initialTemplate }) => {
    const [template, setTemplate] = useState(initialTemplate || { title: '', fields: [] });

    const handleFieldChange = (index, value) => {
        const updatedFields = [...template.fields];
        updatedFields[index] = value;
        setTemplate({ ...template, fields: updatedFields });
    };

    const handleTitleChange = (event) => {
        setTemplate({ ...template, title: event.target.value });
    };

    const handleSave = () => {
        onSave(template);
    };

    return (
        <div className="template-editor">
            <h2>Edit Template</h2>
            <input
                type="text"
                value={template.title}
                onChange={handleTitleChange}
                placeholder="Template Title"
            />
            <div className="fields">
                {template.fields.map((field, index) => (
                    <div key={index} className="field">
                        <input
                            type="text"
                            value={field}
                            onChange={(e) => handleFieldChange(index, e.target.value)}
                            placeholder={`Field ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
            <button onClick={handleSave}>Save Template</button>
        </div>
    );
};

export default TemplateEditor;