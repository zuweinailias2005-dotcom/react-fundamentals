# Catalog Import Module

## About

This project is a simple catalog import module built using Node.js.

It reads product data from an Excel file and product images from a ZIP file. Then it matches the images with the correct products using Design Number and Color. Finally, it creates two output files:

- catalog.json
- import_report.json



## Project Structure


catalog-import/
│
├── input/
│   ├── sample_catalog_import_updated.xlsx
│   └── sample_catalog_images.zip
│
├── output/
│   ├── catalog.json
│   └── import_report.json
│
├── extracted_images/
│
├── services/
│   ├── excelParser.js
│   ├── zipExtractor.js
│   ├── imageScanner.js
│   ├── catalogBuilder.js
│   └── reportBuilder.js
│
├── index.js
├── package.json
└── README.md




## How I Built This Project

I divided the project into different files so that each file has one responsibility.

- **excelParser.js** reads the Excel file.
- **zipExtractor.js** extracts the ZIP file.
- **imageScanner.js** scans all image folders.
- **catalogBuilder.js** creates the final catalog.
- **reportBuilder.js** creates the import report.

This made the code easier to understand and manage.



## My Approach

The project works in these steps:

1. Read the Excel file.
2. Extract the ZIP file.
3. Scan all image folders.
4. Match images using Design Number and Color.
5. Group products by Design Number.
6. Group colors under each product.
7. Group all size variants under each color.
8. Generate `catalog.json`.
9. Generate `import_report.json`.



## Assumptions

- Every Design Number represents one product.
- Images are stored inside folders using Design Number and Color.
- HEIC image files are included as they are.
- The Excel file contains the correct column names.



## Edge Cases Considered

- Missing required fields
- Missing image folders
- Duplicate barcodes
- Empty Excel file
- Empty image folders
- Multiple colors for one product
- Multiple sizes for one product


## Output Files

### catalog.json

This file contains:

- Product details
- Colors
- Images
- Variants

### import_report.json

This file contains:

- Missing required fields
- Missing image folders
- Duplicate barcodes
- Unmatched images
- Warnings



## Technologies Used

- Node.js
- JavaScript (ES Modules)
- xlsx
- adm-zip



## How to Run

Install all dependencies:

-- bash
npm install


Run the project:

-- bash
node index.js

The output files will be created inside the **output** folder.



