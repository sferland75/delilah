export interface Form1Rate {
    regular: number;   // Regular hourly rate
    holiday: number;   // Holiday/weekend rate if applicable
    complex?: number;  // Rate for complex care if applicable
}

export interface Form1Activity {
    hours: number;          // Hours per month
    rate: Form1Rate;        // Applicable rates
    notes?: string;         // Explanatory notes
    frequency?: string;     // How often task is needed
    provider?: string;      // Who provides this care
    complexity?: string;    // Any complex care considerations
}

export interface Form1Level1 {
    routinePersonalCare: {
        dressing?: Form1Activity;
        undressing?: Form1Activity;
        exercises?: Form1Activity;
        transferring?: Form1Activity;
        repositioning?: Form1Activity;
        toileting?: Form1Activity;
        hygiene?: Form1Activity;
        bathing?: Form1Activity;
        basicGrooming?: Form1Activity;
        preventativeSkinCare?: Form1Activity;
        medications?: Form1Activity;
        prosthetics?: Form1Activity;
        other?: Form1Activity;
    };
    overnightCare: {
        turning?: Form1Activity;
        positioning?: Form1Activity;
        toileting?: Form1Activity;
        other?: Form1Activity;
    };
}

export interface Form1Level2 {
    housekeeping: {
        cleaning?: Form1Activity;
        dishes?: Form1Activity;
        bedMaking?: Form1Activity;
        laundry?: Form1Activity;
        other?: Form1Activity;
    };
    mealPreparation: {
        breakfast?: Form1Activity;
        lunch?: Form1Activity;
        dinner?: Form1Activity;
        snacks?: Form1Activity;
        cleanup?: Form1Activity;
        planning?: Form1Activity;
        other?: Form1Activity;
    };
}

export interface Form1Level3 {
    coordination: {
        scheduling?: Form1Activity;
        billPayment?: Form1Activity;
        planning?: Form1Activity;
        banking?: Form1Activity;
        appointments?: Form1Activity;
        supervision?: Form1Activity;
        other?: Form1Activity;
    };
    transportation: {
        medical?: Form1Activity;
        therapy?: Form1Activity;
        shopping?: Form1Activity;
        social?: Form1Activity;
        other?: Form1Activity;
    };
}

export interface Form1Calculations {
    level1: {
        routineTotal: number;
        overnightTotal: number;
        levelTotal: number;
        monthlyCost: number;
    };
    level2: {
        housekeepingTotal: number;
        mealPrepTotal: number;
        levelTotal: number;
        monthlyCost: number;
    };
    level3: {
        coordinationTotal: number;
        transportationTotal: number;
        levelTotal: number;
        monthlyCost: number;
    };
    summary: {
        totalHours: number;
        totalCost: number;
        annualCost: number;
    };
}

export interface Form1Data {
    level1: Form1Level1;
    level2: Form1Level2;
    level3: Form1Level3;
    calculations: Form1Calculations;
    generalNotes?: string[];
    assessor?: {
        name: string;
        credentials: string;
        date: string;
    };
}

export interface AttendantCareOutput {
    valid: boolean;
    data: Form1Data;
}