/**
 * Exports data to a CSV file and triggers download.
 * @param data Array of objects to export
 * @param filename Name of the file (e.g., 'transactions.csv')
 */
export const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    // Get headers from first object keys
    const headers = Object.keys(data[0]);

    // Create CSV rows
    const csvRows = [
        headers.join(','), // Header row
        ...data.map(row =>
            headers.map(fieldName => {
                let value = row[fieldName];

                // Handle objects/arrays (convert to string)
                if (typeof value === 'object' && value !== null) {
                    value = JSON.stringify(value);
                }

                // Handle strings with commas (wrap in quotes)
                const stringValue = String(value).replace(/"/g, '""');
                return `"${stringValue}"`;
            }).join(',')
        )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
