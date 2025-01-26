export class ReportFormatter {
    formatSection(title: string, content: any): string {
        const sections = [
            this.formatTitle(title),
            this.formatContent(content),
            ''  // Add blank line after each section
        ];

        return sections.join('\n');
    }

    private formatTitle(title: string): string {
        const line = '='.repeat(title.length);
        return `${title}\n${line}`;
    }

    private formatContent(content: any): string {
        if (typeof content === 'string') {
            return content;
        }

        if (Array.isArray(content)) {
            return content.join('\n');
        }

        if (typeof content === 'object') {
            return JSON.stringify(content, null, 2);
        }

        return String(content);
    }
}