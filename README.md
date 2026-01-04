# Feishu Table Plugin

This project is a plugin for Feishu that allows users to apply templates to data fields in a multi-dimensional table. It provides a user-friendly interface for creating, editing, and applying templates in bulk.

## Features

- Create and edit templates for batch application.
- Preview how templates will look when applied to data fields.
- Select from a list of available templates for batch application.
- Interact with the Feishu API to fetch and submit table data.

## Project Structure

```
feishu-table-plugin
├── src
│   ├── manifest.json          # Metadata for the Feishu table plugin
│   ├── index.tsx              # Entry point for the plugin
│   ├── ui
│   │   ├── App.tsx            # Main application component
│   │   ├── components
│   │   │   ├── TemplateEditor.tsx  # Component for creating/editing templates
│   │   │   ├── TemplateList.tsx    # Component for displaying available templates
│   │   │   ├── BatchApplyModal.tsx  # Modal for batch applying templates
│   │   │   └── FieldPreview.tsx     # Component for previewing templates
│   ├── services
│   │   ├── feishuApi.ts       # Functions for interacting with the Feishu API
│   │   └── templateService.ts  # Utility functions for managing templates
│   ├── hooks
│   │   └── useTableData.ts     # Custom hook for managing table data
│   ├── utils
│   │   └── parser.ts           # Utility functions for parsing data
│   ├── types
│   │   └── index.ts            # TypeScript types and interfaces
│   └── styles
│       └── index.css           # CSS styles for the UI components
├── public
│   └── index.html              # HTML template for the plugin's UI
├── package.json                # npm configuration file
├── tsconfig.json               # TypeScript configuration file
├── .eslintrc.js                # ESLint configuration file
├── .prettierrc                 # Prettier configuration file
└── README.md                   # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd feishu-table-plugin
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm start
   ```

2. Open the plugin in Feishu and start creating templates for your data fields.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.