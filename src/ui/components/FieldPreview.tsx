import React from 'react';

interface FieldPreviewProps {
    template: {
        title: string;
        imageUrl?: string;
        content: string;
    };
    data: {
        [key: string]: any;
    };
}

const FieldPreview: React.FC<FieldPreviewProps> = ({ template, data }) => {
    const renderContent = () => {
        return Object.keys(data).map((key) => (
            <div key={key}>
                <strong>{key}:</strong> {data[key]}
            </div>
        ));
    };

    return (
        <div className="field-preview">
            <h2>{template.title}</h2>
            {template.imageUrl && <img src={template.imageUrl} alt={template.title} />}
            <div className="template-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default FieldPreview;