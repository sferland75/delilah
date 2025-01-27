"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatROM = formatROM;
exports.formatBrief = formatBrief;
exports.formatStandard = formatStandard;
exports.formatDetailed = formatDetailed;
function formatROM(data, level = 'standard') {
    switch (level) {
        case 'brief':
            return formatBrief(data);
        case 'detailed':
            return formatDetailed(data);
        default:
            return formatStandard(data);
    }
}
function formatBrief(data) {
    const sections = ['Range of Motion Summary'];
    // Add key findings
    const findings = [];
    if (data.patterns.unilateral.length > 0) {
        findings.push(...data.patterns.unilateral.map(p => `Asymmetrical ${p.joint} ${p.movement} (${p.difference}° difference)`));
    }
    if (data.patterns.restricted.length > 0) {
        findings.push(...data.patterns.restricted.map(p => `${p.joint} ${p.movement} restricted`));
    }
    if (data.patterns.painful.length > 0) {
        findings.push(...data.patterns.painful.map(p => `${p.joint} ${p.movement} painful`));
    }
    if (findings.length > 0) {
        sections.push('\nKey Findings:');
        findings.forEach(f => sections.push(`- ${f}`));
    }
    if (data.impact.length > 0) {
        sections.push('\nPrimary Functional Impacts:');
        data.impact.forEach(impact => sections.push(`- ${impact}`));
    }
    return sections.join('\n');
}
function formatStandard(data) {
    const sections = ['Range of Motion Assessment'];
    sections.push('\nMovement Patterns:');
    // Movement Patterns - Unilateral
    if (data.patterns.unilateral.length > 0) {
        sections.push('\nAsymmetrical Movements:');
        data.patterns.unilateral.forEach(p => {
            sections.push(`- ${p.joint} ${p.movement} (${p.difference}° difference on ${p.side} side)`);
        });
    }
    // Movement Patterns - Painful
    if (data.patterns.painful.length > 0) {
        sections.push('\nPainful Movements:');
        data.patterns.painful.forEach(p => {
            sections.push(`- ${p.joint} ${p.movement} (${p.intensity}/10 pain)`);
        });
    }
    // Movement Patterns - Restricted
    if (data.patterns.restricted.length > 0) {
        sections.push('\nRestricted Movements:');
        data.patterns.restricted.forEach(p => {
            sections.push(`- ${p.joint} ${p.movement}: ${p.description}`);
        });
    }
    if (data.impact.length > 0) {
        sections.push('\nFunctional Impact:');
        data.impact.forEach(impact => sections.push(`- ${impact}`));
    }
    return sections.join('\n');
}
function formatDetailed(data) {
    const sections = ['Comprehensive Range of Motion Assessment'];
    // Joint measurements
    if (Object.keys(data.joints).length > 0) {
        sections.push('\nJoint Measurements:');
        Object.entries(data.joints).forEach(([joint, measurements]) => {
            if (!measurements?.length)
                return;
            sections.push(`\n${joint}:`);
            measurements.forEach(rom => {
                sections.push(`  ${rom.movement}:`);
                if (rom.active) {
                    sections.push(`    Active: R: ${rom.active.right || 'NT'}°, L: ${rom.active.left || 'NT'}°`);
                    if (rom.active.normal) {
                        sections.push(`    Normal: ${rom.active.normal}°`);
                    }
                }
                if (rom.passive) {
                    sections.push(`    Passive: R: ${rom.passive.right || 'NT'}°, L: ${rom.passive.left || 'NT'}°`);
                }
                if (rom.painScale) {
                    sections.push(`    Pain: R: ${rom.painScale.right || 0}/10, L: ${rom.painScale.left || 0}/10`);
                }
                if (rom.endFeel) {
                    sections.push(`    End Feel: R: ${rom.endFeel.right || 'NT'}, L: ${rom.endFeel.left || 'NT'}`);
                }
            });
        });
    }
    // Movement patterns
    sections.push('\nMovement Patterns:');
    if (data.patterns.bilateral.length > 0) {
        sections.push('\n  Bilateral Restrictions:');
        data.patterns.bilateral.forEach(p => {
            sections.push(`  - ${p.joint} ${p.movement}: ${p.description}`);
        });
    }
    if (data.patterns.unilateral.length > 0) {
        sections.push('\n  Asymmetrical Movements:');
        data.patterns.unilateral.forEach(p => {
            sections.push(`  - ${p.joint} ${p.movement} (${p.side}): ${p.difference}° difference`);
        });
    }
    if (data.patterns.painful.length > 0) {
        sections.push('\n  Painful Movements:');
        data.patterns.painful.forEach(p => {
            sections.push(`  - ${p.joint} ${p.movement}: ${p.intensity}/10 pain (${p.side} side)`);
        });
    }
    if (data.patterns.restricted.length > 0) {
        sections.push('\n  Restricted Movements:');
        data.patterns.restricted.forEach(p => {
            sections.push(`  - ${p.joint} ${p.movement}: ${p.description}`);
        });
    }
    // Functional analysis
    sections.push('\nFunctional Analysis:');
    if (data.functional.upperExtremity.length > 0) {
        sections.push('\n  Upper Extremity Impact:');
        data.functional.upperExtremity.forEach(impact => {
            sections.push(`  - ${impact}`);
        });
    }
    if (data.functional.lowerExtremity.length > 0) {
        sections.push('\n  Lower Extremity Impact:');
        data.functional.lowerExtremity.forEach(impact => {
            sections.push(`  - ${impact}`);
        });
    }
    if (data.functional.spine.length > 0) {
        sections.push('\n  Spine Function Impact:');
        data.functional.spine.forEach(impact => {
            sections.push(`  - ${impact}`);
        });
    }
    if (data.impact.length > 0) {
        sections.push('\nOverall Clinical Impact:');
        data.impact.forEach(impact => {
            sections.push(`- ${impact}`);
        });
    }
    return sections.join('\n');
}
