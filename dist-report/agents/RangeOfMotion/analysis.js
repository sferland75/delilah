"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processROM = processROM;
function processROM(joints) {
    const patterns = {
        bilateral: [],
        unilateral: [],
        painful: [],
        restricted: []
    };
    const functional = {
        upperExtremity: [],
        lowerExtremity: [],
        spine: []
    };
    const impact = [];
    Object.entries(joints).forEach(([joint, measurements]) => {
        measurements.forEach(rom => {
            // Check for restricted movement
            if (rom.active?.normal && rom.active.right && rom.active.right < rom.active.normal * 0.7) {
                patterns.restricted.push({
                    joint,
                    movement: rom.movement,
                    description: 'significantly restricted'
                });
            }
            // Check for asymmetry
            if (rom.active?.right && rom.active?.left) {
                const difference = Math.abs(rom.active.right - rom.active.left);
                const averageROM = (rom.active.right + rom.active.left) / 2;
                if (difference > averageROM * 0.2) {
                    patterns.unilateral.push({
                        joint,
                        movement: rom.movement,
                        side: rom.active.right > rom.active.left ? 'right' : 'left',
                        difference: Math.round(difference)
                    });
                }
            }
            // Check for pain
            if (rom.painScale?.right && rom.painScale.right > 3) {
                patterns.painful.push({
                    joint,
                    movement: rom.movement,
                    side: 'right',
                    intensity: rom.painScale.right
                });
            }
            if (rom.painScale?.left && rom.painScale.left > 3) {
                patterns.painful.push({
                    joint,
                    movement: rom.movement,
                    side: 'left',
                    intensity: rom.painScale.left
                });
            }
        });
    });
    // Analyze functional impacts
    if (patterns.unilateral.some(p => ['shoulder', 'elbow', 'wrist'].includes(p.joint.toLowerCase()))) {
        functional.upperExtremity.push('Asymmetrical upper extremity movement patterns');
    }
    if (patterns.unilateral.some(p => ['hip', 'knee', 'ankle'].includes(p.joint.toLowerCase()))) {
        functional.lowerExtremity.push('Asymmetrical lower extremity movement patterns');
    }
    if (patterns.painful.length > 0) {
        impact.push('Pain limits functional movement');
    }
    if (patterns.restricted.length > 0) {
        impact.push('ROM restrictions affect functional activities');
    }
    return {
        joints,
        patterns,
        functional,
        impact
    };
}
