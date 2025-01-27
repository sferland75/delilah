"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypicalDayAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
const lodash_1 = __importDefault(require("lodash"));
class TypicalDayAgent extends BaseAgent_1.BaseAgent {
    constructor(context) {
        super(context, 4.0, 'Typical Day', ['typicalDay']);
    }
    async processData(data) {
        try {
            const typicalDay = lodash_1.default.get(data, 'typicalDay.current', {});
            const daily = typicalDay.daily || {};
            // Calculate sleep hours if available
            let sleepHours;
            if (daily.sleepSchedule?.wakeTime && daily.sleepSchedule?.bedTime) {
                const wake = this.parseTime(daily.sleepSchedule.wakeTime);
                const bed = this.parseTime(daily.sleepSchedule.bedTime);
                sleepHours = this.calculateSleepHours(wake, bed);
            }
            // Analyze activity patterns
            const routines = daily.routines || {};
            const analysis = {
                sleepHours,
                activityLevels: {
                    morning: this.analyzeActivityLevel(routines.morning?.activities),
                    afternoon: this.analyzeActivityLevel(routines.afternoon?.activities),
                    evening: this.analyzeActivityLevel(routines.evening?.activities)
                },
                restPeriods: this.identifyRestPeriods(routines),
                challenges: this.identifyChallenges(routines)
            };
            return {
                valid: true,
                current: { daily },
                analysis
            };
        }
        catch (error) {
            return {
                valid: false,
                current: {}
            };
        }
    }
    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes || 0, 0, 0);
        return date;
    }
    calculateSleepHours(wakeTime, bedTime) {
        let hours = (wakeTime.getTime() - bedTime.getTime()) / (1000 * 60 * 60);
        if (hours < 0) {
            hours += 24;
        }
        return Math.abs(hours);
    }
    analyzeActivityLevel(activities) {
        if (!activities)
            return 'Unknown';
        const lowActivityKeywords = ['rest', 'sit', 'watch', 'tv', 'nap'];
        const moderateActivityKeywords = ['walk', 'prepare', 'cook', 'clean'];
        const activityLower = activities.toLowerCase();
        const lowCount = lowActivityKeywords.filter(word => activityLower.includes(word)).length;
        const modCount = moderateActivityKeywords.filter(word => activityLower.includes(word)).length;
        if (lowCount > modCount)
            return 'Low';
        if (modCount > lowCount)
            return 'Moderate';
        return 'Mixed';
    }
    identifyRestPeriods(routines) {
        const restPeriods = [];
        Object.entries(routines).forEach(([period, data]) => {
            if (data?.activities?.toLowerCase().includes('rest') ||
                data?.activities?.toLowerCase().includes('nap')) {
                restPeriods.push(period);
            }
        });
        return restPeriods;
    }
    identifyChallenges(routines) {
        const challenges = [];
        Object.entries(routines).forEach(([period, data]) => {
            const activities = data?.activities?.toLowerCase() || '';
            if (activities.includes('tired') || activities.includes('sore')) {
                challenges.push(`Fatigue/pain noted during ${period}`);
            }
        });
        return challenges;
    }
    formatBrief(data) {
        const sections = ['Current Daily Schedule Summary'];
        if (data.current.daily?.sleepSchedule) {
            const schedule = data.current.daily.sleepSchedule;
            sections.push(`\nSleep Schedule: ${schedule.wakeTime || 'N/A'} to ${schedule.bedTime || 'N/A'}`);
        }
        if (data.analysis?.challenges?.length) {
            sections.push('\nKey Challenges:');
            data.analysis.challenges.forEach(challenge => {
                sections.push(`- ${challenge}`);
            });
        }
        return sections.join('\n');
    }
    formatStandard(data) {
        const sections = ['Current Daily Schedule'];
        // Sleep Schedule
        if (data.current.daily?.sleepSchedule) {
            const schedule = data.current.daily.sleepSchedule;
            sections.push('\nSleep Schedule:');
            sections.push(`- Wake Time: ${schedule.wakeTime || 'N/A'}`);
            sections.push(`- Bed Time: ${schedule.bedTime || 'N/A'}`);
            if (data.analysis?.sleepHours) {
                sections.push(`- Total Sleep Hours: ${data.analysis.sleepHours.toFixed(1)}`);
            }
        }
        // Daily Routines
        const routines = data.current.daily?.routines || {};
        ['morning', 'afternoon', 'evening'].forEach(period => {
            if (routines[period]?.activities) {
                sections.push(`\n${period.charAt(0).toUpperCase() + period.slice(1)} Routine:`);
                sections.push(routines[period].activities.split('\n').map(a => `- ${a}`).join('\n'));
            }
        });
        // Analysis
        if (data.analysis?.challenges?.length) {
            sections.push('\nChallenges:');
            data.analysis.challenges.forEach(challenge => {
                sections.push(`- ${challenge}`);
            });
        }
        return sections.join('\n');
    }
    formatDetailed(data) {
        const sections = ['Current Daily Schedule Analysis'];
        // Sleep Pattern
        sections.push('\nSleep Pattern:');
        if (data.current.daily?.sleepSchedule) {
            const schedule = data.current.daily.sleepSchedule;
            sections.push(`- Wake Time: ${schedule.wakeTime || 'N/A'}`);
            sections.push(`- Bed Time: ${schedule.bedTime || 'N/A'}`);
            if (data.analysis?.sleepHours) {
                sections.push(`- Total Sleep Hours: ${data.analysis.sleepHours.toFixed(1)}`);
            }
        }
        // Daily Routines with Activity Levels
        const routines = data.current.daily?.routines || {};
        ['morning', 'afternoon', 'evening'].forEach(period => {
            if (routines[period]?.activities) {
                sections.push(`\n${period.charAt(0).toUpperCase() + period.slice(1)} Activities:`);
                sections.push(routines[period].activities.split('\n').map(a => `- ${a}`).join('\n'));
                if (data.analysis?.activityLevels?.[period]) {
                    sections.push(`Activity Level: ${data.analysis.activityLevels[period]}`);
                }
            }
        });
        // Rest Periods
        if (data.analysis?.restPeriods?.length) {
            sections.push('\nScheduled Rest Periods:');
            data.analysis.restPeriods.forEach(period => {
                sections.push(`- ${period}`);
            });
        }
        // Challenges and Patterns
        if (data.analysis?.challenges?.length) {
            sections.push('\nIdentified Challenges:');
            data.analysis.challenges.forEach(challenge => {
                sections.push(`- ${challenge}`);
            });
        }
        return sections.join('\n');
    }
}
exports.TypicalDayAgent = TypicalDayAgent;
