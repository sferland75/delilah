export const getJointROMScore = (jointId: string, romData: any, joints: any) => {
  const joint = joints[jointId];
  if (!joint) return 'WFL';

  // Extract joint name and map special cases
  const jointMap: { [key: string]: string } = {
    'Lumbar Spine': 'Trunk',
    'Thoracic Spine': 'Trunk'
  };

  const searchName = jointMap[joint.label] || joint.label.split(' ')[0];

  // Look for matching ROM entries
  const jointEntries = Object.entries(romData || {}).filter(([key]) => 
    key.startsWith(searchName)
  );

  console.log(`ROM lookup for ${joint.label} (${searchName}):`, jointEntries);

  if (jointEntries.length === 0) return 'WFL';

  // Find the most limited score
  const scoreValues = {
    'WFL': 0,
    '3/4': 1,
    '1/2': 2,
    '1/4': 3,
    'nominal': 4
  };

  const worstScore = jointEntries.reduce((worst, [_, data]) => {
    if (!data?.score) return worst;
    const currentValue = scoreValues[data.score as keyof typeof scoreValues] || 0;
    const worstValue = scoreValues[worst as keyof typeof scoreValues] || 0;
    return currentValue > worstValue ? data.score : worst;
  }, 'WFL');

  console.log(`Joint ${joint.label} worst ROM score:`, worstScore);
  return worstScore;
};

export const getSegmentMMTGrade = (segmentId: string, mmtData: any, segments: any) => {
  const segment = segments[segmentId];
  if (!segment) return '5';

  // Map segments to their corresponding MMT areas
  const segmentMap: { [key: string]: string[] } = {
    'Lumbar Paraspinals': ['Trunk'],
    'Thoracic Paraspinals': ['Trunk'],
    'lumbarSpine': ['Trunk'],
    'thoracicSpine': ['Trunk'],
    'Upper Abdominals': ['Trunk'],
    'Lower Abdominals': ['Trunk'],
    'Right Lower Leg': ['Knee'],
    'Left Lower Leg': ['Knee']
  };

  const searchTerms = segmentMap[segment.label] || [segment.label.split(' ')[0]];

  // Look for matching MMT entries
  const segmentEntries = Object.entries(mmtData || {}).filter(([key]) =>
    searchTerms.some(term => key.startsWith(term))
  );

  console.log(`MMT lookup for ${segment.label} using terms ${searchTerms}:`, segmentEntries);

  if (segmentEntries.length === 0) return '5';

  // Find the lowest (worst) grade
  const lowestScore = segmentEntries.reduce((lowest, [_, data]) => {
    if (!data?.score) return lowest;
    const currentScore = parseInt(data.score);
    const lowestValue = parseInt(lowest);
    return isNaN(currentScore) ? lowest :
           currentScore < lowestValue ? data.score : lowest;
  }, '5');

  console.log(`Segment ${segment.label} lowest MMT grade:`, lowestScore);
  return lowestScore;
};

export const getJointColor = (jointRom: string) => {
  switch (jointRom) {
    case 'WFL': 
      return "fill-green-200 stroke-green-600 stroke-2";
    case '3/4':
      return "fill-blue-200 stroke-blue-600 stroke-2";
    case '1/2':
      return "fill-yellow-200 stroke-yellow-600 stroke-2";
    case '1/4':
      return "fill-orange-200 stroke-orange-600 stroke-2";
    case 'nominal':
      return "fill-red-200 stroke-red-600 stroke-2";
    default:
      return "fill-green-200 stroke-green-600 stroke-2";
  }
};

export const getSegmentColor = (mmt: string) => {
  const grade = parseInt(mmt);
  switch (grade) {
    case 5: return "fill-green-200 hover:fill-green-300";
    case 4: return "fill-blue-200 hover:fill-blue-300";
    case 3: return "fill-yellow-200 hover:fill-yellow-300";
    case 2: return "fill-orange-200 hover:fill-orange-300";
    case 1: return "fill-red-200 hover:fill-red-300";
    case 0: return "fill-red-400 hover:fill-red-500";
    default: return "fill-green-200 hover:fill-green-300";
  }
};