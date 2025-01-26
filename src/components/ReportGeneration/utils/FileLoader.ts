export async function loadAssessmentData(filename: string): Promise<any> {
    try {
        const response = await window.fs.readFile(filename, { encoding: 'utf8' });
        return JSON.parse(response);
    } catch (error) {
        console.error('Error loading assessment data:', error);
        throw error;
    }
}