class ReportFormatter {
    formatSection(title, content) {
        const sections = [
            this.formatTitle(title),
            this.formatContent(content),
            '' // Add blank line after each section
        ];

        return sections.join('\n');
    }

    formatTitle(title) {
        return title.toUpperCase() + '\n' + '='.repeat(title.length);
    }

    formatContent(content) {
        if (typeof content === 'string') {
            return this.wrapText(content, 80); // Wrap at 80 characters
        }

        if (Array.isArray(content)) {
            return content.map(item => this.wrapText(item, 80)).join('\n\n');
        }

        if (typeof content === 'object') {
            return this.formatObject(content);
        }

        return String(content);
    }

    formatObject(obj) {
        if (!obj) return '';

        // Special handling for client information
        if (obj.name && obj.dateOfBirth) {
            return this.formatClientInfo(obj);
        }

        const lines = [];
        for (const [key, value] of Object.entries(obj)) {
            const formattedKey = this.formatKey(key);
            if (typeof value === 'object' && value !== null) {
                lines.push(formattedKey + ':');
                lines.push(this.formatObject(value).split('\n').map(line => '    ' + line).join('\n'));
            } else {
                lines.push(`${formattedKey}: ${value}`);
            }
        }
        return lines.join('\n');
    }

    formatClientInfo(info) {
        const lines = [
            `Name:               ${info.name}`,
            `Date of Birth:      ${info.dateOfBirth}`,
            `Gender:            ${info.gender}`,
            '',
            'CONTACT INFORMATION',
            '-' + '-'.repeat(19),
            `Address:           ${info.address}`,
            `Phone:             ${info.phone}`,
            `Email:             ${info.email}`,
            '',
            'EMERGENCY CONTACT',
            '-' + '-'.repeat(16)
        ];

        if (info.emergencyContact) {
            const ec = info.emergencyContact;
            lines.push(
                `Name:              ${ec.name}`,
                `Relationship:      ${ec.relationship}`,
                `Phone:             ${ec.phone}`
            );
        } else {
            lines.push('No emergency contact provided');
        }

        return lines.join('\n');
    }

    formatKey(key) {
        // Convert camelCase to Title Case
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    wrapText(text, width) {
        if (!text) return '';
        
        const words = text.split(' ');
        const lines = [];
        let currentLine = [];
        let currentLength = 0;

        words.forEach(word => {
            if (currentLength + word.length + 1 <= width) {
                currentLine.push(word);
                currentLength += word.length + 1;
            } else {
                lines.push(currentLine.join(' '));
                currentLine = [word];
                currentLength = word.length;
            }
        });

        if (currentLine.length > 0) {
            lines.push(currentLine.join(' '));
        }

        return lines.join('\n');
    }
}

// Ensure we're exporting the class properly
module.exports = ReportFormatter;