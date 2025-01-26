import { BasicADLData, IndependenceLevel } from '../ADLTypes';

export const sampleADLData = {
  adl: {
    basic: {
      bathing: {
        shower: {
          notes: "Showers by himself. Has difficulty with left armpit deodorant which his wife does. Unable to wash his feet.",
          independence: "modified_independent" as IndependenceLevel
        },
        grooming: {
          notes: "Cannot put deodorant.",
          independence: "modified_independent" as IndependenceLevel
        },
        oral_care: {
          notes: "",
          independence: "independent" as IndependenceLevel
        },
        toileting: {
          notes: "",
          independence: "independent" as IndependenceLevel
        }
      },
      dressing: {
        upper_body: {
          notes: "",
          independence: "independent" as IndependenceLevel
        },
        lower_body: {
          notes: "Needs help with socks x2\nUses slip-on shoes\nUse long-handled shoe horn",
          independence: "total_assistance" as IndependenceLevel
        },
        footwear: {
          notes: "",
          independence: "maximal_assistance" as IndependenceLevel
        }
      },
      feeding: {
        eating: {
          notes: "His wife always looked after the cooking.\nHe does his eggs in the morning\nDoes not really cook or has any desire to",
          independence: "independent" as IndependenceLevel
        },
        setup: {
          notes: "",
          independence: "independent" as IndependenceLevel
        },
        drinking: {
          notes: "",
          independence: "independent" as IndependenceLevel
        }
      },
      transfers: {
        bed_transfer: {
          notes: "",
          independence: "independent" as IndependenceLevel
        },
        toilet_transfer: {
          notes: "Has a comfort height toilet",
          independence: "modified_independent" as IndependenceLevel
        },
        shower_transfer: {
          notes: "",
          independence: "independent" as IndependenceLevel
        },
        position_changes: {
          notes: "",
          independence: "independent" as IndependenceLevel
        }
      }
    } as BasicADLData
  }
};