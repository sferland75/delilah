import { IndependenceLevel } from './ADLTypes';
import { ProcessedIADLData, IADLData } from './IADLTypes';
import { LEVEL_ORDER, COMMON_ADAPTATIONS } from './types';
import { ensureIndependenceLevel } from './typeUtils';

export function extractBarriers(notes: string): string[] {
  const barriers: string[] = [];
  const notesLower = notes.toLowerCase();

  // Common barrier phrases that indicate the start of a barrier description
  const barrierPhrases = [
    'cannot', 'cant', 'can\'t', 
    'unable to', 
    'difficulty', 'difficult',
    'requires', 'requiring',
    'needs', 'needed',
    'limited', 'limiting',
    'pain', 'painful',
    'fatigue', 'fatigued',
    'balance', 'unbalanced',
    'strength', 'weak',
    'endurance'
  ];

  barrierPhrases.forEach(phrase => {
    const index = notesLower.indexOf(phrase);
    if (index !== -1) {
      // Find the end of the barrier description
      const punctuationMarks = ['.', ',', ';'];
      let end = notesLower.length;
      
      for (const mark of punctuationMarks) {
        const punctIndex = notesLower.indexOf(mark, index);
        if (punctIndex !== -1 && punctIndex < end) {
          end = punctIndex;
        }
      }

      // Extract and clean the barrier text
      let barrier = notesLower.slice(index, end).trim();
      
      // For phrases like "unable to X", "cannot X", etc., we want to keep the whole phrase
      // For other triggers like "pain", we want to construct a more complete phrase
      if (!barrier.startsWith('unable') && !barrier.startsWith('cannot') && !barrier.startsWith('can\'t')) {
        if (barrier.length < 5) { // If it's just the trigger word
          // Look ahead for relevant context
          const contextEnd = Math.min(notes.length, index + 50);
          barrier = notesLower.slice(index, contextEnd).split(/[.,;]|(?=\s(?:and|but|or))/)[0].trim();
        }
      }

      // Clean up any partial words at the end
      barrier = barrier.replace(/\s+\w+$/, '');
      
      // Ensure the barrier is meaningful (more than just the trigger word)
      if (barrier && barrier.split(' ').length > 1) {
        barriers.push(barrier);
      }
    }
  });

  return [...new Set(barriers)]; // Remove duplicates
}

export function determineOverallIndependence(data: IADLData): IndependenceLevel {
  const allLevels = [
    ...Object.values(data.household).map(a => ensureIndependenceLevel(a.independence)),
    ...Object.values(data.community).map(a => ensureIndependenceLevel(a.independence))
  ].filter(level => level !== 'not_applicable') as IndependenceLevel[];

  if (allLevels.length === 0) return 'not_applicable';

  return allLevels.reduce((lowest, current) => 
    LEVEL_ORDER[current] < LEVEL_ORDER[lowest] ? current : lowest
  );
}

export function processCategoryNeeds(
  activities: Record<string, { independence: IndependenceLevel; notes: string }>,
  category: string,
  needs: ProcessedIADLData['supportNeeds']
): void {
  const significantActivities = Object.entries(activities).filter(
    ([_, details]) => 
      details.independence !== 'independent' && 
      details.independence !== 'not_applicable'
  );

  if (significantActivities.length > 0) {
    const barriers = significantActivities
      .map(([_, details]) => extractBarriers(details.notes))
      .flat();

    const worstLevel = significantActivities.reduce((worst, [_, details]) => 
      LEVEL_ORDER[details.independence] < LEVEL_ORDER[worst] ? details.independence : worst
    , 'independent' as IndependenceLevel);

    needs.push({
      category,
      level: worstLevel,
      barriers: [...new Set(barriers)], // Ensure uniqueness
      rationale: `Support needed for ${significantActivities.length} activities in ${category.toLowerCase()} tasks`
    });
  }
}

export function determineSupportType(level: IndependenceLevel): string {
  switch (level) {
    case 'modified_independent':
      return 'Equipment/Environmental modification';
    case 'supervision':
      return 'Supervision only';
    case 'minimal_assistance':
      return 'Minimal physical assistance';
    case 'moderate_assistance':
      return 'Moderate assistance required';
    case 'maximal_assistance':
      return 'Complete support required';
    case 'total_assistance':
      return 'Total assistance required';
    default:
      return 'Support level to be determined';
  }
}

export function determineFrequency(level: IndependenceLevel): string {
  switch (level) {
    case 'modified_independent':
      return 'As needed for setup';
    case 'supervision':
      return 'Throughout activity';
    case 'minimal_assistance':
      return 'Periodic assistance during activity';
    case 'moderate_assistance':
      return 'Regular assistance throughout';
    case 'maximal_assistance':
    case 'total_assistance':
      return 'For entire duration of activity';
    default:
      return 'To be determined';
  }
}

export function determineAdaptation(activity: string, details: { notes: string }): string {
  const defaultAdaptations = ['Environmental modification', 'Assistive devices', 'Task modification'];
  const specificAdaptations = COMMON_ADAPTATIONS[activity] || defaultAdaptations;

  const notesLower = details.notes.toLowerCase();
  return specificAdaptations
    .filter(adaptation => 
      !notesLower.includes(adaptation.toLowerCase()) || 
      notesLower.includes(`needs ${adaptation.toLowerCase()}`)
    )
    .join(', ') || 'To be determined based on detailed assessment';
}

export function generateRationale(activity: string, details: { notes: string; independence: IndependenceLevel }): string {
  const barriers = extractBarriers(details.notes);
  if (barriers.length > 0) {
    return `Support needed due to: ${barriers.join(', ')}`;
  }
  return `Assistance required for safe and effective ${activity} tasks`;
}