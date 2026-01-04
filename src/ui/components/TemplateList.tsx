import React from 'react';

const TemplateList = ({ templates, onSelectTemplate }) => {
    return (
        <div className="template-list">
            <h2>Available Templates</h2>
            <ul>
                {templates.map((template, index) => (
                    <li key={index} onClick={() => onSelectTemplate(template)}>
                        <h3>{template.title}</h3>
                        {template.image && <img src={template.image} alt={template.title} />}
                        <p>{template.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TemplateList;