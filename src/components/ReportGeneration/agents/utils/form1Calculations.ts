import { Form1Activity, Form1Level1, Form1Level2, Form1Level3, Form1Calculations } from '../types/attendantCare';

export function calculateForm1Hours(activity: Form1Activity | undefined): number {
    return activity?.hours || 0;
}

export function calculateForm1Cost(activity: Form1Activity | undefined): number {
    if (!activity) return 0;
    
    const regularHours = activity.hours * 0.9; // Assuming 90% regular hours
    const holidayHours = activity.hours * 0.1; // Assuming 10% holiday hours
    
    return (regularHours * activity.rate.regular) + 
           (holidayHours * activity.rate.holiday) +
           ((activity.rate.complex || 0) * activity.hours * (activity.complexity ? 0.1 : 0));
}

export function calculateLevel1Totals(level1: Form1Level1): {hours: number, cost: number} {
    // Calculate routine care hours and costs
    const routineHours = Object.values(level1.routinePersonalCare)
        .reduce((total, activity) => total + calculateForm1Hours(activity), 0);
    const routineCost = Object.values(level1.routinePersonalCare)
        .reduce((total, activity) => total + calculateForm1Cost(activity), 0);

    // Calculate overnight care hours and costs
    const overnightHours = Object.values(level1.overnightCare)
        .reduce((total, activity) => total + calculateForm1Hours(activity), 0);
    const overnightCost = Object.values(level1.overnightCare)
        .reduce((total, activity) => total + calculateForm1Cost(activity), 0);

    return {
        hours: routineHours + overnightHours,
        cost: routineCost + overnightCost
    };
}

export function calculateLevel2Totals(level2: Form1Level2): {hours: number, cost: number} {
    // Calculate housekeeping hours and costs
    const housekeepingHours = Object.values(level2.housekeeping)
        .reduce((total, activity) => total + calculateForm1Hours(activity), 0);
    const housekeepingCost = Object.values(level2.housekeeping)
        .reduce((total, activity) => total + calculateForm1Cost(activity), 0);

    // Calculate meal preparation hours and costs
    const mealPrepHours = Object.values(level2.mealPreparation)
        .reduce((total, activity) => total + calculateForm1Hours(activity), 0);
    const mealPrepCost = Object.values(level2.mealPreparation)
        .reduce((total, activity) => total + calculateForm1Cost(activity), 0);

    return {
        hours: housekeepingHours + mealPrepHours,
        cost: housekeepingCost + mealPrepCost
    };
}

export function calculateLevel3Totals(level3: Form1Level3): {hours: number, cost: number} {
    // Calculate coordination hours and costs
    const coordinationHours = Object.values(level3.coordination)
        .reduce((total, activity) => total + calculateForm1Hours(activity), 0);
    const coordinationCost = Object.values(level3.coordination)
        .reduce((total, activity) => total + calculateForm1Cost(activity), 0);

    // Calculate transportation hours and costs
    const transportationHours = Object.values(level3.transportation)
        .reduce((total, activity) => total + calculateForm1Hours(activity), 0);
    const transportationCost = Object.values(level3.transportation)
        .reduce((total, activity) => total + calculateForm1Cost(activity), 0);

    return {
        hours: coordinationHours + transportationHours,
        cost: coordinationCost + transportationCost
    };
}

export function calculateForm1Totals(
    level1: Form1Level1,
    level2: Form1Level2,
    level3: Form1Level3
): Form1Calculations {
    // Calculate level totals
    const level1Totals = calculateLevel1Totals(level1);
    const level2Totals = calculateLevel2Totals(level2);
    const level3Totals = calculateLevel3Totals(level3);

    // Calculate individual component totals for level 1
    const routineTotal = Object.values(level1.routinePersonalCare)
        .reduce((total, activity) => total + calculateForm1Hours(activity), 0);
    const overnightTotal = Object.values(level1.overnightCare)
        .reduce((total, activity) => total + calculateForm1Hours(activity), 0);

    // Calculate individual component totals for level 2
    const housekeepingTotal = Object.values(level2.housekeeping)
        .reduce((total, activity) => total + calculateForm1Hours(activity), 0);
    const mealPrepTotal = Object.values(level2.mealPreparation)
        .reduce((total, activity) => total + calculateForm1Hours(activity), 0);

    // Calculate individual component totals for level 3
    const coordinationTotal = Object.values(level3.coordination)
        .reduce((total, activity) => total + calculateForm1Hours(activity), 0);
    const transportationTotal = Object.values(level3.transportation)
        .reduce((total, activity) => total + calculateForm1Hours(activity), 0);

    // Compile results
    return {
        level1: {
            routineTotal,
            overnightTotal,
            levelTotal: level1Totals.hours,
            monthlyCost: level1Totals.cost
        },
        level2: {
            housekeepingTotal,
            mealPrepTotal,
            levelTotal: level2Totals.hours,
            monthlyCost: level2Totals.cost
        },
        level3: {
            coordinationTotal,
            transportationTotal,
            levelTotal: level3Totals.hours,
            monthlyCost: level3Totals.cost
        },
        summary: {
            totalHours: level1Totals.hours + level2Totals.hours + level3Totals.hours,
            totalCost: level1Totals.cost + level2Totals.cost + level3Totals.cost,
            annualCost: (level1Totals.cost + level2Totals.cost + level3Totals.cost) * 12
        }
    };
}